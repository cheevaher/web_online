import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    welcome: 'Welcome back',
    startLearning: 'Start Learning',
    login: 'Login',
    register: 'Register'
  },
  la: {
    welcome: 'ຍິນດີຕ້ອນຮັບກັບຄືນ',
    startLearning: 'ເລີ່ມຮຽນ',
    login: 'ເຂົ້າລະບົບ',
    register: 'ລົງທະບຽນ'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);