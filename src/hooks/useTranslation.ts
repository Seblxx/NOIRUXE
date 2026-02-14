import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateSingle, translateBatch } from '../services/translationService';

/**
 * Hook to translate a single string. Returns the translated string
 * (shows original while loading, then swaps to translated).
 */
export function useTranslate(text: string, sourceLang: string = 'en'): string {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text || language === sourceLang) {
      setTranslated(text);
      return;
    }

    let cancelled = false;

    translateSingle(text, sourceLang, language).then((result) => {
      if (!cancelled) {
        setTranslated(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [text, language, sourceLang]);

  return translated;
}

/**
 * Hook to translate multiple strings at once (batched for efficiency).
 * Returns an array of translated strings in the same order.
 */
export function useTranslateBatch(texts: string[], sourceLang: string = 'en'): string[] {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState<string[]>(texts);
  const textsKey = texts.join('|||');

  useEffect(() => {
    if (language === sourceLang) {
      setTranslated(texts);
      return;
    }

    let cancelled = false;

    translateBatch(texts, sourceLang, language).then((results) => {
      if (!cancelled) {
        setTranslated(results);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [textsKey, language, sourceLang]);

  return translated;
}

/**
 * Hook that returns a translate function you can call imperatively.
 * Useful for translating dynamic content or event handlers.
 */
export function useTranslateFunc() {
  const { language } = useLanguage();

  const translate = useCallback(
    async (text: string, sourceLang: string = 'en'): Promise<string> => {
      if (!text || language === sourceLang) return text;
      return translateSingle(text, sourceLang, language);
    },
    [language]
  );

  return translate;
}

/**
 * Hook to translate an object's field — picks `_en` or `_fr` field,
 * and if the target language field is missing, auto-translates from the other.
 */
export function useTranslateField<T extends Record<string, any>>(
  obj: T | undefined | null,
  fieldPrefix: string
): string {
  const { language } = useLanguage();
  const enField = `${fieldPrefix}_en` as keyof T;
  const frField = `${fieldPrefix}_fr` as keyof T;

  const enValue = obj ? String(obj[enField] || '') : '';
  const frValue = obj ? String(obj[frField] || '') : '';

  // If the target language field exists and is not empty, use it directly
  const directValue = language === 'fr' ? frValue : enValue;
  const fallbackValue = language === 'fr' ? enValue : frValue;
  const sourceLang = language === 'fr' ? 'en' : 'fr';

  const [translated, setTranslated] = useState(directValue || fallbackValue);

  useEffect(() => {
    // If direct value exists, use it
    if (directValue) {
      setTranslated(directValue);
      return;
    }

    // If no direct value but fallback exists, translate it
    if (fallbackValue) {
      let cancelled = false;
      translateSingle(fallbackValue, sourceLang, language).then((result) => {
        if (!cancelled) {
          setTranslated(result);
        }
      });
      return () => {
        cancelled = true;
      };
    }

    setTranslated('');
  }, [directValue, fallbackValue, language, sourceLang]);

  return translated;
}
