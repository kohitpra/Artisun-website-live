/**
 * Static export for GitHub Pages / plain Apache hosting (`npm run build:static`).
 *
 * `output: 'export'` can't include server route handlers, so app/api (the
 * newsletter signup and the one-time Shopify token page) is moved to a
 * private folder for the duration of the build and always moved back.
 * Folders starting with "_" are ignored by the App Router.
 *
 * The static site therefore has no /api/subscribe. Point the forms at a
 * server deploy with NEXT_PUBLIC_SUBSCRIBE_ENDPOINT if you need signups there.
 */
import { existsSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const API = 'app/api';
const PARKED = 'app/_api_static_export_parked';

if (existsSync(PARKED)) {
  console.error(`${PARKED} already exists — a previous run was interrupted. Move it back to ${API} first.`);
  process.exit(1);
}

const moved = existsSync(API);
if (moved) renameSync(API, PARKED);

let status = 1;
try {
  const r = spawnSync('npx', ['next', 'build'], {
    stdio: 'inherit',
    env: { ...process.env, STATIC_EXPORT: '1' },
    shell: process.platform === 'win32',
  });
  status = r.status ?? 1;
} finally {
  if (moved) renameSync(PARKED, API);
}
process.exit(status);
