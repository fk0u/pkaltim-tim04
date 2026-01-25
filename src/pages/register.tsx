import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, Briefcase, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'traveler' | 'partner'>('traveler');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = await register(name, email, password);

        if (!success) {
            alert('Registration failed. Email might be already registered.');
        }
        setIsLoading(false);
    };

    return (
        <>
            <Head>
                <title>Daftar - BorneoTrip</title>
                <meta name="description" content="Bergabung dengan BorneoTrip dan mulai petualangan Anda." />
            </Head>

            <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
                {/* Back Button */}
                <div className="absolute top-6 left-6 z-20">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-all group px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Kembali</span>
                    </Link>
                </div>

                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-bl from-emerald-950/90 via-black/60 to-emerald-900/90 backdrop-blur-[2px]"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
                >
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block group">
                            <h1 className="text-5xl font-black text-white tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-300">
                                BorneoTrip<span className="text-emerald-400">.</span>
                            </h1>
                        </Link>
                        <p className="text-emerald-100/80 text-lg font-medium">Buat Akun Petualang Baru</p>
                    </div>

                    <div className="bg-white/95 backdrop-blur-xl py-10 px-8 shadow-2xl shadow-black/20 rounded-[2.5rem] border border-white/20 relative overflow-hidden">
                        {/* Decorative Top Line */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>

                        {/* Role Switcher for Registration */}
                        <div className="flex p-1.5 bg-gray-100/80 rounded-2xl mb-8 relative">
                            <motion.div
                                className="absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-sm z-0"
                                initial={false}
                                animate={{
                                    left: role === 'traveler' ? '6px' : '50%',
                                    width: 'calc(50% - 6px)'
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <button
                                onClick={() => setRole('traveler')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${role === 'traveler' ? 'text-emerald-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Sparkles className="w-4 h-4" /> Traveler
                            </button>
                            <button
                                onClick={() => setRole('partner')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${role === 'partner' ? 'text-emerald-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Briefcase className="w-4 h-4" /> Mitra / Partner
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={role}
                                initial={{ opacity: 0, x: role === 'traveler' ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: role === 'traveler' ? 20 : -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form className="space-y-5" onSubmit={handleRegister}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Nama Lengkap</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-gray-50 focus:bg-white font-medium"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-gray-50 focus:bg-white font-medium"
                                                    placeholder="name@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-gray-50 focus:bg-white font-medium"
                                                    placeholder="Buat kata sandi kuat"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-emerald-500/30 text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Daftar Sekarang <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <p className="text-gray-500 text-sm font-medium">
                                            Sudah punya akun?{' '}
                                            <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-500">
                                                Masuk disini
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
