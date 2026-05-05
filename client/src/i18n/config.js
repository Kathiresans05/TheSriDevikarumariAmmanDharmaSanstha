import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "about": "About Us",
        "pooja": "Pooja & Seva",
        "gallery": "Gallery",
        "events": "Events",
        "donations": "Donations",
        "contact": "Contact"
      },
      "hero": {
        "title": "The Sri Devikarumari Amman Dharma Sanstha",
        "subtitle": "Experience the Divine Grace of Goddess Devikarumari",
        "welcome": "Welcome to our sacred temple"
      }
    }
  },
  ta: {
    translation: {
      "nav": {
        "home": "முகப்பு",
        "about": "எங்களைப் பற்றி",
        "pooja": "பூஜை மற்றும் சேவா",
        "gallery": "புகைப்படங்கள்",
        "events": "நிகழ்வுகள்",
        "donations": "நன்கொடைகள்",
        "contact": "தொடர்பு"
      },
      "hero": {
        "title": "ஸ்ரீ தேவிகருமாரி அம்மன் தர்ம சன்ஸ்தா",
        "subtitle": "தேவி கருமாரியின் தெய்வீக அருளைப் பெறுங்கள்",
        "welcome": "எங்கள் புனித ஆலயத்திற்கு உங்களை வரவேற்கிறோம்"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
