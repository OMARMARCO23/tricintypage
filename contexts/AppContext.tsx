import React, { createContext, useContext, useEffect, useState, useMemo } from 'https://aistudiocdn.com/react@^19.1.1';
import { Reading, Settings, Theme, Language, Tariff } from '../types.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';
import { DEFAULT_MOROCCAN_TARIFFS } from '../constants.ts';
import WelcomeModal from '../components/WelcomeModal.tsx';

type Translations = Record<Language, Record<string, string>>;

interface AppContextType {
  readings: Reading[];
  addReading: (reading: Omit<Reading, 'id'>) => void;
  updateReading: (reading: Reading) => void;
  deleteReading: (id: string) => void;
  clearReadings: () => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  setCountry: (country: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [readings, setReadings] = useLocalStorage<Reading[]>('tricinty-readings', []);
  const [settings, setSettings] = useLocalStorage<Settings>('tricinty-settings', {
    theme: 'light',
    language: 'fr', // Default language set to French
    country: 'MA',
    provider: 'ONEE',
    tariffs: DEFAULT_MOROCCAN_TARIFFS,
    currency: 'MAD',
    monthlyGoal: 0,
  });
  const [hasOnboarded, setHasOnboarded] = useLocalStorage<boolean>('tricinty-onboarded', false);

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

  const addReading = (reading: Omit<Reading, 'id'>) => {
    const newReading: Reading = { id: new Date().toISOString(), ...reading };
    const sortedReadings = [...readings, newReading].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setReadings(sortedReadings);
  };
  
  const updateReading = (updatedReading: Reading) => {
    const updatedReadings = readings.map(r => r.id === updatedReading.id ? updatedReading : r);
    const sortedReadings = updatedReadings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setReadings(sortedReadings);
  };

  const deleteReading = (id: string) => {
    setReadings(readings.filter(r => r.id !== id));
  };
  
  const clearReadings = () => {
    setReadings([]);
  };

  const setTheme = (theme: Theme) => {
    setSettings(s => ({...s, theme}));
  }

  const setLanguage = (lang: Language) => {
    setSettings(s => ({...s, language: lang}));
  }
  
  const setCountry = (country: string) => {
    const isMorocco = country === 'MA';
    setSettings(s => ({
        ...s, 
        country,
        provider: isMorocco ? 'ONEE' : '',
        tariffs: isMorocco ? DEFAULT_MOROCCAN_TARIFFS : [],
        currency: isMorocco ? 'MAD' : '', // Clear currency if not Morocco
    }));
  }

  const setCurrency = (currency: string) => {
    setSettings(s => ({...s, currency}));
  }

  const t = (key: string): string => {
    if (!translations) {
      return key;
    }
    const langDict = translations[settings.language];
    const fallbackDict = translations.en;
    return langDict?.[key] || fallbackDict?.[key] || key;
  };
  
  const handleOnboardingComplete = (country: string) => {
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
    return (
      <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      {!hasOnboarded && <WelcomeModal onComplete={handleOnboardingComplete} />}
      {hasOnboarded && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};