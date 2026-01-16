import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    return (
        <Layout title="Hubungi Kami - BorneoTrip">
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Simple Header */}
                <div className="bg-emerald-900 text-white pt-32 pb-32 mb-[-6rem]">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-black mb-6">Let's Start Your Journey</h1>
                        <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
                            Punya pertanyaan tentang paket wisata atau ingin kustomisasi itinerary? Tim kami siap membantu Anda 24/7.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Telepon & WhatsApp</h3>
                                <p className="text-gray-500 mb-4">Senin - Minggu, 08:00 - 20:00 WITA</p>
                                <a href="tel:+6281234567890" className="text-lg font-bold text-emerald-600 hover:text-emerald-700 block">+62 812 3456 7890</a>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                                <p className="text-gray-500 mb-4">Kami akan membalas maksimal dalam 24 jam.</p>
                                <a href="mailto:hello@borneotrip.id" className="text-lg font-bold text-emerald-600 hover:text-emerald-700 block">hello@borneotrip.id</a>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Kunjungi Kami</h3>
                                <p className="text-gray-500">
                                    Jl. Jenderal Sudirman No. 45<br />
                                    Balikpapan Kota, Kalimantan Timur<br />
                                    76114, Indonesia
                                </p>
                            </div>
                        </div>

                        {/* Form & Map */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact Form */}
                            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Kirim Pesan</h2>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                            <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Subjek</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" placeholder="Saya ingin bertanya tentang..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Pesan</label>
                                        <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" placeholder="Tulis pesan Anda di sini..."></textarea>
                                    </div>
                                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2">
                                        <Send className="w-5 h-5" /> Kirim Pesan
                                    </button>
                                </form>
                            </div>

                            {/* Map Embed */}
                            <div className="bg-gray-200 rounded-3xl overflow-hidden h-80 shadow-inner">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.48624127598!2d116.8941011!3d-1.2449991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df147363f6832f3%3A0x63a79d9f52c4238!2sBalikpapan%2C%20East%20Kalimantan!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition duration-500"
                                ></iframe>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
