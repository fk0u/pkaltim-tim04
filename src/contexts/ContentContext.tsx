import React, { createContext, useContext, useEffect, useState } from 'react';
import { EVENTS, PACKAGES, TESTIMONIALS } from '@/data/mockData';
import { TourPackage, Event } from '@/types';

// Extend types slightly for internal management if needed
interface ContentContextType {
    packages: TourPackage[];
    events: Event[];
    addPackage: (pkg: TourPackage) => void;
    deletePackage: (id: string) => void;
    addEvent: (evt: Event) => void;
    refreshData: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [events, setEvents] = useState<Event[]>([]);

    const fetchContent = async () => {
         try {
             // Fetch Packages
             const pRes = await fetch('/api/packages');
             if (pRes.ok) {
                 const pData = await pRes.json();
                 setPackages(pData);
                 localStorage.setItem('bt_packages', JSON.stringify(pData));
             }

             // Fetch Events
             const eRes = await fetch('/api/events');
             if (eRes.ok) {
                 const eData = await eRes.json();
                 setEvents(eData);
                 localStorage.setItem('bt_events', JSON.stringify(eData));
             }
         } catch (error) {
             console.error("Failed to fetch content", error);
             // Fallback to local storage or mock if API fails?
             // For now, let's stick to API first approach.
         }
    };

    useEffect(() => {
        // Initial Fetch
        fetchContent();
    }, []);

    // Sync to LocalStorage on updates - REMOVED to avoid overwriting API data with stale state loop? 
    // Actually, local storage is cache here. 
    // Let's keep one way sync: API -> State -> LocalStorage (for offline/caching if implemented well)
    // But simple useEffect fetch is enough for now.

    const addPackage = async (pkg: TourPackage) => {
        // Optimistic update
        setPackages(prev => [pkg, ...prev]);
        
        try {
            await fetch('/api/packages', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('borneotrip_token')}`
                },
                body: JSON.stringify(pkg)
            });
            // Ideally re-fetch to get real ID
            refreshData();
        } catch(e) { console.error(e); }
    };

    const deletePackage = async (id: string) => {
        setPackages(prev => prev.filter(p => p.id !== id));
         try {
            await fetch(`/api/packages/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('borneotrip_token')}`
                },
            });
        } catch(e) { console.error(e); }
    };

    const addEvent = async (evt: Event) => {
        setEvents(prev => [evt, ...prev]);
         try {
            await fetch('/api/events', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('borneotrip_token')}`
                },
                body: JSON.stringify(evt)
            });
            refreshData();
        } catch(e) { console.error(e); }
    };

    const refreshData = () => {
         fetchContent();
    }

    return (
        <ContentContext.Provider value={{ packages, events, addPackage, deletePackage, addEvent, refreshData }}>
            {children}
        </ContentContext.Provider>
    );
}

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within CoverageProvider');
    return context;
};
