import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui';

interface WishlistItem {
    id: string;
    userId: string;
    packageId?: string | null;
    eventId?: string | null;
    createdAt: string;
    package?: any;
    event?: any;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    loading: boolean;
    addToWishlist: (productId: string, type: 'Event' | 'Package') => Promise<void>;
    removeFromWishlist: (productId: string, type: 'Event' | 'Package') => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshWishlist = useCallback(async () => {
        if (!user) {
            setWishlist([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/user/wishlist?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const addToWishlist = async (productId: string, type: 'Event' | 'Package') => {
        if (!user) {
            addToast('Please login to use wishlist', 'error');
            return;
        }
        try {
            const res = await fetch('/api/user/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, productId, type })
            });
            if (res.ok) {
                addToast('Added to wishlist', 'success');
                refreshWishlist();
            } else {
                addToast('Failed to add to wishlist', 'error');
            }
        } catch (error) {
            console.error(error);
            addToast('Error adding to wishlist', 'error');
        }
    };

    const removeFromWishlist = async (productId: string, type: 'Event' | 'Package') => {
        if (!user) return;
        try {
            const res = await fetch('/api/user/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, productId, type })
            });
            if (res.ok) {
                addToast('Removed from wishlist', 'success');
                // Optimistic update or refresh
                setWishlist(prev => prev.filter(item => {
                    if (type === 'Event') return item.eventId !== productId;
                    return item.packageId !== productId;
                }));
            } else {
                addToast('Failed to remove from wishlist', 'error');
            }
        } catch (error) {
            console.error(error);
            addToast('Error removing from wishlist', 'error');
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item.packageId === productId || item.eventId === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            refreshWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
    return context;
};
