import { useTranslate } from '../hooks/useTranslation';

interface TranslateProps {
  /** The text to translate (in the source language). */
  children: string;
  /** Source language code (default: 'en'). */
  from?: string;
}

/**
 * Inline translation component.
 * Usage: <T>Hello World</T>
 * Will auto-translate to the current language.
 */
export function T({ children, from = 'en' }: TranslateProps) {
  const translated = useTranslate(children || '', from);
  return <>{translated}</>;
}
