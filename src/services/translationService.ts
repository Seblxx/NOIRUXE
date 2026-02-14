/**
 * Translation Service using Google Translate API (free tier via unofficial endpoint).
 * Includes in-memory caching and localStorage persistence to minimize API calls.
 */

const CACHE_KEY = 'translation_cache';
const BATCH_DELAY = 50; // ms to batch requests

// In-memory cache
let translationCache: Record<string, string> = {};

// Load cache from localStorage on init
try {
  const saved = localStorage.getItem(CACHE_KEY);
  if (saved) {
    translationCache = JSON.parse(saved);
  }
} catch {
  translationCache = {};
}

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(translationCache));
  } catch {
    // localStorage full, clear old entries
    translationCache = {};
  }
}

function getCacheKey(text: string, from: string, to: string): string {
  return `${from}:${to}:${text}`;
}

/**
 * Translate a single string using Google Translate free endpoint.
 */
async function translateSingle(text: string, from: string, to: string): Promise<string> {
  if (!text || !text.trim()) return text;
  if (from === to) return text;

  const cacheKey = getCacheKey(text, from, to);
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Translation API error:', response.status);
      return text;
    }

    const data = await response.json();
    
    // Google returns nested arrays: [[["translated text","original text",null,null,10]],null,"en"]
    let translated = '';
    if (data && data[0]) {
      for (const segment of data[0]) {
        if (segment[0]) {
          translated += segment[0];
        }
      }
    }

    if (translated) {
      translationCache[cacheKey] = translated;
      saveCache();
      return translated;
    }

    return text;
  } catch (error) {
    console.warn('Translation failed for:', text, error);
    return text;
  }
}

/**
 * Translate multiple strings in a single batch (joins with newlines, then splits).
 * Much more efficient than translating one by one.
 */
async function translateBatch(texts: string[], from: string, to: string): Promise<string[]> {
  if (from === to) return texts;

  const results: string[] = new Array(texts.length);
  const toTranslate: { index: number; text: string }[] = [];

  // Check cache first
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    if (!text || !text.trim()) {
      results[i] = text;
      continue;
    }
    const cacheKey = getCacheKey(text, from, to);
    if (translationCache[cacheKey]) {
      results[i] = translationCache[cacheKey];
    } else {
      toTranslate.push({ index: i, text });
    }
  }

  if (toTranslate.length === 0) return results;

  // Use a separator that won't appear in normal text
  const separator = '\n\u2588\n';
  const joined = toTranslate.map((t) => t.text).join(separator);

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(joined)}`;
    const response = await fetch(url);

    if (!response.ok) {
      // Fallback: return originals
      for (const item of toTranslate) {
        results[item.index] = item.text;
      }
      return results;
    }

    const data = await response.json();
    let fullTranslated = '';
    if (data && data[0]) {
      for (const segment of data[0]) {
        if (segment[0]) {
          fullTranslated += segment[0];
        }
      }
    }

    // Split back
    const parts = fullTranslated.split(/\s*\u2588\s*/);

    for (let i = 0; i < toTranslate.length; i++) {
      const translated = parts[i]?.trim() || toTranslate[i].text;
      results[toTranslate[i].index] = translated;
      const cacheKey = getCacheKey(toTranslate[i].text, from, to);
      translationCache[cacheKey] = translated;
    }

    saveCache();
  } catch (error) {
    console.warn('Batch translation failed:', error);
    for (const item of toTranslate) {
      results[item.index] = item.text;
    }
  }

  return results;
}

/**
 * Clear translation cache (useful for debugging).
 */
function clearCache() {
  translationCache = {};
  localStorage.removeItem(CACHE_KEY);
}

export { translateSingle, translateBatch, clearCache };
