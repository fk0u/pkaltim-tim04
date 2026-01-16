import Layout from '@/components/Layout';
import { PACKAGES } from '@/data/mockData';
import { MapPin, ArrowRight, ListFilter, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PackagesPage() {
  const [filter, setFilter] = useState('All');

  const filteredPackages = PACKAGES.filter(pkg => {
    if (filter === 'All') return true;
    if (filter === 'Eco-Trip') return pkg.ecoRating >= 5;
    if (filter === 'Cultural') return pkg.title.toLowerCase().includes('culture') || pkg.title.toLowerCase().includes('dayak');
    if (filter === 'Adventure') return pkg.title.toLowerCase().includes('hutan') || pkg.title.toLowerCase().includes('shark');
    return true;
  });

  return (
    <Layout title="Paket Wisata - BorneoTrip">
      <div className="bg-emerald-950 text-white py-20 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518182170546-0766ce6fdd93?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700 text-emerald-300 text-xs font-bold mb-4 backdrop-blur">
              <Leaf className="w-3 h-3" /> 100% Carbon Offset
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Paket Wisata</h1>
            <p className="text-emerald-100 text-lg max-w-xl">
              Jelajahi keindahan Kalimantan Timur dengan jejak karbon rendah dan dampak positif bagi komunitas.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-20 z-30 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-gray-200 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between transition-all"
        >
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto p-1 hide-scrollbar">
            {['All', 'Eco-Trip', 'Cultural', 'Adventure'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all relative ${filter === f
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {filter === f && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-emerald-600 rounded-xl shadow-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 text-sm font-semibold text-gray-500">
            <ListFilter className="w-4 h-4" /> {filteredPackages.length} Paket Ditemukan
          </div>
        </motion.div>

        {/* Packages Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredPackages.map((pkg) => (
              <motion.div
                layout
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/packages/${pkg.id}`} className="group h-full block">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 h-full flex flex-col relative">
                    <div className="relative h-64 overflow-hidden">
                      <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 shadow-sm flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> Eco-Rating: {pkg.ecoRating}/5
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-white font-bold text-lg">{pkg.duration}</span>
                      </div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center text-gray-500 text-xs mb-3 font-medium uppercase tracking-wide">
                        <MapPin className="w-3 h-3 mr-1 text-emerald-500" /> {pkg.location}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition leading-tight">{pkg.title}</h3>

                      <div className="space-y-2 mb-8 flex-grow">
                        {pkg.facilities.slice(0, 3).map((facility, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mr-2"></div>
                            {facility}
                          </div>
                        ))}
                      </div>

                      <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-gray-400">Mulai dari</div>
                          <div className="text-xl font-bold text-orange-600">
                            Rp {pkg.price.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
}
