import AdminLayout from '@/components/layouts/AdminLayout';
import { useContent } from '@/contexts/ContentContext';
import { useBooking } from '@/contexts/BookingContext';
import { useState } from 'react';
import { Search, Mail, Calendar, DollarSign, User } from 'lucide-react';
import CustomerDetailModal from '@/components/admin/CustomerDetailModal';
import { User as UserType } from '@/types';

export default function CustomersPage() {
    const { customers } = useContent();
    const { bookings } = useBooking(); // Need bookings for history
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<UserType | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleViewDetail = (customer: UserType) => {
        setSelectedCustomer(customer);
        setIsDetailOpen(true);
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Customers">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Customer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCustomers.map(customer => (
                        <div key={customer.id} onClick={() => handleViewDetail(customer)} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-50">
                                        <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${customer.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'
                                        }`}></span>
                                </div>
                                <span className="px-2 py-1 rounded-lg bg-gray-50 text-xs font-bold text-gray-500 uppercase">{customer.role}</span>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-1">{customer.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <Mail className="w-3 h-3" /> {customer.email}
                            </div>

                            <hr className="mb-4 border-gray-50" />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined</p>
                                    <p className="font-medium text-gray-700">{customer.joinDate}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Spent</p>
                                    <p className="font-bold text-emerald-600">Rp {customer.totalSpent.toLocaleString()}</p>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2 rounded-xl bg-gray-50 text-gray-600 font-bold text-sm group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                                View History
                            </button>
                        </div>
                    ))}

                    {filteredCustomers.length === 0 && (
                        <div className="col-span-full py-12 text-center">
                            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No customers found.</p>
                        </div>
                    )}
                </div>

            </div>

            <CustomerDetailModal
                customer={selectedCustomer}
                bookings={bookings} // Helper will filter by customer name inside modal or we pass filtered? Modal filters it.
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />
        </AdminLayout >
    );
}
