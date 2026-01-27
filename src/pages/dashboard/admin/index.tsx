import AdminLayout from '@/components/layouts/AdminLayout';
import { useContent } from '@/contexts/ContentContext';
import { useBooking } from '@/contexts/BookingContext';
// import { format } from 'date-fns';
import {
    Users, ShoppingBag, DollarSign, TrendingUp,
    ArrowUpRight, ArrowDownRight, Package, Calendar
} from 'lucide-react';
import DashboardAnalytics from '@/components/admin/DashboardAnalytics';

export default function AdminDashboard() {
    const { customers, packages, events } = useContent();
    const { bookings } = useBooking();

    // Stats Calculations
    const totalRevenue = bookings
        .filter(b => b.status === 'Paid' || b.status === 'Completed')
        .reduce((sum, b) => sum + b.amount, 0);

    const activeBookings = bookings.filter(b => b.status === 'Pending' || b.status === 'Paid').length;
    const totalUsers = customers.length;
    const totalProducts = packages.length + events.length;

    // Monthly Revenue Data (Mock Logic)
    const revenueData = [
        { name: 'Jan', revenue: 4000000 },
        { name: 'Feb', revenue: 3000000 },
        { name: 'Mar', revenue: 2000000 },
        { name: 'Apr', revenue: 2780000 },
        { name: 'May', revenue: 1890000 },
        { name: 'Jun', revenue: 2390000 },
        { name: 'Jul', revenue: 3490000 },
        { name: 'Aug', revenue: 2500000 }, // Current rough month match
    ];

    // Status Distribution
    const statusData = [
        { name: 'Paid', value: bookings.filter(b => b.status === 'Paid').length },
        { name: 'Pending', value: bookings.filter(b => b.status === 'Pending').length },
        { name: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length },
        { name: 'Completed', value: bookings.filter(b => b.status === 'Completed').length },
    ];

    const STATUS_COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

    return (
        <AdminLayout title="Overview">
            <div className="max-w-7xl mx-auto space-y-8 pb-10">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`Rp ${totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        trend="+12.5%"
                        trendUp={true}
                        color="bg-emerald-500"
                    />
                    <StatCard
                        title="Active Bookings"
                        value={activeBookings.toString()}
                        icon={ShoppingBag}
                        trend="+4.3%"
                        trendUp={true}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Total Customers"
                        value={totalUsers.toString()}
                        icon={Users}
                        trend="+2.1%"
                        trendUp={true}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Active Products"
                        value={totalProducts.toString()}
                        icon={Package}
                        trend="0%"
                        trendUp={false}
                        color="bg-orange-500"
                    />
                </div>

                <DashboardAnalytics />

                {/* Recent Transactions */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Recent Transactions</h3>
                        <button className="text-emerald-600 text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
                                    <th className="pb-3 pl-4">Customer</th>
                                    <th className="pb-3">Product</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.slice(0, 5).map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                                        <td className="py-4 pl-4 font-bold text-gray-900">{booking.customerName}</td>
                                        <td className="py-4 text-sm text-gray-600">{booking.productName}</td>
                                        <td className="py-4 text-sm text-gray-500">{booking.date}</td>
                                        <td className="py-4 font-bold text-gray-900">Rp {booking.amount.toLocaleString()}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                                booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Components
function StatCard({ title, value, icon: Icon, trend, trendUp, color }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${color}`}></div>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl text-white ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider">{title}</h4>
            <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
        </div>
    );
}
