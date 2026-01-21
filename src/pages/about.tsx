import Layout from '@/components/Layout';
import { Leaf, Users, Heart, ShieldCheck, TreePine, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
   const { t } = useLanguage();

   const fadeInUp = {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8 }
   };

   return (
      <Layout title={`${t.nav.about} - BorneoTrip`}>
         {/* HEADER */}
         <div className="bg-emerald-950/90 text-white relative overflow-hidden h-screen flex items-center justify-center">
            <motion.div
               initial={{ scale: 1.1 }}
               animate={{ scale: 1 }}
               transition={{ duration: 2, ease: "easeOut" }}
               className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5d2294c?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent"></div>

            <motion.div
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 1 }}
               className="max-w-5xl mx-auto px-4 text-center relative z-10"
            >
               <div className="inline-flex items-center gap-2 glass px-6 py-2 rounded-full text-emerald-300 font-bold text-sm mb-8 border border-emerald-500/30 uppercase tracking-widest shadow-lg">
                  <Leaf className="w-4 h-4" /> {t.about.missionBadge}
               </div>
               <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight drop-shadow-2xl">
                  {t.about.title} <br /><span className="text-emerald-400">{t.about.titleHighlight}</span>
               </h1>
               <p className="text-xl md:text-2xl text-emerald-100/90 leading-relaxed max-w-3xl mx-auto font-light">
                  {t.about.subtitle}
               </p>
            </motion.div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

            {/* IMPACT METRICS */}
            <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-b border-gray-100 pb-16"
            >
               {[
                  { val: "5%", label: t.about.stats.profit },
                  { val: "12+", label: t.about.stats.communities },
                  { val: "1.5k", label: t.about.stats.trees },
                  { val: "0", label: t.about.stats.plastic }
               ].map((stat, idx) => (
                  <motion.div
                     key={idx}
                     initial={{ opacity: 0, scale: 0.8 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: idx * 0.1 }}
                     className="text-center"
                  >
                     <div className="text-4xl md:text-5xl font-black text-emerald-600 mb-2">{stat.val}</div>
                     <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
               ))}
            </motion.div>

            {/* PILLARS */}
            <div className="mb-24">
               <motion.div {...fadeInUp} className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{t.about.pillars.title}</h2>
                  <p className="text-gray-500 text-lg">{t.about.pillars.subtitle}</p>
               </motion.div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {[
                     { icon: TreePine, color: 'emerald', title: t.about.pillars.envTitle, desc: t.about.pillars.envDesc },
                     { icon: Users, color: 'blue', title: t.about.pillars.comTitle, desc: t.about.pillars.comDesc },
                     { icon: Heart, color: 'orange', title: t.about.pillars.cultTitle, desc: t.about.pillars.cultDesc }
                  ].map((item, idx) => (
                     <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                        whileHover={{ y: -10 }}
                        className={`glass-panel p-8 rounded-3xl shadow-lg border border-${item.color}-100 hover:shadow-2xl transition duration-300 text-center group bg-white/80`}
                     >
                        <div className={`w-20 h-20 bg-${item.color}-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-${item.color}-100 transition duration-300 transform group-hover:rotate-6`}>
                           <item.icon className={`w-10 h-10 text-${item.color}-600`} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">
                           {item.desc}
                        </p>
                     </motion.div>
                  ))}
               </div>
            </div>

            {/* STORY SECTION */}
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="glass-panel rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative bg-gray-50/50"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>

               <div className="md:w-1/2 relative z-10">
                  <motion.img
                     initial={{ opacity: 0, x: -50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.2 }}
                     src="https://images.unsplash.com/photo-1596401057633-565652b5d249?auto=format&fit=crop&q=80"
                     alt="Masyarakat Lokal"
                     className="rounded-3xl shadow-2xl w-full h-[450px] object-cover rotate-2 hover:rotate-0 transition duration-700"
                  />
               </div>
               <div className="md:w-1/2 relative z-10">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">{t.about.why.title} <br />{t.about.why.titleHighlight}</h2>
                  <div className="space-y-8">
                     <motion.div
                        whileHover={{ x: 10 }}
                        className="flex gap-5 bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100"
                     >
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                           <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 text-lg mb-1">{t.about.why.reason1Title}</h4>
                           <p className="text-sm text-gray-600 leading-relaxed">{t.about.why.reason1Desc}</p>
                        </div>
                     </motion.div>
                     <motion.div
                        whileHover={{ x: 10 }}
                        className="flex gap-5 bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-100"
                     >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                           <Droplets className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 text-lg mb-1">{t.about.why.reason2Title}</h4>
                           <p className="text-sm text-gray-600 leading-relaxed">{t.about.why.reason2Desc}</p>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </motion.div>
         </div>
      </Layout>
   );
}
