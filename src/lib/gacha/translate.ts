// MyMemory translation client (https://mymemory.translated.net/doc/spec.php).
// Free tier, 5000 chars/day per IP, no API key required. Swap to Google Cloud
// Translation or DeepL in V1.1 if quality complaints surface.

export type TranslateResult =
  | { ok: true; text: string }
  | { ok: false; error: string }

const ENDPOINT = 'https://api.mymemory.translated.net/get'

export async function translateText(
  text: string,
  sourceLocale: string,
  targetLocale: string,
): Promise<TranslateResult> {
  if (!text.trim()) return { ok: true, text: '' }
  if (sourceLocale === targetLocale) return { ok: true, text }

  const url = new URL(ENDPOINT)
  url.searchParams.set('q', text)
  url.searchParams.set('langpair', `${sourceLocale}|${targetLocale}`)

  try {
    const res = await fetch(url.toString())
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
    const data = (await res.json()) as MyMemoryResponse
    if (data.responseStatus !== 200) {
      return {
        ok: false,
        error: data.responseDetails ?? 'Translation failed',
      }
    }
    const translated = data.responseData?.translatedText
    if (typeof translated !== 'string') {
      return { ok: false, error: 'Translation response missing text' }
    }
    return { ok: true, text: translated }
  } catch (err) {
    return {
      ok: false,
      error: (err as Error).message || 'Network error',
    }
  }
}

interface MyMemoryResponse {
  responseStatus?: number
  responseDetails?: string
  responseData?: { translatedText?: string }
}
