import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Search, Trophy, MapPin, Mail, Phone, MoreHorizontal, User } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data
const INITIAL_CUSTOMERS = [
    { id: 1, name: 'Budi Santoso', email: 'budi@gmail.com', phone: '+62812345678', location: 'Jakarta, ID', totalSpent: 12500000, trips: 3, level: 'Explorer', joinDate: 'Jan 2024' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@uk.co', phone: '+447911123456', location: 'London, UK', totalSpent: 28000000, trips: 5, level: 'Elite', joinDate: 'Mar 2024' },
    { id: 3, name: 'Ahmad Dani', email: 'ahmad.dani@yahoo.com', phone: '+62811223344', location: 'Surabaya, ID', totalSpent: 4100000, trips: 1, level: 'Newbie', joinDate: 'Jun 2024' },
    { id: 4, name: 'Rina Nose', email: 'rina.nose@gmail.com', phone: '+62855667788', location: 'Bandung, ID', totalSpent: 8900000, trips: 2, level: 'Explorer', joinDate: 'Jul 2024' },
    { id: 5, name: 'John Doe', email: 'john.doe@gmail.com', phone: '+1234567890', location: 'New York, US', totalSpent: 15600000, trips: 2, level: 'Explorer', joinDate: 'Aug 2024' },
];

export default function CustomersPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
    }, [isAuthenticated, router]);

    if (!user) return null;

    const filteredCustomers = INITIAL_CUSTOMERS.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Customer Database">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Customers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCustomers.map((customer) => (
                        <motion.div
                            key={customer.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[4rem] -z-0 transition group-hover:bg-emerald-50"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shadow-inner">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${customer.level === 'Elite' ? 'bg-amber-100 text-amber-700' :
                                            customer.level === 'Explorer' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {customer.level}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1">{customer.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <MapPin className="w-3.5 h-3.5" /> {customer.location}
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-3.5 h-3.5 text-gray-400" /> {customer.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-3.5 h-3.5 text-gray-400" /> {customer.phone}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div>
                                        <div className="text-xs text-gray-400 font-bold uppercase">Total Spent</div>
                                        <div className="text-lg font-black text-emerald-700">Rp {(customer.totalSpent / 1000000).toFixed(1)}jt</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 font-bold uppercase">Trips</div>
                                        <div className="text-lg font-black text-gray-900 flex items-center gap-1 justify-end">
                                            <Trophy className="w-3.5 h-3.5 text-amber-400" /> {customer.trips}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
