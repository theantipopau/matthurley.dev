// One-off: pull project logos referenced at the top of each GitHub README
// and save them into public/projects/. Run: node scripts/fetch-readme-logos.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';

const OWNER = 'theantipopau';
const OUT_DIR = path.resolve('public/projects');
const DRY = process.argv.includes('--dry');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const TOKEN = process.env.GITHUB_TOKEN;

const REPOS = [
  'SouthernSpear',
  'southernspear-site',
  'GridPilot',
  'xteve-reborn',
  'ShelfSignal',
  'omencore',
  'slimarr',
  'mousetune',
  'nbncompare',
  'pulselan',
  'pagecue',
  'relaydesk',
  'brightbound_adventures',
  'portrait-stats',
  'aether-control',
  'rigmateau',
  'echoesofriftwar',
  'pccompanion',
  'epic-games-steam-setup',
  'ha-kogan-smarterhome',
  'llamacpp-amd-command-center',
  'windows11nontouchgamingoptimizer',
  'gta5-rockstar-steam-launcher',
  'windows11touchoptimizer',
];
const todo = only.length ? REPOS.filter((r) => only.includes(r)) : REPOS;

const BAD = /shields\.io|badge|fossa|badge\.fury|travis|circleci|github\.com\/.*\/actions|codecov|coveralls|npmjs|pypi|buymeacoffee|ko-fi|discord|svg%22|workflow/i;
const IMG_EXT = /\.(png|jpe?g|webp|gif|ico|svg)(\?|#|$)/i;

const api = async (url, accept = 'application/vnd.github+json') => {
  const res = await fetch(url, {
    headers: {
      Accept: accept,
      'User-Agent': 'matthurley-dev-site',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
};

const extractImages = (md) => {
  const out = [];
  const mdRe = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const htmlRe = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = mdRe.exec(md))) out.push(m[1]);
  while ((m = htmlRe.exec(md))) out.push(m[1]);
  return out;
};

const resolveImg = (src, repo, branch, readmePath) => {
  src = src.trim().replace(/^<|>$/g, '');
  if (src.startsWith('data:')) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) src = src.slice(1);
  // resolve relative to README's directory
  const baseDir = readmePath.includes('/') ? readmePath.slice(0, readmePath.lastIndexOf('/')) : '';
  const parts = (baseDir ? baseDir + '/' + src : src).split('/');
  const stack = [];
  for (const p of parts) {
    if (p === '.' || p === '') continue;
    if (p === '..') stack.pop();
    else stack.push(p);
  }
  return `https://raw.githubusercontent.com/${OWNER}/${repo}/${branch}/${stack.join('/')}`;
};

if (!DRY) fs.mkdirSync(OUT_DIR, { recursive: true });

const report = [];
for (const repo of todo) {
  try {
    const metaRes = await api(`https://api.github.com/repos/${OWNER}/${repo}`);
    const meta = await metaRes.json();
    const branch = meta.default_branch || 'main';

    // raw.githubusercontent.com is not rate-limited; only the meta call uses the API quota
    let md = '';
    for (const name of ['README.md', 'readme.md', 'README', 'docs/README.md']) {
      const r = await fetch(
        `https://raw.githubusercontent.com/${OWNER}/${repo}/${branch}/${name}`,
        { headers: { 'User-Agent': 'matthurley-dev-site' } }
      ).catch(() => null);
      if (r && r.ok) { md = await r.text(); break; }
    }
    if (!md) throw new Error('no README at root');

    const imgs = extractImages(md)
      .map((s) => resolveImg(s, repo, branch, 'README.md')) // READMEs above assume root
      .filter(Boolean)
      .filter((u) => IMG_EXT.test(u))
      .filter((u) => !BAD.test(u));

    // score: logo/icon/brand-named files win; screenshots and social banners lose
    const score = (u) => {
      const n = u.toLowerCase();
      let s = 0;
      if (/(logo|icon|mark|brand|avatar)/.test(n)) s += 10;
      if (/screenshot|docs?\/|menu|dashboard|hero|social|preview|main-window|overview|marketing/.test(n)) s -= 5;
      if (/\.svg(\?|#|$)/.test(n)) s -= 1;
      return s;
    };
    const ranked = [...imgs].sort((a, b) => score(b) - score(a));
    const best = ranked.length ? score(ranked[0]) : -99;
    // only accept a pick if it looks like a logo (screenshots aren't card art)
    const usable = best >= 0 ? ranked : [];

    if (!usable.length) {
      report.push({ repo, pick: null });
      console.log(`${repo}: no image`);
      continue;
    }

    const pick = usable[0];
    report.push({ repo, pick, all: usable.slice(0, 5) });
    console.log(`${repo}: ${pick}`);

    if (!DRY) {
      const extRaw = (pick.match(IMG_EXT) || [,'.png'])[1].toLowerCase().replace('jpeg', 'jpg');
      const ext = extRaw.startsWith('.') ? extRaw : '.' + extRaw;
      const dest = path.join(OUT_DIR, `${repo.toLowerCase()}${ext}`);
      const imgRes = await fetch(pick, { headers: { 'User-Agent': 'matthurley-dev-site' } });
      if (!imgRes.ok) throw new Error(`img ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`  -> ${path.relative('.', dest)} (${buf.length} bytes)`);
    }
  } catch (e) {
    report.push({ repo, error: String(e) });
    console.log(`${repo}: ERROR ${e.message}`);
  }
}

fs.writeFileSync('scripts/readme-logos-report.json', JSON.stringify(report, null, 2));
