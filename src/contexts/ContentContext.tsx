import React, { createContext, useContext, useEffect, useState } from 'react';
import { EVENTS, PACKAGES, TESTIMONIALS } from '@/data/mockData';
import { TourPackage, Event } from '@/types';

// Extend types slightly for internal management if needed
interface ContentContextType {
    packages: TourPackage[];
    events: Event[];
    addPackage: (pkg: TourPackage) => void;
    deletePackage: (id: string) => void;
    updatePackage: (pkg: TourPackage) => void;
    addEvent: (evt: Event) => void;
    deleteEvent: (id: string) => void;
    updateEvent: (evt: Event) => void;
    refreshData: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        // Initialize from LocalStorage or Mock Data
        // V2 keys to force refresh on schema change (String -> LocalizedString)
        const storedPackages = localStorage.getItem('bt_packages_v2');
        const storedEvents = localStorage.getItem('bt_events_v2');

        if (storedPackages) {
            setPackages(JSON.parse(storedPackages));
        } else {
            setPackages(PACKAGES);
            localStorage.setItem('bt_packages_v2', JSON.stringify(PACKAGES));
        }

        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        } else {
            // events needs type casting or mapping if structure matches
            // Assuming EVENTS from mockData matches Event type roughly or we adapt
            // For now, let's just assume valid match or empty
            const validEvents = EVENTS.map((e: any) => ({
                ...e,
                category: e.category || 'Nature', // Fallback
                tags: e.tags || [],
                schedule: e.schedule || [],
                gallery: e.gallery || []
            })) as Event[];

            setEvents(validEvents);
            localStorage.setItem('bt_events_v2', JSON.stringify(validEvents));
        }
    }, []);

    // Sync to LocalStorage on updates
    useEffect(() => {
        if (packages.length > 0) localStorage.setItem('bt_packages_v2', JSON.stringify(packages));
    }, [packages]);

    useEffect(() => {
        if (events.length > 0) localStorage.setItem('bt_events_v2', JSON.stringify(events));
    }, [events]);

    const addPackage = (pkg: TourPackage) => {
        setPackages(prev => [pkg, ...prev]);
    };

    const deletePackage = (id: string) => {
        setPackages(prev => prev.filter(p => p.id !== id));
    };

    const addEvent = (evt: Event) => {
        setEvents(prev => [evt, ...prev]);
    };

    const refreshData = () => {
        // Force reload if needed
        const storedPackages = localStorage.getItem('bt_packages_v2');
        const storedEvents = localStorage.getItem('bt_events_v2');
        if (storedPackages) setPackages(JSON.parse(storedPackages));
        if (storedEvents) setEvents(JSON.parse(storedEvents));
    }

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const updatePackage = (updatedPkg: TourPackage) => {
        setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    };

    const updateEvent = (updatedEvt: Event) => {
        setEvents(prev => prev.map(e => e.id === updatedEvt.id ? updatedEvt : e));
    };

    return (
        <ContentContext.Provider value={{
            packages,
            events,
            addPackage,
            deletePackage,
            updatePackage,
            addEvent,
            deleteEvent,
            updateEvent,
            refreshData
        }}>
            {children}
        </ContentContext.Provider>
    );
}

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within CoverageProvider');
    return context;
};
