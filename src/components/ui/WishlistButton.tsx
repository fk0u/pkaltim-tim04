import { useWishlist } from '@/contexts/WishlistContext';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
    productId: string;
    type: 'Event' | 'Package';
    className?: string;
    iconSize?: number;
}

export const WishlistButton = ({ productId, type, className, iconSize = 20 }: WishlistButtonProps) => {
    const { isInWishlist, addToWishlist, removeFromWishlist, loading } = useWishlist();
    const active = isInWishlist(productId);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;

        if (active) {
            await removeFromWishlist(productId, type);
        } else {
            await addToWishlist(productId, type);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleToggle}
            className={cn(
                "p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm group",
                active
                    ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                    : "bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500",
                className
            )}
            aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                size={iconSize}
                className={cn(
                    "transition-all duration-300",
                    active ? "fill-current" : "fill-rose-500/0 group-hover:scale-110"
                )}
            />
        </motion.button>
    );
};
