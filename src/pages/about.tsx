import Layout from '@/components/Layout';
import { Leaf, Users, Heart, ShieldCheck, TreePine, Droplets } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout title="Sustainability - BorneoTrip">
      {/* HEADER */}
      <div className="bg-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5d2294c?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur px-4 py-1.5 rounded-full text-emerald-300 font-bold text-sm mb-6 border border-emerald-700">
             <Leaf className="w-4 h-4" /> Sustainbility Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Menjaga Hutan, <span className="text-emerald-400">Memuliakan Budaya</span></h1>
          <p className="text-lg text-emerald-100 leading-relaxed">
            BorneoTrip bukan sekadar platform wisata. Kami adalah gerakan untuk memastikan keindahan Kalimantan Timur tetap lestari untuk generasi mendatang.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* IMPACT METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-b pb-12 border-gray-100">
           <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">5%</div>
              <div className="text-sm text-gray-500 font-medium">Profit untuk Konservasi</div>
           </div>
           <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">12+</div>
              <div className="text-sm text-gray-500 font-medium">Komunitas Adat Diberdayakan</div>
           </div>
           <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">1.5k</div>
              <div className="text-sm text-gray-500 font-medium">Pohon Ulin Ditanam</div>
           </div>
           <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">0</div>
              <div className="text-sm text-gray-500 font-medium">Single-use Plastic Policy</div>
           </div>
        </div>

        {/* PILLARS */}
        <div className="mb-20">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">3 Pilar Utama Kami</h2>
              <p className="text-gray-500">Masa depan pariwisata adalah pariwisata yang bertanggung jawab.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-lg transition text-center group">
                 <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-100 transition">
                    <TreePine className="w-8 h-8 text-emerald-600" />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Environmental Protection</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                    Setiap paket wisata kami dirancang untuk meminimalkan jejak karbon dan berkontribusi langsung pada pelestarian habitat satwa endemik.
                 </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-lg transition text-center group">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition">
                    <Users className="w-8 h-8 text-blue-600" />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Community Empowerment</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                    Kami bekerja langsung dengan masyarakat lokal sebagai pemandu, tuan rumah homestay, dan penyedia logistik untuk memastikan ekonomi berputar di daerah.
                 </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 hover:shadow-lg transition text-center group">
                 <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-100 transition">
                    <Heart className="w-8 h-8 text-orange-600" />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Cultural Preservation</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                    Wisatawan diajak untuk mempelajari, menghormati, dan turut serta menjaga tradisi leluhur agar tetap hidup di tengah modernisasi.
                 </p>
              </div>
           </div>
        </div>

        {/* STORY SECTION */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
               <img 
                 src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80" 
                 alt="Masyarakat Lokal" 
                 className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
               />
            </div>
            <div className="md:w-1/2">
               <h2 className="text-3xl font-bold text-gray-900 mb-6">Mengapa Kalimantan Timur?</h2>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                     <div>
                        <h4 className="font-bold text-gray-900">Paru-paru Dunia</h4>
                        <p className="text-sm text-gray-600">Rumah bagi jutaan hektar hutan hujan tropis yang vital bagi iklim global.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <Droplets className="w-6 h-6 text-blue-600 flex-shrink-0" />
                     <div>
                        <h4 className="font-bold text-gray-900">Sungai Mahakam</h4>
                        <p className="text-sm text-gray-600">Urat nadi kehidupan yang menyimpan sejarah peradaban kerajaan tertua di Nusantara.</p>
                     </div>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}
