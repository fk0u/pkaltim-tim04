import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Upload, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui';

interface PartnerOnboardingProps {
    onComplete: (data: any) => Promise<void>;
}

export function PartnerOnboarding({ onComplete }: PartnerOnboardingProps) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: 'Personal', // Personal, EO, Business
        description: '',
        address: '',
        website: '',
        ktpUrl: '',
        licenseUrl: '', // Optional for Personal
    });

    const steps = [
        { id: 1, title: 'Informasi Bisnis', icon: Building },
        { id: 2, title: 'Dokumen Legalitas', icon: Upload },
        { id: 3, title: 'Konfirmasi', icon: CheckCircle },
    ];

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (!formData.businessName || !formData.address || !formData.description) {
                addToast('Mohon lengkapi semua field wajib.', 'error');
                return false;
            }
        }
        if (currentStep === 2) {
            if (!formData.ktpUrl) {
                addToast('Mohon upload foto KTP.', 'error');
                return false;
            }
            if (formData.businessType !== 'Personal' && !formData.licenseUrl) {
                addToast('Untuk tipe bisnis perusahaan/EO, wajib upload NIB/Lisensi.', 'error');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await onComplete(formData);
        } catch (error) {
            // Error handling is done in parent
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-0 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>

                {steps.map((s) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                        <motion.div
                            initial={false}
                            animate={{
                                backgroundColor: step >= s.id ? '#10b981' : '#f3f4f6',
                                color: step >= s.id ? '#ffffff' : '#9ca3af',
                                scale: step === s.id ? 1.1 : 1
                            }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 transition-colors duration-300 ${step >= s.id ? 'border-emerald-100' : 'border-white'}`}
                        >
                            <s.icon className="w-5 h-5" />
                        </motion.div>
                        <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${step >= s.id ? 'text-emerald-700' : 'text-gray-400'}`}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 overflow-hidden border border-gray-100">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-8 sm:p-12"
                    >
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">Profil Bisnis Anda</h2>
                                    <p className="text-gray-500">Ceritakan sedikit tentang layanan travel yang Anda tawarkan.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-full">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nama Bisnis / Usaha</label>
                                        <input
                                            type="text"
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none"
                                            placeholder="Contoh: Borneo Adventure Tour"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tipe Kemitraan</label>
                                        <select
                                            value={formData.businessType}
                                            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none"
                                        >
                                            <option value="Personal">Personal Guide / Local Host</option>
                                            <option value="EO">Event Organizer</option>
                                            <option value="Business">Tour & Travel Agency</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Website / Social Media (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Bisnis</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none resize-none"
                                            placeholder="Jelaskan spesialisasi dan pengalaman Anda..."
                                        />
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none resize-none"
                                            placeholder="Alamat operasional..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">Verifikasi Legalitas</h2>
                                    <p className="text-gray-500">Upload dokumen pendukung untuk verifikasi keamanan.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 hover:border-emerald-400 transition-colors">
                                        <label className="block text-sm font-bold text-gray-900 mb-1">Foto KTP / Identitas <span className="text-red-500">*</span></label>
                                        <p className="text-xs text-gray-500 mb-4">Wajib untuk semua partner.</p>
                                        <ImageUpload
                                            value={formData.ktpUrl}
                                            onChange={(url) => setFormData({ ...formData, ktpUrl: url })}
                                        />
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 hover:border-emerald-400 transition-colors">
                                        <label className="block text-sm font-bold text-gray-900 mb-1">Dokumen Pendukung Bisnis</label>
                                        <p className="text-xs text-gray-500 mb-4">Wajib untuk EO/Agency (NIB/SIUP/NPWP).</p>
                                        <ImageUpload
                                            value={formData.licenseUrl}
                                            onChange={(url) => setFormData({ ...formData, licenseUrl: url })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm">
                                    <div className="mt-0.5"><CheckCircle className="w-5 h-5" /></div>
                                    <p>Data Anda aman bersama kami. Dokumen ini hanya digunakan untuk proses verifikasi internal tim BorneoTrip dan tidak akan dipublikasikan.</p>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-8">
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Building className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-4">Siap Mendaftar?</h2>
                                <p className="text-gray-600 max-w-md mx-auto mb-8">
                                    Dengan menekan tombol kirim, Anda menyetujui <span className="text-emerald-600 font-bold cursor-pointer">Syarat & Ketentuan Mitra</span> BorneoTrip. Tim kami akan meninjau pengajuan Anda dalam 1x24 jam.
                                </p>

                                <div className="bg-gray-50 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-3 mb-8">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Nama Bisnis</span>
                                        <span className="font-bold text-gray-900">{formData.businessName}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Tipe</span>
                                        <span className="font-bold text-gray-900">{formData.businessType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status</span>
                                        <span className="font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full text-xs uppercase">Menunggu Verifikasi</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Footer Controls */}
                <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-100">
                    <button
                        onClick={handleBack}
                        disabled={step === 1 || isLoading}
                        className={`px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-0 ${step === 1 ? 'invisible' : ''}`}
                    >
                        Kembali
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-transform active:scale-95 flex items-center gap-2"
                        >
                            Lanjut <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-emerald-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kirim Pengajuan'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
