import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function Custom404() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80')] bg-cover opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10"
            >
                <div className="text-[10rem] md:text-[14rem] font-black text-emerald-500/20 leading-none select-none">404</div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 -mt-10 md:-mt-16">Halaman Tidak Ditemukan</h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto mb-10">
                    Sepertinya Anda tersesat di hutan belantara digital. Mari kembali ke jalur yang benar.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-full transition shadow-lg shadow-emerald-900/40">
                    <Home className="w-5 h-5" /> Kembali ke Beranda
                </Link>
            </motion.div>
        </div>
    );
}
