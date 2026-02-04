import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import id from './translations/id';
import es from './translations/es';
import fr from './translations/fr';
import de from './translations/de';
import jp from './translations/jp';

const resources = {
  en: en,
  id: id,
  es: es,
  fr: fr,
  de: de,
  jp: jp
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
