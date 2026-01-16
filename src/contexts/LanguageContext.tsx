import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { id } from '@/locales/id';
import { en } from '@/locales/en';

type Locale = 'id' | 'en';
type Translations = typeof id;

interface LanguageContextType {
    locale: Locale;
    t: Translations;
    toggleLanguage: () => void;
    setLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>('id');
    const [t, setT] = useState<Translations>(id);

    useEffect(() => {
        // Check localStorage or browser preference if needed
        const saved = localStorage.getItem('lang') as Locale;
        if (saved && (saved === 'id' || saved === 'en')) {
            setLocale(saved);
        }
    }, []);

    useEffect(() => {
        setT(locale === 'id' ? id : en);
        localStorage.setItem('lang', locale);
    }, [locale]);

    const toggleLanguage = () => {
        setLocale((prev) => (prev === 'id' ? 'en' : 'id'));
    };

    const setLanguage = (lang: Locale) => {
        setLocale(lang);
    };

    return (
        <LanguageContext.Provider value={{ locale, t, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
