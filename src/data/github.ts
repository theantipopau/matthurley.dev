export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  language: string | null;
  url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  updatedAt: string;
}

// Snapshot taken 6 October 2026 — used whenever the GitHub API is unreachable
// (offline builds, rate limits) so `npm run build` never fails on the network.
const FALLBACK_REPOS: GitHubRepo[] = [
  { name: 'omencore', description: 'Advanced performance control for HP Omen laptops — fan tuning, RGB, hardware monitoring, and optimisation.', stars: 243, language: 'C#', url: 'https://github.com/theantipopau/omencore', homepage: 'https://omencore.info', topics: ['hp-omen', 'hardware', 'dotnet'], fork: false, updatedAt: '2026-10-01' },
  { name: 'slimarr', description: 'Automatically shrink your Plex library — find smaller, better-compressed releases on Usenet and replace bloated files overnight.', stars: 22, language: 'Python', url: 'https://github.com/theantipopau/slimarr', homepage: null, topics: ['plex', 'usenet', 'automation'], fork: false, updatedAt: '2026-09-20' },
  { name: 'windows11nontouchgamingoptimizer', description: 'A Windows 11 optimisation script for gamers on non-touch devices that want the best performance from their systems.', stars: 14, language: 'Batchfile', url: 'https://github.com/theantipopau/windows11nontouchgamingoptimizer', homepage: null, topics: ['windows', 'gaming'], fork: false, updatedAt: '2026-08-30' },
  { name: 'gta5-rockstar-steam-launcher', description: 'Auto-launch GTA V Enhanced through Rockstar Games Launcher when added as a Steam non-Steam game.', stars: 5, language: 'PowerShell', url: 'https://github.com/theantipopau/gta5-rockstar-steam-launcher', homepage: null, topics: ['steam', 'gaming'], fork: false, updatedAt: '2026-09-05' },
  { name: 'xteve-reborn', description: 'A modernised, actively-maintained fork of xteve — M3U/EPG proxy for Plex DVR, Emby and Jellyfin Live TV.', stars: 5, language: 'Go', url: 'https://github.com/theantipopau/xteve-reborn', homepage: 'https://theantipopau.github.io/xteve-reborn/', topics: ['plex', 'iptv', 'go'], fork: false, updatedAt: '2026-09-28' },
  { name: 'windows11touchoptimizer', description: 'A Windows 11 optimisation script aimed at touchscreen devices with limited hardware.', stars: 2, language: 'PowerShell', url: 'https://github.com/theantipopau/windows11touchoptimizer', homepage: null, topics: ['windows'], fork: false, updatedAt: '2026-08-12' },
  { name: 'nbncompare', description: 'A website for comparing NBN plans, with updated prices, no sponsors or ads.', stars: 1, language: 'TypeScript', url: 'https://github.com/theantipopau/nbncompare', homepage: 'https://nbncompare.info', topics: ['nbn', 'australia'], fork: false, updatedAt: '2026-07-18' },
  { name: 'rigmateau', description: 'Australia-focused PC builder and price comparison platform.', stars: 1, language: 'TypeScript', url: 'https://github.com/theantipopau/rigmateau', homepage: null, topics: ['nextjs', 'cloudflare'], fork: false, updatedAt: '2026-07-05' },
  { name: 'iptv_4u', description: '', stars: 1, language: 'JavaScript', url: 'https://github.com/theantipopau/iptv_4u', homepage: null, topics: [], fork: false, updatedAt: '2026-10-06' },
  { name: 'KytyPS5', description: 'PlayStation 5 emulator for Windows, Linux and MacOS', stars: 1, language: 'C++', url: 'https://github.com/theantipopau/KytyPS5', homepage: null, topics: [], fork: true, updatedAt: '2026-10-06' },
  { name: 'SouthernSpear', description: 'Southern Spear — free, original, Australian-inspired tactical multiplayer FPS on Unreal Engine 5.8 / Lyra (pre-alpha).', stars: 0, language: 'C++', url: 'https://github.com/theantipopau/SouthernSpear', homepage: 'https://theantipopau.github.io/southernspear-site/', topics: ['unreal-engine', 'game', 'fps'], fork: false, updatedAt: '2026-10-06' },
  { name: 'southernspear-site', description: 'Website and public development log for Southern Spear (fictional tactical FPS, pre-alpha).', stars: 0, language: 'HTML', url: 'https://github.com/theantipopau/southernspear-site', homepage: 'https://theantipopau.github.io/southernspear-site/', topics: ['game', 'docs'], fork: false, updatedAt: '2026-10-06' },
  { name: 'GridPilot', description: 'A local-first co-pilot for school timetabling — ingest a Timetabling Solutions export, analyse it, propose and validate edits, export a re-importable file.', stars: 0, language: 'Python', url: 'https://github.com/theantipopau/GridPilot', homepage: null, topics: ['education', 'local-first'], fork: false, updatedAt: '2026-10-06' },
  { name: 'ShelfSignal', description: 'Barcode-first price monitoring for Australian households. Flutter app + Express/PostgreSQL signal engine.', stars: 0, language: 'JavaScript', url: 'https://github.com/theantipopau/ShelfSignal', homepage: null, topics: ['flutter', 'price-tracking'], fork: false, updatedAt: '2026-09-30' },
  { name: 'runewake', description: '', stars: 0, language: 'Java', url: 'https://github.com/theantipopau/runewake', homepage: null, topics: [], fork: false, updatedAt: '2026-10-06' },
  { name: 'aether-control', description: 'All-in-one hardware monitoring, portrait display, Windows optimisation, and RGB control suite for custom gaming PCs.', stars: 0, language: 'C#', url: 'https://github.com/theantipopau/aether-control', homepage: null, topics: ['hardware', 'winui'], fork: false, updatedAt: '2026-09-22' },
  { name: 'brightbound_adventures', description: 'Educational adventure app for children aged 4-12. Flutter web app with literacy games and ACARA-aligned content.', stars: 0, language: 'Dart', url: 'https://github.com/theantipopau/brightbound_adventures', homepage: 'https://playbrightbound.matthurley.dev', topics: ['education', 'flutter'], fork: false, updatedAt: '2026-09-15' },
  { name: 'echoesofriftwar', description: 'A Babylon.js-powered action RPG focused on modular systems for combat, quests, inventory, and reactive world progression.', stars: 0, language: 'TypeScript', url: 'https://github.com/theantipopau/echoesofriftwar', homepage: null, topics: ['babylonjs', 'game'], fork: false, updatedAt: '2026-09-01' },
  { name: 'epic-games-steam-setup', description: 'Interactive wizard that sets up any installed Epic Games Store title to launch correctly as a Steam non-Steam game.', stars: 0, language: 'PowerShell', url: 'https://github.com/theantipopau/epic-games-steam-setup', homepage: null, topics: ['steam', 'gaming'], fork: false, updatedAt: '2026-08-20' },
  { name: 'ha-kogan-smarterhome', description: 'Home Assistant custom integration for Kogan SmarterHome (Tuya-based) devices — local polling, no cloud required.', stars: 0, language: 'Python', url: 'https://github.com/theantipopau/ha-kogan-smarterhome', homepage: null, topics: ['home-assistant'], fork: false, updatedAt: '2026-07-25' },
  { name: 'llamacpp-amd-command-center', description: 'A colourful hardware-aware Windows command center for llama.cpp, local models, and VS Code.', stars: 0, language: 'PowerShell', url: 'https://github.com/theantipopau/llamacpp-amd-command-center', homepage: null, topics: ['llm', 'windows'], fork: false, updatedAt: '2026-07-11' },
  { name: 'mousetune', description: 'Portable Windows utility for inexpensive or generic Bluetooth mice that have no manufacturer software.', stars: 0, language: 'C#', url: 'https://github.com/theantipopau/mousetune', homepage: null, topics: ['windows', 'utility'], fork: false, updatedAt: '2026-08-08' },
  { name: 'pagecue', description: 'A spoiler-safe reading companion that helps readers remember what happened in a book up to their current page.', stars: 0, language: 'TypeScript', url: 'https://github.com/theantipopau/pagecue', homepage: null, topics: ['reading', 'ai'], fork: false, updatedAt: '2026-08-25' },
  { name: 'pccompanion', description: 'Radium PCs Companion — local-first Windows telemetry, diagnostics, and maintenance companion.', stars: 0, language: 'TypeScript', url: 'https://github.com/theantipopau/pccompanion', homepage: null, topics: ['tauri', 'rust'], fork: false, updatedAt: '2026-09-18' },
  { name: 'portrait-stats', description: 'A system monitor dashboard, purpose-built for a portrait secondary monitor.', stars: 0, language: 'C#', url: 'https://github.com/theantipopau/portrait-stats', homepage: null, topics: ['monitoring'], fork: false, updatedAt: '2026-07-30' },
  { name: 'pulselan', description: 'PulseLAN is a local-first network monitoring and security analysis tool that maps devices and analyses traffic.', stars: 0, language: 'TypeScript', url: 'https://github.com/theantipopau/pulselan', homepage: null, topics: ['network', 'security'], fork: false, updatedAt: '2026-09-12' },
  { name: 'relaydesk', description: 'A desktop and web based RDP solution.', stars: 0, language: 'TypeScript', url: 'https://github.com/theantipopau/relaydesk', homepage: null, topics: ['tauri', 'rust'], fork: false, updatedAt: '2026-06-20' },
  { name: 'sharpemu', description: 'An experimental PlayStation 5 emulator for Windows, Linux and macOS.', stars: 0, language: 'C#', url: 'https://github.com/theantipopau/sharpemu', homepage: 'https://sharpemu.app', topics: [], fork: true, updatedAt: '2026-10-04' },
  { name: 'Win11VM-ServerOptimizer', description: '', stars: 0, language: 'PowerShell', url: 'https://github.com/theantipopau/Win11VM-ServerOptimizer', homepage: null, topics: [], fork: false, updatedAt: '2026-06-02' }
];

interface RawRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  fork: boolean;
  updated_at: string;
}

const CACHE_KEY = '__matthurleyGithubRepos';

function normalise(raw: RawRepo[]): GitHubRepo[] {
  return raw.map((r) => ({
    name: r.name,
    description: r.description ?? '',
    stars: r.stargazers_count ?? 0,
    language: r.language ?? null,
    url: r.html_url,
    homepage: r.homepage || null,
    topics: r.topics ?? [],
    fork: Boolean(r.fork),
    updatedAt: r.updated_at ?? ''
  }));
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'matthurley.dev-build'
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch('https://api.github.com/users/theantipopau/repos?per_page=100', {
    headers,
    signal: AbortSignal.timeout(8000)
  });

  if (!res.ok) {
    throw new GitHubFetchError(`GitHub responded ${res.status}`);
  }

  const raw = (await res.json()) as RawRepo[];
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new GitHubFetchError('GitHub returned no repositories');
  }
  return normalise(raw);
}

class GitHubFetchError extends Error {}

/**
 * Fetches the repository list once per build (memoised on globalThis so
 * shared module instances across pages don't re-request). Falls back to the
 * embedded snapshot when the network is unavailable, and logs why.
 */
export async function getRepos(): Promise<GitHubRepo[]> {
  const store = globalThis as typeof globalThis & { [CACHE_KEY]?: Promise<GitHubRepo[]> };
  if (!store[CACHE_KEY]) {
    store[CACHE_KEY] = fetchRepos().catch((error: unknown) => {
      const reason = error instanceof Error ? error.message : String(error);
      console.warn(`[github] Falling back to snapshot data — ${reason}`);
      return FALLBACK_REPOS;
    });
  }
  return store[CACHE_KEY];
}

/** Own repositories sorted by stars, most popular first. */
export async function getPopularRepos(limit = 6): Promise<GitHubRepo[]> {
  const repos = await getRepos();
  return repos
    .filter((repo) => !repo.fork && repo.stars > 0)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, limit);
}

/** Look up a single repository by name (snapshot data if the API failed). */
export async function getRepo(name: string): Promise<GitHubRepo | undefined> {
  const repos = await getRepos();
  return repos.find((repo) => repo.name.toLowerCase() === name.toLowerCase());
}

/** Total stars across own repositories. */
export async function getStarTotal(): Promise<number> {
  const repos = await getRepos();
  return repos.filter((repo) => !repo.fork).reduce((sum, repo) => sum + repo.stars, 0);
}

/** Count of public repositories (forks excluded). */
export async function getProjectCount(): Promise<number> {
  const repos = await getRepos();
  return repos.filter((repo) => !repo.fork).length;
}

/** Formatting helper so star counts read as "243★" consistently. */
export function formatStars(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(count);
}
