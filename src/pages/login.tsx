import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Shield, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'client' | 'staff'>('client');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === 'staff') {
            // Simulate admin logic check
            if (email.includes('operator')) login('operator');
            else login('admin');
        } else {
            login('client');
        }
    };

    return (
        <Layout title="Masuk - BorneoTrip">
            <div className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-black/50 to-emerald-900/90 backdrop-blur-sm"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
                >
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block">
                            <h1 className="text-4xl font-extrabold text-white tracking-tight">BorneoTrip<span className="text-emerald-400">.</span></h1>
                        </Link>
                        <p className="mt-3 text-emerald-100/80">Welcome back to paradise.</p>
                    </div>

                    <div className="bg-white py-10 px-8 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] border border-gray-100">
                        {/* Role Switcher */}
                        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                            <button
                                onClick={() => setActiveTab('client')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'client' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <User className="w-4 h-4" /> Traveler
                            </button>
                            <button
                                onClick={() => setActiveTab('staff')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'staff' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Briefcase className="w-4 h-4" /> Staff / Admin
                            </button>
                        </div>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                                        placeholder={activeTab === 'staff' ? 'admin@borneotrip.id' : 'name@example.com'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                                        Ingat saya
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-bold text-emerald-600 hover:text-emerald-500">
                                        Lupa password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-200 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition transform hover:translate-y-[-2px]"
                                >
                                    {activeTab === 'client' ? 'Masuk Sekarang' : 'Login ke Dashboard'} <ArrowRight className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {activeTab === 'client' && (
                            <div className="mt-8 text-center text-sm">
                                <span className="text-gray-500">Belum punya akun?</span>{' '}
                                <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-500">
                                    Daftar Gratis
                                </Link>
                            </div>
                        )}

                        {activeTab === 'staff' && (
                            <div className="mt-6 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg text-center">
                                Tip: Gunakan email yang mengandung 'admin' untuk Admin Role, atau 'operator' untuk Operator Role.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
