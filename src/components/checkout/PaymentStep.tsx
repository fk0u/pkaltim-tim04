
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Building2, QrCode, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface PaymentStepProps {
    pkgImage: string;
    pkgName: string;
    date: string;
    location: string;
    adultCount: number;
    childCount: number;
    savedMethods: any[];
    selectedBank: string;
    setSelectedBank: (bank: string) => void;
    setStep: (step: number) => void;
    handlePayment: () => void;
    t: any;
    totalPrice: number;
}

export default function PaymentStep({
    pkgImage,
    pkgName,
    date,
    location,
    adultCount,
    childCount,
    savedMethods,
    selectedBank,
    setSelectedBank,
    setStep,
    handlePayment,
    t,
    totalPrice
}: PaymentStepProps) {

    const paymentMethods = [
        {
            id: 'bca',
            name: 'BCA Virtual Account',
            icon: <Building2 className="w-6 h-6" />,
            provider: 'Bank Transfer'
        },
        {
            id: 'mandiri',
            name: 'Mandiri Virtual Account',
            icon: <Building2 className="w-6 h-6" />,
            provider: 'Bank Transfer'
        },
        {
            id: 'gopay',
            name: 'GoPay',
            icon: <Wallet className="w-6 h-6" />,
            provider: 'E-Wallet'
        },
        {
            id: 'qris',
            name: 'QRIS',
            icon: <QrCode className="w-6 h-6" />,
            provider: 'Instant Payment'
        }
    ];

    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CreditCard className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{t?.checkout?.paymentMethod || "Payment Method"}</h2>
                    <p className="text-sm text-gray-500">{t?.checkout?.secureTransaction || "Secure transaction guaranteed"}</p>
                </div>
            </div>

            {/* Total Amount Banner */}
            <div className="bg-emerald-900 rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
                <p className="text-emerald-200 text-sm mb-1">{t?.checkout?.totalPayment || "Total Payment"}</p>
                <h3 className="text-3xl font-black">Rp {totalPrice.toLocaleString('id-ID')}</h3>
                <div className="flex items-center gap-2 mt-4 text-emerald-200 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t?.checkout?.securePayment || "100% Secure Payment"}</span>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-gray-400" />
                    {t?.checkout?.choosePayment || "Choose Payment Method"}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            onClick={() => setSelectedBank(method.id)}
                            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex items-center gap-4 ${selectedBank === method.id
                                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100'
                                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedBank === method.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {method.icon}
                            </div>

                            <div className="flex-1">
                                <h4 className={`font-bold transition-colors ${selectedBank === method.id ? 'text-emerald-900' : 'text-gray-900'}`}>
                                    {method.name}
                                </h4>
                                <p className="text-xs text-gray-500">{method.provider}</p>
                            </div>

                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedBank === method.id ? 'border-emerald-500 bg-emerald-500' : 'border-gray-200'
                                }`}>
                                {selectedBank === method.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={handlePayment}
                    className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-3 shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.01]"
                >
                    {t?.checkout?.payNow || "Pay Now"} <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
