import AdminLayout from '@/components/layouts/AdminLayout';
import { useContent } from '@/contexts/ContentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Package, Calendar, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductManagement() {
    const { packages, events, deletePackage, deleteEvent } = useContent(); // Need to ensure deleteEvent is available in Context
    const { t, locale } = useLanguage();
    const [activeTab, setActiveTab] = useState<'packages' | 'events'>('packages');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPackages = packages.filter(p => {
        const title = typeof p.title === 'string' ? p.title : p.title[locale === 'en' ? 'en' : 'id'];
        return title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const filteredEvents = events.filter(e => {
        const title = typeof e.title === 'string' ? e.title : e.title[locale === 'en' ? 'en' : 'id'];
        return title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleDelete = (id: string, type: 'package' | 'event') => {
        if (confirm('Are you sure you want to delete this item?')) {
            if (type === 'package') {
                deletePackage(id);
            } else {
                // Assuming deleteEvent exists in context, if not we need to add it
                // deleteEvent(id); 
                console.log('Delete event', id);
            }
        }
    };

    return (
        <AdminLayout title="Product Management">
            <div className="max-w-7xl mx-auto">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
                        <p className="text-gray-500">Create, update, and remove tour packages and events.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-emerald-500 transition w-64"
                            />
                        </div>
                        <Link
                            href={`/dashboard/admin/products/${activeTab === 'packages' ? 'package-form' : 'event-form'}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-200"
                        >
                            <Plus className="w-4 h-4" /> Add New {activeTab === 'packages' ? 'Package' : 'Event'}
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl w-fit mb-8">
                    <button
                        onClick={() => setActiveTab('packages')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'packages' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Package className="w-4 h-4" /> Tour Packages
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'events' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Calendar className="w-4 h-4" /> Events
                    </button>
                </div>

                {/* Content Table */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title ({locale.toUpperCase()})</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'packages' ? (
                                        filteredPackages.length > 0 ? filteredPackages.map((pkg) => (
                                            <motion.tr
                                                key={pkg.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-gray-50/50 transition group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-12 rounded-lg bg-gray-200 overflow-hidden relative">
                                                        <Image src={pkg.imageUrl} alt={typeof pkg.title === 'string' ? pkg.title : pkg.title[locale === 'en' ? 'en' : 'id']} fill className="object-cover" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900 line-clamp-1">
                                                        {typeof pkg.title === 'string' ? pkg.title : pkg.title[locale === 'en' ? 'en' : 'id']}
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-mono mt-1">ID: {pkg.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600 font-medium">Rp {(pkg.price / 1000000).toFixed(1)}jt</div>
                                                    <div className="text-xs text-gray-400">{pkg.duration} • {pkg.location}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        <CheckCircle className="w-3 h-3" /> Active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 px-2">
                                                        <Link href={`/dashboard/admin/products/package-form?id=${pkg.id}`}>
                                                            <button className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition" title="Edit">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(pkg.id, 'package')}
                                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-gray-400">No packages found ({activeTab})</td>
                                            </tr>
                                        )
                                    ) : (
                                        filteredEvents.length > 0 ? filteredEvents.map((evt) => (
                                            <motion.tr
                                                key={evt.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-gray-50/50 transition group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-12 rounded-lg bg-gray-200 overflow-hidden relative">
                                                        <Image src={evt.imageUrl} alt={typeof evt.title === 'string' ? evt.title : evt.title[locale === 'en' ? 'en' : 'id']} fill className="object-cover" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900 line-clamp-1">
                                                        {typeof evt.title === 'string' ? evt.title : evt.title[locale === 'en' ? 'en' : 'id']}
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-mono mt-1">ID: {evt.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600 font-medium">{evt.price || 'Free'}</div>
                                                    <div className="text-xs text-gray-400">{evt.date} • {evt.location}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                        <Calendar className="w-3 h-3" /> Upcoming
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 px-2">
                                                        <Link href={`/dashboard/admin/products/event-form?id=${evt.id}`}>
                                                            <button className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition" title="Edit">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(evt.id, 'event')}
                                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-gray-400">No events found</td>
                                            </tr>
                                        )
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
