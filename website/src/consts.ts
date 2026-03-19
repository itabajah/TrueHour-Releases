/** App metadata — fetches version from latest GitHub release at build time. */
export const APP_NAME = "TrueHour";

const REPO = "itabajah/TrueHour-Releases";
const FALLBACK_VERSION = "1.0.0";

let _version: string | null = null;

export async function getAppVersion(): Promise<string> {
  if (_version) return _version;
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
    const token = typeof process !== "undefined" ? process.env.GITHUB_TOKEN : undefined;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers });
    if (res.ok) {
      const data = await res.json();
      const tag: string = data.tag_name ?? "";
      _version = tag.replace(/^v/, "") || FALLBACK_VERSION;
    } else {
      _version = FALLBACK_VERSION;
    }
  } catch {
    _version = FALLBACK_VERSION;
  }
  return _version;
}
