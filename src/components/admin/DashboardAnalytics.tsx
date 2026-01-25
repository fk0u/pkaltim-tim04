import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

// Mock Data
const revenueData = [
    { name: 'Jan', revenue: 45000000, bookings: 24 },
    { name: 'Feb', revenue: 52000000, bookings: 28 },
    { name: 'Mar', revenue: 48000000, bookings: 26 },
    { name: 'Apr', revenue: 61000000, bookings: 32 },
    { name: 'May', revenue: 55000000, bookings: 29 },
    { name: 'Jun', revenue: 78000000, bookings: 45 },
    { name: 'Jul', revenue: 92000000, bookings: 52 },
];

const categoryData = [
    { name: 'Nature', value: 45, color: '#10b981' }, // Emerald-500
    { name: 'Culture', value: 25, color: '#8b5cf6' }, // Violet-500
    { name: 'Culinary', value: 20, color: '#f59e0b' }, // Amber-500
    { name: 'Adventure', value: 10, color: '#ef4444' }, // Red-500
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 text-white p-3 rounded-xl shadow-xl border border-slate-700">
                <p className="font-bold text-sm mb-1">{label}</p>
                <p className="text-xs text-emerald-400">
                    Revenue: Rp {payload[0].value.toLocaleString()}
                </p>
                <p className="text-xs text-blue-400">
                    Bookings: {payload[1]?.value}
                </p>
            </div>
        );
    }
    return null;
};

export default function DashboardAnalytics() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                            <p className="text-sm text-gray-500">Monthly revenue overview & growth.</p>
                        </div>
                        <select className="bg-gray-50 border border-gray-200 text-sm font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option>Last 7 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="bookings"
                                    stroke="#3b82f6"
                                    strokeWidth={0} // Hidden line, just for tooltip data
                                    fillOpacity={0}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Popular Categories Pie Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Category Distribution</h3>
                    <p className="text-sm text-gray-500 mb-6">Most popular trip types.</p>

                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-2xl font-black text-slate-800">100%</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {categoryData.map((cat) => (
                            <div key={cat.name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                <span className="text-xs font-bold text-gray-600">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
