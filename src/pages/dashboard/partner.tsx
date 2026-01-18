import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Plus, Package, Users, TrendingUp, Calendar, MapPin, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PartnerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    packages: 0,
    bookings: 0,
    revenue: 0,
    rating: 0
  });

  useEffect(() => {
    if (!user) {
        if (typeof window !== 'undefined') router.push('/login');
    } else if (user.role !== 'mitra' && user.role !== 'admin') {
        router.push('/dashboard/client');
    }
    
    // In a real app, fetch stats from API based on user ID
    // Simulating data fetching
    setTimeout(() => {
        setStats({
            packages: 12,
            bookings: 48,
            revenue: 156000000,
            rating: 4.8
        });
    }, 500);
  }, [user, router]);

  if (!user) return null;

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard Mitra Travel</h1>
              <p className="text-slate-500">Selamat datang kembali, <span className="text-emerald-600 font-semibold">{user.name}</span></p>
            </div>
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-emerald-200">
              <Plus size={20} /> Tambah Paket Baru
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Paket Aktif', value: stats.packages, icon: Package, color: 'bg-blue-500', sub: '+2 bulan ini' },
              { label: 'Total Booking', value: stats.bookings, icon: Calendar, color: 'bg-emerald-500', sub: '+12% minggu ini' },
              { label: 'Pendapatan', value: `Rp ${(stats.revenue / 1000000).toFixed(0)}Jt`, icon: DollarSign, color: 'bg-amber-500', sub: 'Bulan berjalan' },
              { label: 'Rating Mitra', value: stats.rating, icon: TrendingUp, color: 'bg-rose-500', sub: 'Dari 120 ulasan' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">{stat.sub}</span>
                </div>
                <div className={`p-3 rounded-xl text-white ${stat.color} shadow-lg shadow-black/10`}>
                  <stat.icon size={24} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Packages Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Paket Wisata Terpopuler</h2>
              <Link href="#" className="text-emerald-600 text-sm font-bold hover:underline">Lihat Semua</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Nama Paket</th>
                    <th className="px-6 py-4 font-semibold">Lokasi</th>
                    <th className="px-6 py-4 font-semibold">Harga</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3].map((item) => (
                    <tr key={item} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="hidden md:block w-12 h-12 bg-slate-200 rounded-lg overflow-hidden relative">
                             {/* Placeholder image for list */}
                             <div className="absolute inset-0 bg-slate-300"></div> 
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">Ekowisata Derawan 4D3N</div>
                            <div className="text-xs text-slate-500">ID: PKG-00{item}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400" /> Berau
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">Rp 4.500.000</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">Aktif</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-emerald-600 transition font-medium text-sm">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
