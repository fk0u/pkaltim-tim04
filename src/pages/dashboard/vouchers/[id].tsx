
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
import { ETicket } from '@/components/admin/ETicket';

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
        const fetchData = async () => {
            if (!router.isReady || !id) return;

            setIsLoading(true);
            try {
                // Fetch Booking
                const bookingRes = await fetch(`/api/bookings/${id}`);
                const booking = bookingRes.ok ? await bookingRes.json() : null;

                // Fetch User Addresses (for Billed To)
                const addressRes = await fetch('/api/user/addresses');
                const addresses = addressRes.ok ? await addressRes.json() : [];
                const defaultAddress = addresses.find((a: any) => a.isDefault) || addresses[0];

                if (booking) {
                    setItem({
                        ...booking,
                        customerName: booking.user?.name || user?.name || 'Guest',
                        customerEmail: booking.user?.email || user?.email || 'guest@example.com',
                        customerAddress: defaultAddress
                            ? `${defaultAddress.address}, ${defaultAddress.city} ${defaultAddress.postalCode}`
                            : 'No address provided',
                        paymentMethod: booking.paymentMethod || 'Bank Transfer',
                        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.id}`,
                        productName: booking.event?.title || booking.tourPackage?.title || booking.productName || 'Trip Package',
                        date: booking.date || booking.createdAt,
                        location: booking.event?.location || booking.tourPackage?.location || booking.location || 'Kalimantan Timur',
                        amount: booking.totalPrice || booking.amount || 0,
                        totalPax: booking.quantity || booking.totalPax || 1,
                        status: booking.status || 'Pending'
                    });
                } else {
                    // Fallback to Context
                    const found = typeof id === 'string' ? getBookingById(id) : null;
                    if (found) {
                        setItem({
                            ...found,
                            customerName: user?.name || 'Guest',
                            customerEmail: user?.email || 'guest@example.com',
                            customerAddress: defaultAddress
                                ? `${defaultAddress.address}, ${defaultAddress.city} ${defaultAddress.postalCode}`
                                : 'No address provided',
                            paymentMethod: found.paymentMethod || 'Bank Transfer', // Use found payment method or default
                            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${found.id}`,
                            productName: found.productName || 'Trip Package', // Ensure product name exists
                            amount: found.amount || 0,
                            totalPax: found.totalPax || 1,
                            status: found.status || 'Pending'
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, router.isReady, getBookingById, user]);

    if (isLoading) return <Layout title="Loading..."><div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-500 font-bold">Loading document...</p></div></div></Layout>;

    if (!item) return (
        <Layout title="Not Found">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Document Not Found</h2>
                <p className="text-gray-500 mb-6">Could not find booking details for ID: {id}</p>
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
                        item.status === 'Paid' || item.status === 'Completed' ? (
                            <div className="bg-slate-100 p-8 rounded-3xl">
                                <ETicket ref={componentRef} booking={item} />
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                                <div className="ml-auto mr-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                                    <Clock className="w-10 h-10 text-amber-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Verification in Progress</h2>
                                <p className="text-gray-500 max-w-md mx-auto mb-8">
                                    Your payment is currently being verified by our team. The E-Ticket will be available here once the verification is complete.
                                </p>
                                <button onClick={() => setActiveTab('invoice')} className="text-emerald-600 font-bold hover:underline">
                                    View Invoice Instead
                                </button>
                            </div>
                        )
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
    // Generate logical Invoice Number: INV/YYYY/MM/ID_LAST4
    const invoiceDate = new Date(item.createdAt || new Date());
    const invoiceNumber = `INV/${invoiceDate.getFullYear()}/${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}/${item.id.slice(-4).toUpperCase()}`;

    // Tax Calculation (assuming total includes 11% tax)
    const totalAmount = item.amount;
    const subtotal = Math.round(totalAmount / 1.11);
    const tax = totalAmount - subtotal;

    // Status Colors
    const statusColor = item.status === 'Paid' || item.status === 'Completed' ? 'emerald' : item.status === 'Cancelled' ? 'red' : 'orange';

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative print:shadow-none print:border print:border-gray-200">
            {/* Status Stamp */}
            <div className="absolute top-0 right-0 p-8 md:p-12 pointer-events-none opacity-20 z-0">
                <div className={`border-8 border-${statusColor}-500 rounded-xl p-4 rotate-12 mask-stamp`}>
                    <span className={`text-4xl md:text-6xl font-black text-${statusColor}-500 uppercase tracking-widest`}>{item.status}</span>
                </div>
            </div>

            {/* Header */}
            <div className="bg-slate-900 text-white p-8 md:p-12 relative z-10 print:bg-white print:text-black">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                    <div>
                        <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
                            BorneoTrip<span className="text-emerald-400">.</span>
                        </h1>
                        <p className="opacity-70 text-sm leading-relaxed max-w-xs">
                            PT. Borneo Trip Indonesia<br />
                            Jl. Mulawarman No. 45, Samarinda<br />
                            Kalimantan Timur, Indonesia 75112
                        </p>
                    </div>
                    <div className="text-left md:text-right">
                        <h2 className="text-4xl font-light opacity-50 mb-1 tracking-widest">INVOICE</h2>
                        <p className="font-mono font-bold text-xl">{invoiceNumber}</p>
                        <p className="text-sm opacity-70 mt-1">
                            Issued: {invoiceDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="p-8 md:p-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
                    <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Billed To</h3>
                        <p className="font-bold text-xl text-slate-900 mb-1">{item.customerName}</p>
                        <p className="text-sm text-gray-500 mb-1">{item.customerEmail}</p>
                        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{item.customerAddress}</p>
                    </div>
                    <div className="text-left md:text-right">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Method</h3>
                        <div className="inline-block bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-sm font-bold text-slate-800 capitalize">
                            {item.paymentMethod || 'Bank Transfer'}
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="text-left py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-1/2">Description</th>
                                <th className="text-center py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty</th>
                                <th className="text-right py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            <tr className="border-b border-gray-50 group hover:bg-gray-50 transition">
                                <td className="py-6">
                                    <p className="font-bold text-slate-900 text-lg mb-1">{item.productName}</p>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        Trip Date: {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </td>
                                <td className="py-6 text-center font-bold text-slate-900">{item.totalPax}</td>
                                <td className="py-6 text-right font-bold text-slate-900">Rp {item.amount.toLocaleString('id-ID')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="w-full md:w-5/12 space-y-4">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500">Subtotal</span>
                            <span className="font-bold text-slate-700">Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500">Tax (11% VAT)</span>
                            <span className="font-bold text-slate-700">Rp {tax.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between py-4">
                            <span className="font-black text-xl text-slate-900">Total Paid</span>
                            <span className="font-black text-2xl text-emerald-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-8 text-center border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Thank you for your business</p>
                <p className="text-[10px] text-gray-400 max-w-md mx-auto leading-relaxed">
                    Authorized by Payment Gateway. This is a computer-generated invoice and corresponds to the transaction ID #{item.id}. No signature required.
                </p>
            </div>
        </div>
    );
}


