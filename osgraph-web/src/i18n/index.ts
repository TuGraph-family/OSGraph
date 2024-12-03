/**
 * file: i18n config
 * author: Allen
*/

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import zh from "./zh/translation.json";
import en from "./en/translation.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: 'zh',
    preload: ['zh', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

