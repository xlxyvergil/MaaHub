const baseUrl = import.meta.env.BASE_URL ?? '/';

export function sitePath(path = '') {
  if (!path) {
    return baseUrl;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return `${normalizedBase}${normalizedPath}`;
}
