export type Language =
  | 'en'
  | 'te'
  | 'hi'
  | 'fr'
  | 'es'
  | 'de'
  | 'ta'
  | 'kn'
  | 'ml'
  | 'bn'
  | 'mr'
  | 'ja';

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
  { code: 'de', label: 'Deutsch', englishName: 'German' },
  { code: 'ta', label: 'தமிழ்', englishName: 'Tamil' },
  { code: 'kn', label: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'ml', label: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'bn', label: 'বাংলা', englishName: 'Bengali' },
  { code: 'mr', label: 'मराठी', englishName: 'Marathi' },
  { code: 'ja', label: '日本語', englishName: 'Japanese' },
];

export type TranslationDictionary = Record<string, string>;
