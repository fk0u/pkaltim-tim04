import Layout from '@/components/Layout';
import { Shield, Lock, Eye, FileText, Server } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <Layout title="Kebijakan Privasi - BorneoTrip">
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Header */}
                <div className="bg-emerald-900 text-white pt-32 pb-20 rounded-b-[3rem] mb-12">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                            <Shield className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Kebijakan Privasi</h1>
                        <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
                            Kami berkomitmen untuk melindungi data pribadi Anda saat menjelajahi keindahan Kalimantan. Transparansi adalah prioritas kami.
                        </p>
                        <p className="mt-8 text-sm text-emerald-200/60 uppercase tracking-widest font-bold">Terakhir Diperbarui: 15 Januari 2026</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-12">

                        {/* Section 1 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Eye className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informasi yang Kami Kumpulkan</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Untuk memberikan layanan terbaik dalam merancanakan perjalanan Anda, kami mengumpulkan beberapa jenis informasi:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-emerald-500">
                                    <li><span className="font-semibold text-gray-900">Identitas Pribadi:</span> Nama lengkap, alamat email, nomor telepon, dan identitas resmi (KTP/Paspor) untuk keperluan pemesanan tiket.</li>
                                    <li><span className="font-semibold text-gray-900">Data Transaksi:</span> Detail pembayaran dan riwayat pemesanan paket wisata Anda.</li>
                                    <li><span className="font-semibold text-gray-900">Data Teknis:</span> Alamat IP, jenis perangkat, dan data penggunaan website untuk peningkatan performa.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Penggunaan Informasi</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Data Anda digunakan semata-mata untuk:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-blue-500">
                                    <li>Memproses dan mengonfirmasi reservasi perjalanan Anda.</li>
                                    <li>Mengirimkan notifikasi penting terkait perubahan jadwal atau status pembayaran.</li>
                                    <li>Meningkatkan kualitas layanan dan rekomendasi personalisasi.</li>
                                    <li>Mematuhi kewajiban hukum yang berlaku di Indonesia.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Lock className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Keamanan Data</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Kami menerapkan standar keamanan industri (enkripsi SSL/TLS) untuk melindungi data Anda selama transmisi dan penyimpanan. Kami tidak akan pernah menjual data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan eksplisit Anda.
                                </p>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Server className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Penyimpanan Data</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Data Anda disimpan di server yang aman dan hanya disimpan selama diperlukan untuk memenuhi tujuan yang disebutkan dalam kebijakan ini, atau sebagaimana diwajibkan oleh hukum. Anda berhak meminta penghapusan data akun Anda kapan saja melalui layanan pelanggan.
                                </p>
                            </div>
                        </section>

                        <div className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 italic">
                                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di <a href="mailto:privacy@borneotrip.id" className="text-emerald-600 font-bold hover:underline">privacy@borneotrip.id</a>.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
