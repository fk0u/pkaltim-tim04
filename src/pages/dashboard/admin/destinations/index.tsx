import AdminLayout from '@/components/layouts/AdminLayout';
import { useContent } from '@/contexts/ContentContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DestinationManagement() {
    const { destinations, deleteDestination } = useContent();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDestinations = destinations.filter(d => {
        return d.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this destination?')) {
            deleteDestination(id);
        }
    };

    return (
        <AdminLayout title="Destination Management">
            <div className="max-w-7xl mx-auto">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manage Destinations</h2>
                        <p className="text-gray-500">Add, edit, and organize travel destinations.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-emerald-500 transition w-64"
                            />
                        </div>
                        <Link
                            href="/dashboard/admin/destinations/destination-form"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-200"
                        >
                            <Plus className="w-4 h-4" /> Add New Destination
                        </Link>
                    </div>
                </div>

                {/* Content Table */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Destination Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Districts</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence mode="wait">
                                    {filteredDestinations.length > 0 ? filteredDestinations.map((dest) => (
                                        <motion.tr
                                            key={dest.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/50 transition group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-12 rounded-lg bg-gray-200 overflow-hidden relative">
                                                    <Image src={dest.imageUrl} alt={dest.name} fill className="object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 line-clamp-1">{dest.name}</div>
                                                <div className="text-xs text-gray-400 font-mono mt-1">ID: {dest.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 font-medium">{dest.type}</div>
                                                <div className="text-xs text-gray-400">Capital: {dest.capital}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    <CheckCircle className="w-3 h-3" /> {dest.districts} Districts
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 px-2">
                                                    <Link href={`/dashboard/admin/destinations/destination-form?id=${dest.id}`}>
                                                        <button className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition" title="Edit">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(dest.id)}
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
                                            <td colSpan={5} className="py-12 text-center text-gray-400">No destinations found</td>
                                        </tr>
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
