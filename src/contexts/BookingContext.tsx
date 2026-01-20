import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Booking {
    id: string;
    userId: string;
    userName: string;
    packageId: string;
    pkgTitle: string;
    pkgImage: string;
    location: string;
    date: string;
    pax: number;
    totalPrice: number;
    status: 'Pending' | 'Paid' | 'Confirmed' | 'Completed';
    createdAt: string;
}

interface BookingContextType {
    bookings: Booking[];
    addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
    updateBookingStatus: (id: string, status: Booking['status']) => void;
    getBookingsByUserId: (userId: string) => Booking[];
    getBookingById: (id: string) => Booking | undefined;
    stats: {
        totalRevenue: number;
        totalBookings: number;
        activeTravelers: number;
    };
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [bookings, setBookings] = useState<Booking[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('bt_bookings');
        if (stored) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBookings(JSON.parse(stored));
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (bookings.length > 0) {
            localStorage.setItem('bt_bookings', JSON.stringify(bookings));
        }
    }, [bookings]);

    const addBooking = (data: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
        const newBooking: Booking = {
            ...data,
            id: `BK-${Date.now().toString().slice(-6)}`,
            status: 'Paid', // Auto paid for demo
            createdAt: new Date().toISOString(),
        };
        setBookings(prev => [newBooking, ...prev]);
    };

    const updateBookingStatus = (id: string, status: Booking['status']) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    };

    const getBookingsByUserId = (userId: string) => {
        return bookings.filter(b => b.userId === userId);
    };

    const getBookingById = (id: string) => {
        return bookings.find(b => b.id === id);
    };

    const stats = {
        totalRevenue: bookings.reduce((acc, curr) => acc + curr.totalPrice, 0),
        totalBookings: bookings.length,
        activeTravelers: bookings.filter(b => b.status === 'Confirmed' || b.status === 'Paid').reduce((acc, curr) => acc + curr.pax, 0)
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, getBookingsByUserId, getBookingById, stats }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within a BookingProvider');
    return context;
};
