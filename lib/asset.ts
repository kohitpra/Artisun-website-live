// Prefix for public/ assets when the site is served from a subpath (e.g.
// GitHub Pages at /artisun). Empty in local dev, where the site is at the root.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string) => `${BASE_PATH}${path}`;
