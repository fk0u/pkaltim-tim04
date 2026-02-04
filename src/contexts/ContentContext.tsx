import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { TourPackage, Event, User, Booking, Destination, Testimonial } from '@/types';
import { DatabaseError } from '@/components/ui';

interface ContentContextType {
    packages: TourPackage[];
    events: Event[];
    bookings: Booking[];
    customers: User[];
    destinations: Destination[];
    testimonials: Testimonial[];
    categories: any[];
    loading: boolean;

    // Package Methods
    addPackage: (pkg: Omit<TourPackage, 'id'>) => Promise<boolean>;
    deletePackage: (id: string) => Promise<void>;
    updatePackage: (pkg: TourPackage) => Promise<boolean>;

    // Event Methods
    addEvent: (evt: Omit<Event, 'id'>) => Promise<boolean>;
    deleteEvent: (id: string) => Promise<void>;
    updateEvent: (evt: Event) => Promise<boolean>;

    // Booking Methods
    addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<void>;
    updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;

    // Destination Methods
    addDestination: (dest: Partial<Destination>) => Promise<boolean>;
    updateDestination: (dest: Destination) => Promise<boolean>;
    deleteDestination: (id: number) => Promise<void>;

    // Testimonial Methods
    addTestimonial: (testimonial: Partial<Testimonial>) => Promise<void>;
    updateTestimonial: (testimonial: Testimonial) => Promise<void>;
    deleteTestimonial: (id: string) => Promise<void>;

    // User Methods
    updateUser: (id: string, data: Partial<User>) => Promise<boolean>;
    deleteUser: (id: string) => Promise<boolean>;

    refreshData: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [customers, setCustomers] = useState<User[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState(false);

    // Fetch all data from backend APIs
    const fetchData = useCallback(async () => {
        setLoading(true);
        setDbError(false);
        try {
            // First check DB health
            const healthRes = await fetch('/api/health');
            if (healthRes.status === 503 || !healthRes.ok) {
                setDbError(true);
                setLoading(false);
                return;
            }

            const [packagesRes, eventsRes, bookingsRes, usersRes, regionsRes, testimonialsRes, categoriesRes] = await Promise.all([
                fetch('/api/packages'),
                fetch('/api/events'),
                fetch('/api/bookings'),
                fetch('/api/users'),
                fetch('/api/regions'),
                fetch('/api/testimonials'),
                fetch('/api/categories')
            ]);

            if (packagesRes.ok) {
                const packagesData = await packagesRes.json();
                setPackages(packagesData);
            }

            if (eventsRes.ok) {
                const eventsData = await eventsRes.json();
                setEvents(eventsData);
            }

            if (bookingsRes.ok) {
                const bookingsData = await bookingsRes.json();
                // Map API response to match Booking interface (denormalize customerName)
                const mappedBookings = bookingsData.map((b: any) => ({
                    ...b,
                    customerName: b.customerName || b.user?.name || 'Guest',
                    productImage: b.productImage || b.package?.imageUrl || b.event?.imageUrl || 'https://via.placeholder.com/150',
                    location: b.location || b.package?.location || b.event?.location || 'Borneo',
                    location: b.location || b.package?.location || b.event?.location || 'Borneo',
                    // Normalize status to Title Case to match frontend filters
                    status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase() : 'Pending',
                    specialRequest: b.specialRequest
                }));
                setBookings(mappedBookings);
            }

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                // Map to User type expected by frontend
                setCustomers(usersData.map((u: any) => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: u.role === 'admin' ? 'Admin' : 'Customer',
                    joinDate: u.createdAt?.split('T')[0] || '',
                    avatar: `https://i.pravatar.cc/150?u=${u.id}`,
                    totalSpent: u._count?.bookings * 1000000 || 0,
                    status: 'Active'
                })));
            }

            if (regionsRes.ok) {
                const regionsData = await regionsRes.json();
                setDestinations(regionsData);
            }

            if (testimonialsRes.ok) {
                const testimonialsData = await testimonialsRes.json();
                setTestimonials(testimonialsData);
            }

            if (categoriesRes.ok) {
                const categoriesData = await categoriesRes.json();
                setCategories(categoriesData);
            }
        } catch (error) {
            console.error('Error fetching data from backend:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Package Methods - Call API and update state
    const addPackage = async (pkg: Omit<TourPackage, 'id'>) => {
        try {
            const res = await fetch('/api/packages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pkg)
            });
            if (res.ok) {
                const newPkg = await res.json();
                setPackages(prev => [newPkg, ...prev]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding package:', error);
            return false;
        }
    };

    const deletePackage = async (id: string) => {
        try {
            const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPackages(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    const updatePackage = async (updatedPkg: TourPackage) => {
        try {
            const res = await fetch(`/api/packages/${updatedPkg.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPkg)
            });
            if (res.ok) {
                const pkg = await res.json();
                setPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating package:', error);
            return false;
        }
    };

    // Event Methods
    const addEvent = async (evt: Omit<Event, 'id'>) => {
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(evt)
            });
            if (res.ok) {
                const newEvt = await res.json();
                setEvents(prev => [newEvt, ...prev]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding event:', error);
            return false;
        }
    };

    const deleteEvent = async (id: string) => {
        try {
            const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setEvents(prev => prev.filter(e => e.id !== id));
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const updateEvent = async (updatedEvt: Event) => {
        try {
            const res = await fetch(`/api/events/${updatedEvt.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEvt)
            });
            if (res.ok) {
                const evt = await res.json();
                setEvents(prev => prev.map(e => e.id === evt.id ? evt : e));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating event:', error);
            return false;
        }
    };

    // Booking Methods
    const addBooking = async (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
            });
            if (res.ok) {
                const newBooking = await res.json();
                const mappedBooking = {
                    ...newBooking,
                    customerName: newBooking.customerName || newBooking.user?.name || booking.customerName || 'Guest',
                    productImage: newBooking.productImage || newBooking.package?.imageUrl || newBooking.event?.imageUrl,
                    location: newBooking.location || newBooking.package?.location || newBooking.event?.location,
                    status: newBooking.status ? newBooking.status.charAt(0).toUpperCase() + newBooking.status.slice(1).toLowerCase() : 'Pending'
                };
                setBookings(prev => [mappedBooking, ...prev]);
            }
        } catch (error) {
            console.error('Error adding booking:', error);
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
            }
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    const deleteBooking = async (id: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setBookings(prev => prev.filter(b => b.id !== id));
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    // Destination Methods
    const addDestination = async (dest: Partial<Destination>) => {
        try {
            // Remove ID if it's a temp ID (timestamp) to let DB handle it
            const { id, ...dataToSubmit } = dest as any;

            const res = await fetch('/api/regions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...dataToSubmit,
                    latitude: dest.coordinates?.lat,
                    longitude: dest.coordinates?.lng
                })
            });
            if (res.ok) {
                const newDest = await res.json();
                setDestinations(prev => [newDest, ...prev]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding destination:', error);
            return false;
        }
    };

    const updateDestination = async (dest: Destination) => {
        try {
            const res = await fetch(`/api/regions/${dest.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dest)
            });
            if (res.ok) {
                const updated = await res.json();
                setDestinations(prev => prev.map(d => d.id === updated.id ? updated : d));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating destination:', error);
            return false;
        }
    };

    const deleteDestination = async (id: number) => {
        try {
            const res = await fetch(`/api/regions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDestinations(prev => prev.filter(d => d.id !== id));
            }
        } catch (error) {
            console.error('Error deleting destination:', error);
        }
    };

    // Testimonial Methods
    const addTestimonial = async (testimonial: Partial<Testimonial>) => {
        try {
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testimonial)
            });
            if (res.ok) {
                const newTestimonial = await res.json();
                setTestimonials(prev => [newTestimonial, ...prev]);
            }
        } catch (error) {
            console.error('Error adding testimonial:', error);
        }
    };

    const updateTestimonial = async (testimonial: Testimonial) => {
        try {
            const res = await fetch(`/api/testimonials/${testimonial.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testimonial)
            });
            if (res.ok) {
                const updated = await res.json();
                setTestimonials(prev => prev.map(t => t.id === updated.id ? updated : t));
            }
        } catch (error) {
            console.error('Error updating testimonial:', error);
        }
    };

    const deleteTestimonial = async (id: string) => {
        try {
            const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTestimonials(prev => prev.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error);
        }
    };

    // User Methods
    const updateUser = async (id: string, data: Partial<User>) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const updated = await res.json();
                setCustomers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating user:', error);
            return false;
        }
    };

    const deleteUser = async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCustomers(prev => prev.filter(u => u.id !== id));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    };

    const refreshData = async () => {
        await fetchData();
    };

    if (dbError) {
        return <DatabaseError onRetry={refreshData} />;
    }

    return (
        <ContentContext.Provider value={{
            packages,
            events,
            bookings,
            customers,
            destinations,
            testimonials,
            categories,
            loading,
            addPackage,
            deletePackage,
            updatePackage,
            addEvent,
            deleteEvent,
            updateEvent,
            updateBookingStatus,
            deleteBooking,
            addBooking,
            addDestination,
            updateDestination,
            deleteDestination,
            addTestimonial,
            updateTestimonial,
            deleteTestimonial,
            updateUser,
            deleteUser,
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
