import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Mail, Phone, Calendar, MapPin,
    CreditCard, ShoppingBag, Star, Activity, Edit3
} from 'lucide-react';
import { User as UserType, Booking } from '../../types';
import { StatusBadge } from '@/pages/dashboard/admin/bookings';
import { useContent } from '@/contexts/ContentContext';

interface CustomerDetailModalProps {
    customer: UserType | null;
    bookings: Booking[];
    isOpen: boolean;
    onClose: () => void;
}

export default function CustomerDetailModal({ customer, bookings, isOpen, onClose }: CustomerDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'notes' | 'profile'>('overview');
    const [isEditingRole, setIsEditingRole] = useState(false);
    const { updateUser } = useContent();

    if (!isOpen || !customer) return null;

    const customerBookings = bookings.filter(b => b.customerName === customer.name); // Simple match by name for mock

    // Derived Stats
    const totalSpent = customerBookings.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const completedTrips = customerBookings.filter(b => b.status === 'Completed').length;
    const ltv = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalSpent);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header with Background Pattern */}
                    <div className="relative h-32 bg-gradient-to-r from-emerald-800 to-teal-700">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/20 text-white hover:bg-black/30 rounded-full backdrop-blur-md transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                                <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="pt-14 px-8 pb-8 flex-1 overflow-y-auto">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                                <div className="flex items-center gap-2 text-gray-500 mt-1">
                                    <Mail className="w-4 h-4" /> {customer.email}
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 mt-1">
                                    <MapPin className="w-4 h-4" /> Jakarta, Indonesia
                                </div>
                            </div>


                            <div className="flex flex-col items-end gap-2">
                                {isEditingRole ? (
                                    <div className="flex items-center gap-2">
                                        <select
                                            defaultValue={customer.role}
                                            onChange={async (e) => {
                                                const newRole = e.target.value;
                                                await updateUser(customer.id, { role: newRole as any });
                                                setIsEditingRole(false);
                                            }}
                                            className="text-xs font-bold border rounded-lg px-2 py-1 bg-white"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="mitra">Mitra</option>
                                        </select>
                                        <button onClick={() => setIsEditingRole(false)} className="text-xs text-red-500 hover:underline">Cancel</button>
                                    </div>
                                ) : (
                                    <span
                                        onClick={() => setIsEditingRole(true)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer hover:opacity-80 transition ${customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                                        title="Click to edit role"
                                    >
                                        {customer.role}
                                    </span>
                                )}
                                <span className="text-xs text-gray-400">Joined {customer.joinDate}</span>
                            </div>
                        </div>

                        {/* Send Message Button */}
                        <button
                            onClick={() => {
                                // In a real implementation this would navigate to chat with sessionId
                                window.location.href = `/dashboard/admin/support?startChat=${customer.id}`;
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition transform hover:-translate-y-0.5"
                        >
                            <Mail className="w-4 h-4" /> Send Message
                        </button>


                        {/* Tabs */}
                        <div className="flex gap-6 border-b border-gray-100 mb-6">
                            {['Overview', 'History', 'Notes', 'Profile'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase() as any)}
                                    className={`pb-3 text-sm font-medium transition relative ${activeTab === tab.toLowerCase()
                                        ? 'text-emerald-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab.toLowerCase() && (
                                        <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[300px]">
                            {activeTab === 'overview' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                            <p className="text-xs font-bold text-emerald-600 uppercase">Total Spent (LTV)</p>
                                            <p className="text-xl font-black text-emerald-900 mt-1">{ltv}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                                            <p className="text-xs font-bold text-blue-600 uppercase">Bookings</p>
                                            <p className="text-xl font-black text-blue-900 mt-1">{customerBookings.length}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                            <p className="text-xs font-bold text-amber-600 uppercase">Trips Completed</p>
                                            <p className="text-xl font-black text-amber-900 mt-1">{completedTrips}</p>
                                        </div>
                                    </div>

                                    {/* Recent Activity Mock */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-gray-400" /> Recent Activity
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Completed trip to "Derawan Island"</p>
                                                    <p className="text-xs text-gray-500">2 Days ago</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Left a 5-star review</p>
                                                    <p className="text-xs text-gray-500">3 Days ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'history' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                    {customerBookings.length > 0 ? (
                                        customerBookings.map(bk => (
                                            <div key={bk.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition bg-white">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400">
                                                        <ShoppingBag className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{bk.productName}</p>
                                                        <p className="text-xs text-gray-500">#{bk.id} • {bk.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-emerald-700">Rp {bk.amount.toLocaleString()}</p>
                                                    <StatusBadge status={bk.status} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-gray-400">
                                            No booking history found.
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'notes' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 mb-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-bold text-yellow-800 flex items-center gap-2">
                                                <Edit3 className="w-4 h-4" /> Admin Notes
                                            </h4>
                                            <button className="text-xs font-bold text-yellow-700 hover:underline">Edit</button>
                                        </div>
                                        <p className="text-sm text-yellow-900 leading-relaxed">
                                            This customer is a frequent traveler. Prefers luxury packages and private transport.
                                            Always requests vegetarian meal options. Handle with care - high LTV potential.
                                        </p>
                                        <p className="text-xs text-yellow-700/60 mt-4">Last updated by Admin • Oct 24, 2024</p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'profile' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                        <h3 className="font-bold text-gray-900">Personal Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Phone</p>
                                                <div className="flex items-center gap-2 font-medium text-slate-700">
                                                    <Phone className="w-4 h-4 text-emerald-500" /> {customer.phone || '-'}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">ID Number</p>
                                                <div className="flex items-center gap-2 font-medium text-slate-700">
                                                    <CreditCard className="w-4 h-4 text-emerald-500" /> {customer.idNumber || '-'}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Bio</p>
                                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                                {customer.bio || "No bio providing."}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
