// Per-build id used as a cache-buster query on /js/* assets.
//
// Those filenames aren't content-hashed, so a returning browser (typically a
// phone that visited before a deploy) can keep executing the previous
// deploy's JS against the new HTML — dead buttons, missing nav. Evaluating
// once per build process keeps the id identical across every page, so each
// deploy changes the URLs exactly once.
export const BUILD_ID = Date.now().toString(36);

/** `/js/site.js?v=…` for the current build. */
export const jsAsset = (file: string): string => `/js/${file}?v=${BUILD_ID}`;
