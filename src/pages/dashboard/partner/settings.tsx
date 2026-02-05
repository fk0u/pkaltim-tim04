import Head from 'next/head';
import PartnerLayout from '@/components/layouts/PartnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';
import { Bell, Lock, Shield, Smartphone, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PartnerSettingsPage() {
    const { user } = useAuth();
    const { addToast } = useToast();

    // Mock Settings State
    const [settings, setSettings] = useState({
        emailNotif: true,
        pushNotif: false,
        promoEmail: true,
        twoFactor: false
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        addToast('Pengaturan berhasil disimpan', 'success');
    };

    return (
        <PartnerLayout title="Pengaturan Akun">
            <Head>
                <title>Settings - Partner Dashboard</title>
            </Head>

            <div className="max-w-3xl mx-auto space-y-8">

                {/* Account Security */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Keamanan Akun</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                        <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-2 rounded-full text-gray-600"><Lock className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Kata Sandi</h3>
                                    <p className="text-sm text-gray-500">Terakhir diubah 3 bulan yang lalu</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                                Ubah
                            </button>
                        </div>

                        <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-2 rounded-full text-gray-600"><Smartphone className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Autentikasi Dua Faktor (2FA)</h3>
                                    <p className="text-sm text-gray-500">Tambahkan lapisan keamanan ekstra</p>
                                </div>
                            </div>
                            <div
                                onClick={() => toggleSetting('twoFactor')}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${settings.twoFactor ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <motion.div
                                    layout
                                    className="bg-white w-4 h-4 rounded-full shadow-sm"
                                    initial={false}
                                    animate={{ x: settings.twoFactor ? 24 : 0 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                        <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                            <Bell className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Preferensi Notifikasi</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                        <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                            <div>
                                <h3 className="font-bold text-gray-900">Notifikasi Email</h3>
                                <p className="text-sm text-gray-500">Terima update tentang pesanan dan status akun</p>
                            </div>
                            <div
                                onClick={() => toggleSetting('emailNotif')}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${settings.emailNotif ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <motion.div
                                    layout
                                    className="bg-white w-4 h-4 rounded-full shadow-sm"
                                    initial={false}
                                    animate={{ x: settings.emailNotif ? 24 : 0 }}
                                />
                            </div>
                        </div>

                        <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                            <div>
                                <h3 className="font-bold text-gray-900">Info Promo & Tips</h3>
                                <p className="text-sm text-gray-500">Dapatkan tips sukses dan promo partner</p>
                            </div>
                            <div
                                onClick={() => toggleSetting('promoEmail')}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${settings.promoEmail ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <motion.div
                                    layout
                                    className="bg-white w-4 h-4 rounded-full shadow-sm"
                                    initial={false}
                                    animate={{ x: settings.promoEmail ? 24 : 0 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-400 p-4">
                    BorneoTrip Partner Dashboard v1.0.0
                </div>

            </div>
        </PartnerLayout>
    );
}
