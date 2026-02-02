import Layout from '@/components/Layout';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Heart, Package, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function WishlistPage() {
    const { wishlist, loading } = useWishlist();
    const { t, locale } = useLanguage();
    const { user } = useAuth();

    // Sort by recent
    const sortedWishlist = [...wishlist].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (!user) {
        return (
            <Layout title="Wishlist - BorneoTrip">
                <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-32">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <Heart className="w-10 h-10 text-gray-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h1>
                    <p className="text-gray-500 mb-8 max-w-md">You need to be logged in to save your favorite adventures.</p>
                    <Link href="/login" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">
                        Login Now
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="My Wishlist - BorneoTrip">
            <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center shadow-sm">
                            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900">My Wishlist</h1>
                            <p className="text-gray-500">{wishlist.length} saved items</p>
                        </div>
                    </div>

                    {wishlist.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-gray-300" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-8">Start exploring amazing destinations and save them here.</p>
                            <Link href="/packages" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition">
                                Explore Packages <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedWishlist.map((item) => {
                                const isEvent = !!item.eventId;
                                const product = isEvent ? item.event : item.package;
                                if (!product) return null; // Should include product relation in API

                                const title = typeof product.title === 'string'
                                    ? product.title
                                    : (product.title?.[locale === 'en' ? 'en' : 'id'] || product.title?.id || 'Untitled');

                                const typeLabel = isEvent ? 'Event' : 'Tour Package';
                                const link = isEvent ? `/events?id=${product.id}` : `/packages/${product.id}`; // Events usually modal or list? Assuming link.

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        layout
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
                                    >
                                        <div className="absolute top-3 right-3 z-10">
                                            <WishlistButton
                                                productId={isEvent ? item.eventId! : item.packageId!}
                                                type={isEvent ? 'Event' : 'Package'}
                                            />
                                        </div>

                                        <Link href={link}>
                                            <div className="relative h-48 overflow-hidden">
                                                <Image
                                                    src={product.imageUrl || '/images/placeholder.jpg'}
                                                    alt={title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition duration-700"
                                                />
                                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1">
                                                    {isEvent ? <Calendar className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                                                    {typeLabel}
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-emerald-600 transition">
                                                    {title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                                    {product.location}
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                    <div className="text-xs text-gray-400 font-medium">
                                                        Added {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <span className="text-emerald-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition">
                                                        View <ArrowRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
