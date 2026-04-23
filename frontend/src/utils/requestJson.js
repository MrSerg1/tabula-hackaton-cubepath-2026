/**
 * @template T
 * @param {string | URL} url
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
export async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return payload;
}
