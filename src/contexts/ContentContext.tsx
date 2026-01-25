import React, { createContext, useContext, useEffect, useState } from 'react';
import { EVENTS, PACKAGES, TESTIMONIALS, MOCK_USERS, MOCK_BOOKINGS, REGIONS } from '@/data/mockData';
import { TourPackage, Event, User, Booking, Destination } from '@/types';

// Extend types slightly for internal management if needed
interface ContentContextType {
    packages: TourPackage[];
    events: Event[];
    bookings: Booking[];
    customers: User[];
    addPackage: (pkg: TourPackage) => void;
    deletePackage: (id: string) => void;
    updatePackage: (pkg: TourPackage) => void;
    addEvent: (evt: Event) => void;
    deleteEvent: (id: string) => void;
    updateEvent: (evt: Event) => void;

    // New Methods
    updateBookingStatus: (id: string, status: Booking['status']) => void;
    deleteBooking: (id: string) => void;

    // Destinations
    destinations: Destination[];
    addDestination: (dest: Destination) => void;
    updateDestination: (dest: Destination) => void;
    deleteDestination: (id: number) => void;

    refreshData: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [customers, setCustomers] = useState<User[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);

    useEffect(() => {
        // Initialize from LocalStorage or Mock Data
        const storedPackages = localStorage.getItem('bt_packages_v2');
        const storedEvents = localStorage.getItem('bt_events_v2');
        const storedBookings = localStorage.getItem('bt_bookings_v1');
        const storedCustomers = localStorage.getItem('bt_customers_v1');
        const storedDestinations = localStorage.getItem('bt_destinations_v1');

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

        if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
        } else {
            setBookings(MOCK_BOOKINGS as Booking[]);
            localStorage.setItem('bt_bookings_v1', JSON.stringify(MOCK_BOOKINGS));
        }

        if (storedCustomers) {
            setCustomers(JSON.parse(storedCustomers));
        } else {
            setCustomers(MOCK_USERS as User[]);
            localStorage.setItem('bt_customers_v1', JSON.stringify(MOCK_USERS));
        }

        if (storedDestinations) {
            setDestinations(JSON.parse(storedDestinations));
        } else {
            setDestinations(REGIONS);
            localStorage.setItem('bt_destinations_v1', JSON.stringify(REGIONS));
        }
    }, []);

    // Sync to LocalStorage on updates
    useEffect(() => {
        if (packages.length > 0) localStorage.setItem('bt_packages_v2', JSON.stringify(packages));
    }, [packages]);

    useEffect(() => {
        if (events.length > 0) localStorage.setItem('bt_events_v2', JSON.stringify(events));
    }, [events]);

    useEffect(() => {
        if (bookings.length > 0) localStorage.setItem('bt_bookings_v1', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        // Only save if we have data to avoid overwriting with empty on initial mount before load
        if (destinations.length > 0) localStorage.setItem('bt_destinations_v1', JSON.stringify(destinations));
    }, [destinations]);

    // Packages & Events Methods
    const addPackage = (pkg: TourPackage) => {
        setPackages(prev => [pkg, ...prev]);
    };

    const deletePackage = (id: string) => {
        setPackages(prev => prev.filter(p => p.id !== id));
    };

    const addEvent = (evt: Event) => {
        setEvents(prev => [evt, ...prev]);
    };

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const updatePackage = (updatedPkg: TourPackage) => {
        setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    };

    const updateEvent = (updatedEvt: Event) => {
        setEvents(prev => prev.map(e => e.id === updatedEvt.id ? updatedEvt : e));
    };

    // Booking Methods
    const updateBookingStatus = (id: string, status: Booking['status']) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    };

    const deleteBooking = (id: string) => {
        setBookings(prev => prev.filter(b => b.id !== id));
    };

    // Destination Methods
    const addDestination = (dest: Destination) => {
        setDestinations(prev => [dest, ...prev]);
    };

    const updateDestination = (dest: Destination) => {
        setDestinations(prev => prev.map(d => d.id === dest.id ? dest : d));
    };

    const deleteDestination = (id: number) => {
        setDestinations(prev => prev.filter(d => d.id !== id));
    };

    const refreshData = () => {
        const storedPackages = localStorage.getItem('bt_packages_v2');
        const storedEvents = localStorage.getItem('bt_events_v2');
        const storedDestinations = localStorage.getItem('bt_destinations_v1');
        if (storedPackages) setPackages(JSON.parse(storedPackages));
        if (storedEvents) setEvents(JSON.parse(storedEvents));
        if (storedDestinations) setDestinations(JSON.parse(storedDestinations));
    }

    return (
        <ContentContext.Provider value={{
            packages,
            events,
            bookings,
            customers,
            destinations,
            addPackage,
            deletePackage,
            updatePackage,
            addEvent,
            deleteEvent,
            updateEvent,
            updateBookingStatus,
            deleteBooking,
            addDestination,
            updateDestination,
            deleteDestination,
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
