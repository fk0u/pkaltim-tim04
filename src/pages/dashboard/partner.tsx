import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PartnerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    if (user && user.role !== 'mitra' && user.role !== 'admin') {
      router.push('/dashboard/client');
    }
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  return (
    <Layout title="Partner Dashboard - Coming Soon">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>

            <div className="w-24 h-24 bg-emerald-50 rounded-3xl mx-auto flex items-center justify-center mb-8 text-emerald-600 shadow-lg shadow-emerald-100">
              <Building2 className="w-12 h-12" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Partner Dashboard
            </h1>
            <p className="text-xl text-gray-400 font-medium mb-8">
              We are building something amazing for our partners. <br />
              <span className="text-emerald-600 font-bold">Coming Soon!</span>
            </p>

            <div className="inline-flex flex-col gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-200 flex items-center gap-2 justify-center"
              >
                Back to Home <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/dashboard/client')}
                className="px-8 py-4 bg-white border-2 border-gray-100 hover:border-emerald-200 text-gray-500 hover:text-emerald-600 font-bold rounded-2xl transition"
              >
                Go to Traveler Dashboard
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
