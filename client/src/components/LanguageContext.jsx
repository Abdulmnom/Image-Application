import React , { createContext , useEffect , useState} from "react";

export const LanguageContext = createContext();

const defaultLang = localStorage.getItem('lang') || 'en';

const translations = {
  ar: {
    home: 'الرئيسية',
    upload: 'رفع صورة',
    gallery: 'صوري',
    profile: 'الملف الشخصي',
    login: 'دخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    welcome: 'مرحبًا',
    light: '☀️ نهار',
    dark: '🌙 ليل',
    language: 'اللغة'
  },
  en: {
    home: 'Home',
    upload: 'Upload',
    gallery: 'My Gallery',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    welcome: 'Welcome',
    light: '☀️ Light',
    dark: '🌙 Dark',
    language: 'Language'
  }
};

export const LanguageContextProvider = ({ children}) => {
  const [lang, setLang] = useState(defaultLang);

  useEffect(()=> {
    localStorage.setItem('lang', lang);
  }, [lang]);
  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const t = (key) =>  {
    const selectedLang = translations[lang] || translations.en;
    return selectedLang[key] || key;
  }

  return (
    <LanguageContext.Provider value={{lang , toggleLang ,t}}>
      {children}
    </LanguageContext.Provider>
  )
}
