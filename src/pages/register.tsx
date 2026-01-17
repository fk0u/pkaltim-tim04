import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        register(name, email);
    };

    return (
        <Layout title="Daftar - BorneoTrip">
            <div className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-bl from-emerald-900/90 via-black/50 to-emerald-900/90 backdrop-blur-sm"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
                >
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block">
                            <h1 className="text-4xl font-extrabold text-white tracking-tight">BorneoTrip<span className="text-emerald-400">.</span></h1>
                        </Link>
                        <p className="mt-3 text-emerald-100/80">Buat akun untuk booking lebih cepat.</p>
                    </div>

                    <div className="bg-white py-10 px-8 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] border border-gray-100">

                        <form className="space-y-5" onSubmit={handleRegister}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                                        placeholder="name@example.com"
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
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                                        placeholder="Create password"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-200 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition transform hover:translate-y-[-2px]"
                                >
                                    Buat Akun Saya <ArrowRight className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-gray-500">Sudah punya akun?</span>{' '}
                            <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-500">
                                Masuk di sini
                            </Link>
                        </div>

                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
