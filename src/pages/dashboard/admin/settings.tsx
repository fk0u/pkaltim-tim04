import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Globe, Save, Upload, Shield } from 'lucide-react';
import { useToast } from '@/components/ui';

export default function SettingsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);

    // Mock States for form
    const [formData, setFormData] = useState({
        siteName: 'BorneoTrip Platform',
        adminEmail: 'admin@borneotrip.com',
        maintenanceMode: false,
        emailNotif: true,
        pushNotif: false,
        '2fa': true
    });

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
    }, [isAuthenticated, router]);

    if (!user) return null;

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API Call
        setTimeout(() => {
            setIsLoading(false);
            addToast("Pengaturan berhasil disimpan!", "success");
        }, 1200);
    };

    const tabs = [
        { id: 'profile', label: 'Profil Admin', icon: User },
        { id: 'general', label: 'Umum & Platform', icon: Globe },
        { id: 'security', label: 'Keamanan', icon: Shield },
        { id: 'notifications', label: 'Notifikasi', icon: Bell },
    ];

    return (
        <AdminLayout title="Pengaturan Sistem">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Sidebar Tabs */}
                <div className="lg:w-1/4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 space-y-1 sticky top-24">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
                                            ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:w-3/4">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="w-6 h-6 text-emerald-600" /> Informasi Profil
                                </h2>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold overflow-hidden border-4 border-white shadow-lg">
                                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : 'AD'}
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                                        <p className="text-gray-500 text-sm">{user.email}</p>
                                        <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">Super Admin</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Nama Lengkap</label>
                                        <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email Login</label>
                                        <input type="email" defaultValue={user.email} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">Bio Singkat</label>
                                        <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50" defaultValue="Lead Administrator for BorneoTrip platform operations." />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-blue-600" /> Konfigurasi Platform
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Nama Situs</label>
                                        <input
                                            type="text"
                                            value={formData.siteName}
                                            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                                        <div>
                                            <h4 className="font-bold text-orange-900">Mode Pemeliharaan (Maintenance)</h4>
                                            <p className="text-sm text-orange-700/80">Jika aktif, hanya admin yang bisa mengakses situs.</p>
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
                                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.maintenanceMode ? 'bg-orange-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${formData.maintenanceMode ? 'translate-x-6' : ''}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-red-600" /> Keamanan Akun
                                </h2>

                                <div className="space-y-6">
                                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-4">
                                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 mt-1">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-emerald-900">Password Terakhir Diubah</h4>
                                            <p className="text-sm text-emerald-700/80 mb-3">3 hari yang lalu. Disarankan mengganti password setiap 90 hari.</p>
                                            <button className="text-sm font-bold text-emerald-700 underline">Ganti Password</button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-900">Autentikasi 2 Faktor (2FA)</h4>
                                            <p className="text-sm text-gray-500">Tambahan keamanan saat login admin.</p>
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, '2fa': !formData['2fa'] })}
                                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData['2fa'] ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${formData['2fa'] ? 'translate-x-6' : ''}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATION TAB */}
                        {activeTab === 'notifications' && (
                            <div className="p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Bell className="w-6 h-6 text-yellow-500" /> Preferensi Notifikasi
                                </h2>
                                <div className="space-y-4">
                                    {['Email Notifikasi Booking Baru', 'Laporan Harian via Email', 'Notifikasi Pembayaran', 'Push Notification Browser'].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                            <span className="font-medium text-gray-700">{item}</span>
                                            <input type="checkbox" defaultChecked={idx < 2} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FOOTER ACTIONS */}
                        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end gap-3">
                            <button className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition">Batal</button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isLoading ? (
                                    <>Menyimpan...</>
                                ) : (
                                    <><Save className="w-4 h-4" /> Simpan Perubahan</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
}
