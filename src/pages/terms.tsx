import Layout from '@/components/Layout';
import { Scale, FileCheck, CreditCard, AlertTriangle, HelpCircle } from 'lucide-react';

export default function Terms() {
    return (
        <Layout title="Syarat dan Ketentuan - BorneoTrip">
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Header */}
                <div className="bg-emerald-900 text-white pt-32 pb-20 rounded-b-[3rem] mb-12">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                            <Scale className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Syarat & Ketentuan</h1>
                        <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
                            Harap membaca ketentuan penggunaan layanan BorneoTrip dengan seksama untuk memastikan pengalaman perjalanan yang lancar.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-12">

                        {/* Section 1 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <FileCheck className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Persetujuan Layanan</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Dengan mengakses dan menggunakan situs web serta layanan pemesanan BorneoTrip, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang tertulis di sini.
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Pembayaran & Pembatalan</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ketentuan mengenai transaksi finansial:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-blue-500">
                                    <li>Pembayaran penuh wajib dilakukan maksimal 2x24 jam setelah konfirmasi pemesanan.</li>
                                    <li>Pembatalan H-30 keberangkatan akan dikenakan biaya administrasi 10%.</li>
                                    <li>Pembatalan H-7 tidak dapat dilakukan refund (pengembalian dana).</li>
                                    <li>Semua harga yang tertera dalam mata uang Rupiah (IDR) dan sudah termasuk pajak.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Tanggung Jawab Peserta</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Peserta wajib mematuhi norma dan adat istiadat setempat selama perjalanan, khususnya saat mengunjungi desa adat Dayak dan area konservasi. BorneoTrip berhak memberhentikan keikutsertaan peserta yang melanggar hukum atau mengganggu ketertiban tanpa pengembalian dana.
                                </p>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Perubahan Itinerary</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Jadwal perjalanan dapat berubah sewaktu-waktu tergantung pada kondisi cuaca, lalu lintas, dan situasi di lapangan demi keselamatan peserta. BorneoTrip akan berusaha memberikan alternatif terbaik jika terjadi perubahan.
                                </p>
                            </div>
                        </section>

                        <div className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 italic">
                                Dokumen ini efektif berlaku mulai 1 Januari 2026.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
