import { useState, useEffect } from "react";

let currentLanguage = "ta";
const listeners = new Set();

function setGlobalLanguage(lang) {
  currentLanguage = lang;
  listeners.forEach((listener) => listener(lang));
}

export function useLanguage() {
  const [language, setLanguageState] = useState(currentLanguage);

  useEffect(() => {
    const listener = (lang) => setLanguageState(lang);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const setLanguage = (lang) => setGlobalLanguage(lang);
  const toggleLanguage = () => setGlobalLanguage(currentLanguage === "ta" ? "en" : "ta");

  return { language, setLanguage, toggleLanguage };
}