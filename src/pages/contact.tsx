import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui';
import { FormEvent } from 'react';

export default function Contact() {
    const { addToast } = useToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        addToast("Pesan Anda telah terkirim! Tim kami akan segera menghubungi Anda.", "success");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <Layout title="Hubungi Kami - BorneoTrip">
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Simple Header */}
                <div className="bg-emerald-900 text-white pt-40 pb-32 mb-[-6rem] relative overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"
                    />
                    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                        >
                            Let's Start Your Journey
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-xl text-emerald-100/80 max-w-2xl mx-auto"
                        >
                            Punya pertanyaan tentang paket wisata atau ingin kustomisasi itinerary? Tim kami siap membantu Anda 24/7.
                        </motion.p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            {[
                                { icon: Phone, title: "Telepon & WhatsApp", desc: "Senin - Minggu, 08:00 - 20:00 WITA", link: "+62 812 3456 7890", href: "tel:+6281234567890" },
                                { icon: Mail, title: "Email Support", desc: "Kami akan membalas maksimal dalam 24 jam.", link: "hello@borneotrip.id", href: "mailto:hello@borneotrip.id" },
                                { icon: MapPin, title: "Kunjungi Kami", desc: "Jl. Jenderal Sudirman No. 45\nBalikpapan Kota, Kalimantan Timur", link: "", href: "" }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (idx * 0.2) }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
                                >
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-500 mb-4 whitespace-pre-line">{item.desc}</p>
                                    {item.link && (
                                        <a href={item.href} className="text-lg font-bold text-emerald-600 hover:text-emerald-700 block transition">{item.link}</a>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Form & Map */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Kirim Pesan</h2>
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                                            <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                            <input type="email" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Subjek</label>
                                        <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" placeholder="Saya ingin bertanya tentang..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Pesan</label>
                                        <textarea rows={5} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" placeholder="Tulis pesan Anda di sini..."></textarea>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" /> Kirim Pesan
                                    </motion.button>
                                </form>
                            </motion.div>

                            {/* Map Embed */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                                className="bg-gray-200 rounded-[2.5rem] overflow-hidden h-80 shadow-inner border-4 border-white"
                            >
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.48624127598!2d116.8941011!3d-1.2449991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df147363f6832f3%3A0x63a79d9f52c4238!2sBalikpapan%2C%20East%20Kalimantan!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition duration-1000"
                                ></iframe>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
