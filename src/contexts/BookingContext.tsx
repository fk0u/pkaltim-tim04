import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Booking } from '@/types';
import { useAuth } from './AuthContext';

interface BookingContextType {
    bookings: Booking[];
    loading: boolean;
    addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
    updateBookingStatus: (id: string, status: Booking['status']) => Promise<boolean>;
    getBookingsByUserId: (userId: string) => Booking[];
    getBookingById: (id: string) => Booking | undefined;
    stats: {
        totalRevenue: number;
        totalBookings: number;
        activeTravelers: number;
        totalXP: number;
        activeTripsCount: number;
    };
    refreshStats: () => Promise<void>;
    refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    // Stats State
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalBookings: 0,
        activeTravelers: 0,
        totalXP: 0,
        activeTripsCount: 0
    });

    // Fetch Bookings from API
    const refreshBookings = useCallback(async () => {
        if (!user) {
            setBookings([]);
            return;
        }
        setLoading(true);
        try {
            // Get user's bookings. Admin might need all, but for now context is mostly for client dash based on user.
            // If user is admin, maybe fetch all? Let's check role.
            // For simplicity, we fetch bookings for the current logged in user context.
            // If the user is admin, they usually use a different page that fetches all bookings independently.
            // So here we stick to user bookings.
            const res = await fetch(`/api/bookings?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                // Map API response to match Booking interface (denormalize customerName)
                const mappedBookings = data.map((b: any) => ({
                    ...b,
                    customerName: b.customerName || b.user?.name || 'Guest',
                    productImage: b.productImage || b.package?.imageUrl || b.event?.imageUrl || 'https://via.placeholder.com/150',
                    location: b.location || b.package?.location || b.event?.location || 'Borneo'
                }));
                setBookings(mappedBookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Fetch Stats from API
    const refreshStats = useCallback(async () => {
        if (!user) return;
        try {
            const res = await fetch('/api/user/stats');
            if (res.ok) {
                const data = await res.json();
                setStats({
                    totalRevenue: data.totalSpent || 0,
                    totalBookings: data.totalBookings || 0,
                    activeTripsCount: data.activeTripsCount || 0,
                    totalXP: data.totalXP || 0,
                    activeTravelers: 0 // Calculated client side below if needed, or derived from bookings
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, [user]);

    useEffect(() => {
        refreshBookings();
        refreshStats();
    }, [refreshBookings, refreshStats]);


    const addBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const newBooking = await res.json();
                await refreshBookings(); // Refresh list to get full data with relations if needed
                await refreshStats();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding booking:', error);
            return false;
        }
    };

    const updateBookingStatus = async (id: string, status: Booking['status']) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
                await refreshStats(); // Status change might affect active trips
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating booking status:', error);
            return false;
        }
    };

    const getBookingsByUserId = (userId: string) => {
        return bookings.filter(b => b.userId === userId);
    };

    const getBookingById = (id: string) => {
        return bookings.find(b => b.id === id);
    };

    return (
        <BookingContext.Provider value={{
            bookings,
            loading,
            addBooking,
            updateBookingStatus,
            getBookingsByUserId,
            getBookingById,
            stats: {
                ...stats,
                activeTravelers: bookings.filter(b => b.status === 'Completed' || b.status === 'Paid').reduce((acc, curr) => acc + (curr.totalPax || 0), 0)
            },
            refreshStats,
            refreshBookings
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within a BookingProvider');
    return context;
};
