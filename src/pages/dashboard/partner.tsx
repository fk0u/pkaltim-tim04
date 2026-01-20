import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { TourPackage as PackageType } from '@/types';
import { useBooking } from '@/contexts/BookingContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Plus, Package, Users, TrendingUp, Calendar, MapPin, DollarSign, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

export default function PartnerDashboard() {
  const { user } = useAuth();
  const { packages, addPackage, deletePackage } = useContent();
  const { bookings } = useBooking();
  const router = useRouter();
  const { addToast: showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PackageType>>({
    title: '',
    location: '',
    price: 0,
    duration: '3D2N',
    description: '',
    ecoRating: 4,
    rating: 4.5,
    imageUrl: '/picture/packages/1.jpg'
  });

  // Calculate Stats
  // In a real app, we would filter by partnerId. Here we assume the partner owns all packages they see or created.
  const myPackages = packages;
  const myBookings = bookings; // Simplifying assumption: Partner sees all bookings
  const totalRevenue = myBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  useEffect(() => {
    if (!user) {
      if (typeof window !== 'undefined') router.push('/login');
    } else if (user.role !== 'mitra' && user.role !== 'admin') {
      router.push('/dashboard/client');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'rating' || name === 'ecoRating') ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      showToast('Mohon lengkapi data paket', 'error');
      return;
    }

    // Ensure we send valid matching type
    const newPackage = {
      ...formData,
      facilities: ['Transport', 'Guide', 'Meals'] // Default facilities for demo
    };

    addPackage(newPackage as any);
    showToast('Paket wisata berhasil ditambahkan!', 'success');
    setIsModalOpen(false);
    setFormData({
      title: '',
      location: '',
      price: 0,
      duration: '3D2N',
      description: '',
      ecoRating: 4,
      rating: 4.5,
      imageUrl: '/picture/packages/1.jpg'
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus paket ${name}?`)) {
      deletePackage(id);
      showToast('Paket berhasil dihapus', 'success');
    }
  }

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
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-emerald-200"
            >
              <Plus size={20} /> Tambah Paket Baru
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Paket Aktif', value: myPackages.length, icon: Package, color: 'bg-blue-500', sub: 'Total paket tersedia' },
              { label: 'Total Booking', value: myBookings.length, icon: Calendar, color: 'bg-emerald-500', sub: 'Semua pesanan masuk' },
              { label: 'Pendapatan', value: `Rp ${(totalRevenue / 1000000).toFixed(1)}Jt`, icon: DollarSign, color: 'bg-amber-500', sub: 'Total pendapatan kotor' },
              { label: 'Rata-rata Rating', value: 4.8, icon: TrendingUp, color: 'bg-rose-500', sub: 'Kepuasan pelanggan' },
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

          {/* Packages Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Daftar Paket Wisata</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Nama Paket</th>
                    <th className="px-6 py-4 font-semibold">Lokasi</th>
                    <th className="px-6 py-4 font-semibold">Harga</th>
                    <th className="px-6 py-4 font-semibold text-center">Durasi</th>
                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="hidden md:block w-12 h-12 bg-slate-200 rounded-lg overflow-hidden relative min-w-[3rem]">
                            <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{pkg.title}</div>
                            <div className="text-xs text-slate-500">ID: {pkg.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400" /> {pkg.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-bold">{pkg.duration}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(pkg.id, pkg.title)}
                          className="text-slate-400 hover:text-rose-600 transition font-medium text-sm flex items-center gap-1 ml-auto"
                        >
                          <Trash2 size={16} /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {myPackages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        Belum ada paket wisata. Silakan tambah paket baru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Modal Implementation since UI Modal might be simple */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-900">Tambah Paket Wisata</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nama Paket</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Contoh: Ekowisata Derawan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Lokasi</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Contoh: Berau, Kalimantan Timur"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Harga (Rp)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Durasi</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="1 Hari">1 Hari</option>
                    <option value="2D1N">2D1N (2 Hari 1 Malam)</option>
                    <option value="3D2N">3D2N (3 Hari 2 Malam)</option>
                    <option value="4D3N">4D3N (4 Hari 3 Malam)</option>
                    <option value="5D4N">5D4N (5 Hari 4 Malam)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Tingkat Eco (1-5)</label>
                  <select
                    name="ecoRating"
                    value={formData.ecoRating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="5">5 - Sangat Ramah</option>
                    <option value="4">4 - Ramah</option>
                    <option value="3">3 - Cukup</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Gambar Sampul</label>
                  <select
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="/picture/packages/1.jpg">Gambar Gunung/Hutan 1</option>
                    <option value="/picture/packages/2.jpg">Gambar Sungai/Perahu</option>
                    <option value="/picture/packages/3.jpg">Gambar Hutan/Trekking</option>
                    <option value="/picture/packages/4.jpg">Gambar Desa Adat</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[100px]"
                  placeholder="Jelaskan daya tarik utama paket ini..."
                  required
                ></textarea>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                  Simpan Paket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
