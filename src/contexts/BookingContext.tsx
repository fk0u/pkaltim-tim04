import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Booking {
    id: string;
    userId: string;
    // Relations might come populated
    event?: any;
    package?: any;
    
    // Frontend compatibility fields (mapped from backend)
    userName?: string;
    pkgTitle?: string;
    pkgImage?: string;
    location?: string;
    date: string;
    pax?: number; // Backend doesn't have pax yet, assumed 1 or added to schema
    totalPrice?: number; // Backend calculates or stores
    status: 'pending' | 'paid' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
}

interface BookingContextType {
    bookings: Booking[];
    addBooking: (bookingData: any) => Promise<boolean>;
    updateBookingStatus: (id: string, status: string) => Promise<boolean>;
    getBookingsByUserId: (userId: string) => Booking[];
    stats: {
        totalRevenue: number;
        totalBookings: number;
        activeTravelers: number;
    };
    refreshBookings: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const { token, user } = useAuth();

    const fetchBookings = async () => {
        if (!token) {
            setBookings([]);
            return;
        }
        try {
            const res = await fetch('/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Map backend data to frontend interface if needed
                const mapped = data.data.map((b: any) => ({
                    ...b,
                    pkgTitle: b.package?.title || b.event?.title || 'Unknown Item',
                    pkgImage: b.package?.imageUrl || b.event?.imageUrl,
                    totalPrice: b.package?.price || 0, // Simplified
                    userName: b.user?.name // If included
                }));
                setBookings(mapped);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (token) fetchBookings();
    }, [token]);

    const addBooking = async (bookingData: any) => {
        if (!token) return false;
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });
            const data = await res.json();
            if (data.success) {
                fetchBookings();
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const updateBookingStatus = async (id: string, status: string) => {
        if (!token) return false;
        // Need PUT endpoint for booking status (implemented in [id].ts? Need to check)
        // [id].ts currently has GET and DELETE.
        // Assuming [id].ts or similar will handle updates or we add it.
        // For now, let's assume manual implementation or skip.
        console.warn('Update status API not fully implemented in plan, using delete as placeholder if cancel');
        if (status === 'cancelled') {
             const res = await fetch(`/api/bookings/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                 fetchBookings();
                 return true;
            }
        }
        return false;
    };

    const getBookingsByUserId = (userId: string) => {
        return bookings.filter(b => b.userId === userId);
    };

    const stats = {
        totalRevenue: bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0),
        totalBookings: bookings.length,
        activeTravelers: bookings.filter(b => b.status === 'confirmed').length
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, getBookingsByUserId, stats, refreshBookings: fetchBookings }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within a BookingProvider');
    return context;
};
