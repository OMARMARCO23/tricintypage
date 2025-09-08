import React, { createContext, useContext, useEffect, useState, useMemo } from 'https://aistudiocdn.com/react@^19.1.1';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { DEFAULT_MOROCCAN_TARIFFS } from '../constants.js';
import WelcomeModal from '../components/WelcomeModal.js';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [translations, setTranslations] = useState(null);
  const [readings, setReadings] = useLocalStorage('tricinty-readings', []);
  const [settings, setSettings] = useLocalStorage('tricinty-settings', {
    theme: 'light',
    language: 'fr', // Default language set to French
    country: 'MA',
    provider: 'ONEE',
    tariffs: DEFAULT_MOROCCAN_TARIFFS,
    currency: 'MAD',
    monthlyGoal: 0,
  });
  const [hasOnboarded, setHasOnboarded] = useLocalStorage('tricinty-onboarded', false);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enRes, frRes, arRes] = await Promise.all([
          fetch('./i18n/en.json'),
          fetch('./i18n/fr.json'),
          fetch('./i18n/ar.json'),
        ]);

        if (!enRes.ok || !frRes.ok || !arRes.ok) {
          throw new Error('Failed to fetch translation files');
        }
        
        const en = await enRes.json();
        const fr = await frRes.json();
        const ar = await arRes.json();
        setTranslations({ en, fr, ar });
      } catch (error) {
        console.error("Failed to load translations:", error);
        try {
            const enRes = await fetch('./i18n/en.json');
            const en = await enRes.json();
            setTranslations({ en, fr: en, ar: en }); // Fallback
        } catch (fallbackError) {
            console.error("Failed to load fallback English translation:", fallbackError);
        }
      }
    };

    fetchTranslations();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(settings.theme === 'light' ? 'dark' : 'light');
    root.classList.add(settings.theme);
    root.lang = settings.language;
    root.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  }, [settings.theme, settings.language]);

  const addReading = (reading) => {
    const newReading = { id: new Date().toISOString(), ...reading };
    const sortedReadings = [...readings, newReading].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setReadings(sortedReadings);
  };
  
  const updateReading = (updatedReading) => {
    const updatedReadings = readings.map(r => r.id === updatedReading.id ? updatedReading : r);
    const sortedReadings = updatedReadings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setReadings(sortedReadings);
  };

  const deleteReading = (id) => {
    setReadings(readings.filter(r => r.id !== id));
  };
  
  const clearReadings = () => {
    setReadings([]);
  };

  const setTheme = (theme) => {
    setSettings(s => ({...s, theme}));
  }

  const setLanguage = (lang) => {
    setSettings(s => ({...s, language: lang}));
  }
  
  const setCountry = (country) => {
    const isMorocco = country === 'MA';
    setSettings(s => ({
        ...s, 
        country,
        provider: isMorocco ? 'ONEE' : '',
        tariffs: isMorocco ? DEFAULT_MOROCCAN_TARIFFS : [],
        currency: isMorocco ? 'MAD' : '', // Clear currency if not Morocco
    }));
  }

  const setCurrency = (currency) => {
    setSettings(s => ({...s, currency}));
  }

  const t = (key) => {
    if (!translations) {
      return key;
    }
    const langDict = translations[settings.language];
    const fallbackDict = translations.en;
    return langDict?.[key] || fallbackDict?.[key] || key;
  };
  
  const handleOnboardingComplete = (country) => {
      setCountry(country);
      setHasOnboarded(true);
  }

  const contextValue = useMemo(() => ({
    readings,
    addReading,
    updateReading,
    deleteReading,
    clearReadings,
    settings,
    setSettings,
    theme: settings.theme,
    setTheme,
    language: settings.language,
    setLanguage,
    setCountry,
    currency: settings.currency,
    setCurrency,
    t
  }), [readings, settings, translations]);

  if (!translations) {
    return React.createElement("div", {
      className: "fixed inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center"
    }, React.createElement("div", {
      className: "animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"
    }));
  }

  return React.createElement(AppContext.Provider, {
    value: contextValue
  }, !hasOnboarded && React.createElement(WelcomeModal, { onComplete: handleOnboardingComplete }), hasOnboarded && children);
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};