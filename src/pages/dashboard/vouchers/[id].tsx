
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Printer, QrCode, FileText, Share2, Calendar, MapPin, Clock, ShieldCheck, Ticket } from 'lucide-react';
import { useToast } from '@/components/ui';
import Link from 'next/link';
import { ShareModal } from '@/components/ui';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useRef } from 'react';

// Mock Data for the specific requested ID
const MOCK_VOUCHER_BK_411375 = {
    id: "BK-411375",
    productName: "Derawan Island 3D2N Exclusive Trip",
    date: "2024-05-15T09:00:00",
    endDate: "2024-05-17T18:00:00",
    location: "Kepulauan Derawan, Kalimantan Timur",
    price: 3500000,
    totalPax: 2,
    amount: 7000000,
    status: "PAID",
    customerName: "Rizky Hasanuddin",
    customerEmail: "rizky@example.com",
    paymentMethod: "BCA Virtual Account",
    bookingDate: "2024-04-10T14:30:00",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-411375"
};

export default function VoucherDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const { getBookingById } = useBooking();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState<'invoice' | 'ticket'>('invoice');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Initial Loading State
    const [isLoading, setIsLoading] = useState(true);
    const [item, setItem] = useState<any>(null);

    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        // @ts-ignore - Content prop exists in standard usage but types might be mismatching
        content: () => componentRef.current,
        documentTitle: `Voucher-${id}`,
    });

    const handleDownloadPDF = async () => {
        const element = componentRef.current;
        if (!element) return;

        try {
            addToast("Generating PDF...", "info");
            // Basic font embedding fix for html-to-image if needed later, but usually works OOTB
            const dataUrl = await toPng(element, { cacheBust: true });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgProperties = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`voucher-${item?.id || 'doc'}.pdf`);
            addToast("Download started!", "success");
        } catch (error) {
            console.error("PDF Error:", error);
            addToast("Failed to generate PDF", "error");
        }
    };

    const handleSaveImage = async () => {
        const element = componentRef.current;
        if (!element) return;

        try {
            addToast("Generating Image...", "info");
            const dataUrl = await toPng(element, { cacheBust: true });
            const link = document.createElement('a');
            link.download = `eticket-${item?.id || 'doc'}.png`;
            link.href = dataUrl;
            link.click();
            addToast("Image Saved!", "success");
        } catch (error) {
            console.error("Image Save Error:", error);
            addToast("Failed to save image", "error");
        }
    };

    useEffect(() => {
        if (router.isReady) {
            if (id === 'BK-411375') {
                setItem(MOCK_VOUCHER_BK_411375);
            } else {
                const found = typeof id === 'string' ? getBookingById(id) : null;
                if (found) {
                    setItem({
                        ...found,
                        // Add missing fields if any
                        customerName: user?.name || 'Guest',
                        customerEmail: user?.email || 'guest@example.com',
                        paymentMethod: 'Bank Transfer',
                        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${found.id}`
                    });
                }
            }
            setIsLoading(false);
        }
    }, [id, router.isReady, getBookingById, user]);

    if (isLoading) return <Layout title="Loading..."><div className="p-8 text-center">Loading voucher details...</div></Layout>;

    if (!item) return (
        <Layout title="Not Found">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Voucher Not Found</h2>
                <p className="text-gray-500 mb-6">Could not find voucher details for ID: {id}</p>
                <Link href="/dashboard/client" className="text-emerald-600 font-bold hover:underline">Return to Dashboard</Link>
            </div>
        </Layout>
    );

    return (
        <Layout title={`Voucher #${item.id}`} hideFooter>
            <div className="max-w-4xl mx-auto pb-20 pt-28 px-4">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition">
                        <ArrowLeft className="w-5 h-5" /> {activeTab === 'invoice' ? 'Invoice' : 'E-Ticket'}
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => setIsShareModalOpen(true)} className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition shadow-sm" title="Share">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button onClick={handleDownloadPDF} className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition shadow-sm" title="Download PDF">
                            <Download className="w-5 h-5" />
                        </button>
                        <button onClick={handlePrint} className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition shadow-sm" title="Print">
                            <Printer className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 mb-6">
                    <button
                        onClick={() => setActiveTab('ticket')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'ticket' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Ticket className="w-4 h-4" /> E-Ticket
                    </button>
                    <button
                        onClick={() => setActiveTab('invoice')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'invoice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <FileText className="w-4 h-4" /> Invoice
                    </button>
                </div>

                {/* Content */}
                <div className="print:block" ref={componentRef}>
                    {activeTab === 'invoice' ? (
                        <InvoiceView item={item} />
                    ) : (
                        <TicketView item={item} onSaveImage={handleSaveImage} />
                    )}
                </div>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                title={item.productName}
                url={`https://borneotrip.com/vouchers/${item.id}`}
            />
        </Layout>
    );
}

function InvoiceView({ item }: { item: any }) {
    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
            {/* Status Stamp */}
            <div className="absolute top-0 right-0 p-8 md:p-12 pointer-events-none opacity-10">
                <div className="border-4 border-emerald-500 rounded-lg p-2 rotate-12">
                    <span className="text-3xl md:text-4xl font-black text-emerald-500 uppercase tracking-widest">PAID</span>
                </div>
            </div>

            {/* Header */}
            <div className="bg-slate-900 text-white p-8 md:p-10">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                    <div>
                        <h1 className="text-2xl font-black mb-2 flex items-center gap-2">
                            BorneoTrip<span className="text-emerald-400">.</span>
                        </h1>
                        <p className="opacity-70 text-xs md:text-sm leading-relaxed max-w-xs">
                            PT. Borneo Trip Indonesia<br />
                            Jl. Mulawarman No. 45, Samarinda<br />
                            Kalimantan Timur, Indonesia 75112
                        </p>
                    </div>
                    <div className="text-left md:text-right">
                        <h2 className="text-3xl font-light opacity-50 mb-1">INVOICE</h2>
                        <p className="font-mono font-bold text-lg">#{item.id}</p>
                        <p className="text-sm opacity-70 mt-1">
                            {new Date(item.bookingDate || item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                    <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Billed To</h3>
                        <p className="font-bold text-lg text-gray-900">{item.customerName}</p>
                        <p className="text-sm text-gray-500">{item.customerEmail}</p>
                    </div>
                    <div className="text-left md:text-right">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Method</h3>
                        <div className="inline-block bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-xs font-bold text-gray-700">
                            {item.paymentMethod}
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="text-left py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-1/2">Description</th>
                                <th className="text-center py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty</th>
                                <th className="text-right py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            <tr className="border-b border-gray-50">
                                <td className="py-5">
                                    <p className="font-bold text-gray-900 text-sm md:text-base mb-1">{item.productName}</p>
                                    <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                                </td>
                                <td className="py-5 text-center font-medium text-sm">{item.totalPax}x</td>
                                <td className="py-5 text-right font-bold text-gray-900 text-sm md:text-base">Rp {item.amount.toLocaleString('id-ID')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="w-full md:w-1/2 space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Subtotal</span>
                            <span className="font-medium text-gray-900 text-sm">Rp {item.amount.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="font-bold text-lg text-emerald-900">Total</span>
                            <span className="font-black text-xl text-emerald-600">Rp {item.amount.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-6 text-center text-xs text-gray-400 border-t border-gray-100">
                Authorized by Payment Gateway. This is a computer-generated invoice.
            </div>
        </div>
    );
}

function TicketView({ item, onSaveImage }: { item: any, onSaveImage: () => void }) {
    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* Left Side: Ticket Visuals */}
            <div className="w-full md:w-2/3 p-8 border-b md:border-b-0 md:border-r border-dashed border-gray-200 relative">
                {/* Decorative Circles for "Tear" effect */}
                <div className="absolute left-[-10px] bottom-[-10px] md:top-[-10px] md:bottom-auto w-5 h-5 bg-gray-50 rounded-full z-10 hidden md:block"></div>
                <div className="absolute right-[-10px] top-[-10px] md:bottom-[-10px] md:top-auto w-5 h-5 bg-gray-50 rounded-full z-10 hidden md:block"></div>

                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                            <ShieldCheck className="w-3 h-3" /> Confirmed
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">{item.productName}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-emerald-500 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Date</p>
                                <p className="font-bold text-slate-900">{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="text-xs text-gray-400">{new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Location</p>
                                <p className="font-bold text-slate-900 leading-tight">{item.location}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-emerald-500 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Duration</p>
                                <p className="font-bold text-slate-900">3 Days 2 Nights</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <UserIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Traveler</p>
                                <p className="font-bold text-slate-900 leading-tight">{item.customerName}</p>
                                <p className="text-xs text-gray-400">{item.totalPax} Pax</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-6">
                    <p className="text-xs text-gray-400 mb-2">Booking ID</p>
                    <p className="font-mono text-xl font-bold tracking-widest text-slate-900">{item.id}</p>
                </div>
            </div>

            {/* Right Side: QR Code */}
            <div className="w-full md:w-1/3 bg-slate-50 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                    <img src={item.qrCode} alt="QR Code" className="w-32 h-32 md:w-40 md:h-40 mix-blend-multiply" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Scan at entrance</p>
                <p className="text-emerald-600 font-bold text-sm">Valid Ticket</p>

                <button onClick={onSaveImage} className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition shadow-lg flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Save Image
                </button>
            </div>
        </div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )
}
