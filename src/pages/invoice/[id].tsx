import { useRouter } from 'next/router';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef } from 'react';
import { Printer, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

export default function InvoicePage() {
    const router = useRouter();
    const { id } = router.query;
    const { getBookingById } = useBooking();
    const { user } = useAuth();

    // In a real app, fetch from API. Here get from context.
    const booking = typeof id === 'string' ? getBookingById(id) : null;

    useEffect(() => {
        if (!booking && router.isReady) {
            // Handle not found
        }
    }, [booking, router.isReady]);

    const handlePrint = () => {
        window.print();
    };

    if (!booking || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans print:bg-white text-slate-800">
            <Head>
                <title>Invoice #{booking.id} - BorneoTrip</title>
            </Head>

            {/* Navbar (Hidden on Print) */}
            <div className="print:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <Link href="/history" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold transition">
                        <ArrowLeft className="w-5 h-5" /> Kembali
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-emerald-200"
                    >
                        <Download className="w-4 h-4" /> Download PDF / Print
                    </button>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="max-w-3xl mx-auto p-8 md:p-12 print:p-0 print:max-w-none">
                <div className="bg-white rounded-3xl shadow-xl print:shadow-none print:rounded-none overflow-hidden relative">

                    {/* Status Stamp */}
                    <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-10 print:opacity-100">
                        <div className="border-4 border-emerald-500 rounded-lg p-2 rotate-12">
                            <span className="text-4xl font-black text-emerald-500 uppercase tracking-widest">PAID</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="bg-emerald-900 text-white p-12 print:bg-white print:text-black print:border-b print:border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
                                    BorneoTrip<span className="text-emerald-400 print:text-emerald-600">.</span>
                                </h1>
                                <p className="opacity-80 text-sm max-w-xs leading-relaxed print:text-gray-500">
                                    PT. Borneo Trip Indonesia<br />
                                    Jl. Mulawarman No. 45, Samarinda<br />
                                    Kalimantan Timur, Indonesia 75112
                                </p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-light opacity-50 mb-1 print:text-gray-300">INVOICE</h2>
                                <p className="font-mono font-bold text-xl">#{booking.id}</p>
                                <p className="text-sm opacity-70 print:text-gray-500 mt-1">
                                    {new Date(booking.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-12">
                        {/* Bill To */}
                        <div className="flex justify-between mb-12">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ditagihkan Kepada</h3>
                                <p className="font-bold text-xl text-gray-900">{user.name}</p>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Metode Pembayaran</h3>
                                <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 font-bold text-gray-700">
                                    Virtual Account BCA
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="mb-12">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        <th className="text-left py-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-1/2">Deskripsi</th>
                                        <th className="text-center py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Qty</th>
                                        <th className="text-right py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Harga</th>
                                        <th className="text-right py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                    <tr className="border-b border-gray-50">
                                        <td className="py-6">
                                            <p className="font-bold text-gray-900 mb-1">{booking.productName}</p>
                                            <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{booking.location}</p>
                                        </td>
                                        <td className="py-6 text-center font-medium">{booking.totalPax}x</td>
                                        <td className="py-6 text-right font-medium">Rp {(booking.amount / booking.totalPax).toLocaleString('id-ID')}</td>
                                        <td className="py-6 text-right font-bold text-gray-900">Rp {booking.amount.toLocaleString('id-ID')}</td>
                                    </tr>
                                    {/* Additional Fees example */}
                                    <tr className="border-b border-gray-50">
                                        <td className="py-4 text-sm text-gray-500">Biaya Layanan & Administrasi</td>
                                        <td className="py-4 text-center text-sm text-gray-500">1x</td>
                                        <td className="py-4 text-right text-sm text-gray-500">Rp 0</td>
                                        <td className="py-4 text-right text-sm font-bold text-gray-900">Rp 0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Total */}
                        <div className="flex justify-end">
                            <div className="w-1/2">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">Rp {booking.amount.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Tax & Fees</span>
                                    <span className="font-medium text-gray-900">Termasuk</span>
                                </div>
                                <div className="flex justify-between py-4">
                                    <span className="font-bold text-xl text-emerald-900">Total</span>
                                    <span className="font-black text-2xl text-emerald-600">Rp {booking.amount.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Notes */}
                        <div className="mt-16 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
                            <p className="mb-2">Terima kasih telah mempercayakan perjalanan Anda kepada BorneoTrip.</p>
                            <p>Invoice ini sah dan diproses oleh komputer. Silakan simpan untuk bukti transaksi.</p>
                            <div className="mt-6 flex justify-center gap-4 print:hidden">
                                <Link href="/terms" className="font-bold text-emerald-600 hover:underline">Syarat & Ketentuan</Link>
                                <span className="text-gray-300">|</span>
                                <Link href="/contact" className="font-bold text-emerald-600 hover:underline">Pusat Bantuan</Link>
                            </div>
                        </div>

                    </div>
                    {/* Bottom Decorative Strip */}
                    <div className="h-4 bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-500 print:bg-emerald-600"></div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        background: white;
                    }
                }
            `}</style>
        </div>
    );
}
