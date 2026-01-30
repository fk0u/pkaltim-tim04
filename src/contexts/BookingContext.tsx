import React, { createContext, useContext, useEffect, useState } from 'react';
import { Booking } from '@/types';
import { useContent } from './ContentContext';

interface BookingContextType {
    bookings: Booking[];
    addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
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
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
    // Consume data from ContentContext (Single Source of Truth)
    const { bookings, addBooking: addBookingApi, updateBookingStatus: updateStatusApi } = useContent();

    const addBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
        await addBookingApi(data);
    };

    const updateBookingStatus = async (id: string, status: Booking['status']) => {
        await updateStatusApi(id, status);
    };

    const getBookingsByUserId = (userId: string) => {
        return bookings.filter(b => b.userId === userId);
    };

    const getBookingById = (id: string) => {
        return bookings.find(b => b.id === id);
    };

    const [apiStats, setApiStats] = useState({
        totalRevenue: 0,
        totalBookings: 0,
        activeTravelers: 0,
        totalXP: 0,
        activeTripsCount: 0
    });

    const refreshStats = async () => {
        try {
            const res = await fetch('/api/user/stats');
            if (res.ok) {
                const data = await res.json();
                setApiStats({
                    totalRevenue: data.totalSpent,
                    totalBookings: data.totalBookings,
                    activeTripsCount: data.activeTripsCount,
                    totalXP: data.totalXP,
                    activeTravelers: 0 // API doesn't calculate this yet, keeping 0 or derived
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        refreshStats();
    }, [bookings]); // Refresh when bookings change

    const stats = {
        totalRevenue: apiStats.totalRevenue,
        totalBookings: apiStats.totalBookings,
        activeTravelers: bookings.filter(b => b.status === 'Completed' || b.status === 'Paid').reduce((acc, curr) => acc + (curr.totalPax || 0), 0), // Client-side derived for now
        totalXP: apiStats.totalXP,
        activeTripsCount: apiStats.activeTripsCount
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, getBookingsByUserId, getBookingById, stats, refreshStats }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within a BookingProvider');
    return context;
};
