const legacyCdnHost = 'https://cdn.perpetuity.dev';
const currentCdnHost = 'https://cdn.100xadi.com';

export function normalizeImageUrl(url: string | null | undefined) {
  if (!url)
    return url;

  return url.replace(legacyCdnHost, currentCdnHost);
}
