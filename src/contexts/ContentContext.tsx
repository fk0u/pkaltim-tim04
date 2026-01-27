import React, { createContext, useContext, useEffect, useState } from 'react';
import { EVENTS, PACKAGES, REGIONS, TESTIMONIALS, MOCK_USERS } from '@/data/mockData';
import { TourPackage, Event, Destination, User } from '@/types';

// Extend types slightly for internal management if needed
interface ContentContextType {
    packages: TourPackage[];
    events: Event[];
    destinations: Destination[];
    customers: User[];
    addPackage: (pkg: TourPackage) => void;
    deletePackage: (id: string) => void;
    addEvent: (evt: Event) => void;
    updateEvent: (id: string, evt: Partial<Event>) => void;
    deleteEvent: (id: string) => void;
    updatePackage: (id: string, pkg: Partial<TourPackage>) => void;
    addDestination: (dest: Destination) => void;
    updateDestination: (id: number, dest: Partial<Destination>) => void;
    deleteDestination: (id: number) => void;
    refreshData: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [destinations] = useState<Destination[]>(REGIONS);
    const [customers] = useState<User[]>(MOCK_USERS);

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
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const refreshData = () => {
        fetchContent();
    }

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
            refreshData();
        } catch (e) { console.error(e); }
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
        } catch (e) { console.error(e); }
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
        } catch (e) { console.error(e); }
    };

    const updateEvent = async (id: string, evt: Partial<Event>) => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, ...evt } : e));
        // API call stub
    };

    const deleteEvent = async (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        try {
            await fetch(`/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('borneotrip_token')}`
                },
            });
        } catch (e) { console.error(e); }
    };

    const updatePackage = async (id: string, pkg: Partial<TourPackage>) => {
        setPackages(prev => prev.map(p => p.id === id ? { ...p, ...pkg } : p));
        // API call stub
    };

    // Destination Stubs
    const addDestination = (dest: Destination) => console.log('Add Dest', dest);
    const updateDestination = (id: number, dest: Partial<Destination>) => console.log('Update Dest', id);
    const deleteDestination = (id: number) => console.log('Delete Dest', id);

    return (
        <ContentContext.Provider value={{
            packages, events, destinations, customers,
            addPackage, deletePackage, updatePackage,
            addEvent, updateEvent, deleteEvent,
            addDestination, updateDestination, deleteDestination,
            refreshData
        }}>
            {children}
        </ContentContext.Provider>
    );
}

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within ContentProvider');
    return context;
};
