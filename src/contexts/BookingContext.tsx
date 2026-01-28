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
    };
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

    const stats = {
        totalRevenue: bookings.reduce((acc, curr) => acc + (curr.amount || 0), 0),
        totalBookings: bookings.length,
        activeTravelers: bookings.filter(b => b.status === 'Completed' || b.status === 'Paid').reduce((acc, curr) => acc + (curr.totalPax || 0), 0)
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
