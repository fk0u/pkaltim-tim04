import React, { createContext, useContext, useEffect, useState } from 'react';
import { TourPackage, Event } from '@/types'; // Ensure types match or adapt
import { useAuth } from './AuthContext';

interface ContentContextType {
    packages: TourPackage[];
    events: Event[];
    addPackage: (pkg: Partial<TourPackage>) => Promise<boolean>;
    deletePackage: (id: string) => Promise<boolean>;
    addEvent: (evt: Partial<Event>) => Promise<boolean>;
    refreshData: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const { token } = useAuth();

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/packages');
            const data = await res.json();
            if (data.success) setPackages(data.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            if (data.success) setEvents(data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchPackages();
        fetchEvents();
    }, []);

    const addPackage = async (pkg: Partial<TourPackage>) => {
        if (!token) return false;
        try {
            const res = await fetch('/api/packages', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pkg)
            });
            const data = await res.json();
            if (data.success) {
                fetchPackages();
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const deletePackage = async (id: string) => {
         if (!token) return false;
         // Note: Delete API not fully exposed in packages/index.ts, might need [id].ts implementation
         // Using packages/[id] delete call
         try {
            const res = await fetch(`/api/packages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchPackages();
                return true;
            }
            return false;
         } catch (e) {
             return false;
         }
    };

    const addEvent = async (evt: Partial<Event>) => {
        if (!token) return false;
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(evt)
            });
            const data = await res.json();
            if (data.success) {
                fetchEvents();
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    const refreshData = () => {
        fetchPackages();
        fetchEvents();
    };

    return (
        <ContentContext.Provider value={{ packages, events, addPackage, deletePackage, addEvent, refreshData }}>
            {children}
        </ContentContext.Provider>
    );
}

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within ContentProvider');
    return context;
};
