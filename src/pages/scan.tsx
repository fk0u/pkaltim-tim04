
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Camera, X, Zap, Image as ImageIcon, QrCode } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui';

export default function ScanPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [isScanning, setIsScanning] = useState(true);
    const [scannedData, setScannedData] = useState<string | null>(null);

    // Simulate scanning process
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isScanning) {
            timeout = setTimeout(() => {
                // Randomly trigger "success" or just keep scanning
                // For demo, we'll just let it scan indefinitely until user clicks "Simulate Scan" or similar
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [isScanning]);

    const handleSimulateScan = () => {
        setIsScanning(false);
        setScannedData("ORD-2024-883920");
        addToast("QR Code detected!", "success");
        // Simulate redirect to booking or detail
        setTimeout(() => {
            router.push('/dashboard/client?tab=bookings');
        }, 1500);
    };

    return (
        <Layout title="Scan QR - BorneoTrip" hideFooter>
            <div className="relative h-[calc(100vh-80px)] bg-black overflow-hidden flex flex-col">
                {/* Camera Feed Mock */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2787&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-60"
                        alt="Camera Feed"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                </div>

                {/* Header Controls */}
                <div className="relative z-20 flex justify-between items-center p-6 text-white">
                    <button onClick={() => router.back()} className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                        <X className="w-6 h-6" />
                    </button>
                    <div className="text-sm font-bold tracking-widest uppercase bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">Scan QR Code</div>
                    <button className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                        <Zap className="w-6 h-6 text-yellow-400" />
                    </button>
                </div>

                {/* Scanner Interface */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
                    <div className="relative w-72 h-72 border-2 border-white/30 rounded-3xl overflow-hidden">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl"></div>

                        {/* Scanning Animation */}
                        {isScanning && (
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(52,211,153,0.8)]"
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        )}

                        {/* Scanned Data Overlay */}
                        {scannedData && (
                            <div className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center text-white p-4 text-center">
                                <CheckCircleIcon className="w-16 h-16 mb-2" />
                                <p className="font-bold text-lg">Scanned Successfully!</p>
                                <p className="font-mono text-sm opacity-80 mt-1">{scannedData}</p>
                            </div>
                        )}
                    </div>
                    <p className="text-white/70 text-sm mt-8 text-center max-w-xs font-medium">Align the QR code within the frame to scan automatically.</p>
                </div>

                {/* Bottom Controls */}
                <div className="relative z-20 p-8 pb-12 flex justify-center items-center gap-8">
                    <button className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition">
                        <ImageIcon className="w-6 h-6" />
                    </button>

                    {/* Trigger Button (Simulate) */}
                    <button
                        onClick={handleSimulateScan}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition bg-white/10 backdrop-blur-sm"
                    >
                        <div className="w-16 h-16 bg-white rounded-full"></div>
                    </button>

                    <button className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition">
                        <QrCode className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </Layout>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}
