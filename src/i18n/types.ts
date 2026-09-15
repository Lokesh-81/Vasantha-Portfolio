export type Language = 'en' | 'te' | 'hi' | 'fr' | 'es';

export interface LanguageOption {
  code: Language;
  label: string;
  englishName: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', englishName: 'English' },
  { code: 'te', label: 'తెలుగు', englishName: 'Telugu' },
  { code: 'hi', label: 'हिन्दी', englishName: 'Hindi' },
  { code: 'fr', label: 'Français', englishName: 'French' },
  { code: 'es', label: 'Español', englishName: 'Spanish' },
];

export type TranslationDictionary = Record<string, string>;
