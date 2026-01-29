import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if user has consented IN THIS SESSION
        const consent = sessionStorage.getItem('borneotrip_cookie_consent');
        if (!consent) {
            setShow(true);
        }
    }, []);

    const handleAccept = () => {
        sessionStorage.setItem('borneotrip_cookie_consent', 'true');
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'backOut' }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[200] max-w-md w-full"
                >
                    <div className="bg-white/90 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full shrink-0">
                                <Cookie className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-gray-900">Kami menggunakan Cookies</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Aplikasi ini memerlukan cookies untuk menyimpan sesi login Anda dengan aman.
                                    Dengan melanjutkan, Anda menyetujui penggunaan cookies wajib ini.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleAccept}
                            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg"
                        >
                            Saya Mengerti & Setuju
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
