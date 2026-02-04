import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Info, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    variant?: 'danger' | 'info' | 'success';
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
}

export default function AlertDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    variant = 'danger',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isLoading = false,
}: AlertDialogProps) {

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const variants = {
        danger: {
            icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
            bgIcon: 'bg-red-100',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        },
        info: {
            icon: <Info className="w-6 h-6 text-blue-600" />,
            bgIcon: 'bg-blue-100',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        },
        success: {
            icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
            bgIcon: 'bg-emerald-100',
            button: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
        },
    }[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isLoading ? onClose : undefined}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-white/20"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-2xl shrink-0 ${variants.bgIcon}`}>
                                        {variants.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="flex-1 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition border border-gray-200 disabled:opacity-50"
                                    >
                                        {cancelLabel}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        className={`flex-1 py-2.5 px-4 text-white font-bold rounded-xl transition shadow-lg ${variants.button} disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2`}
                                    >
                                        {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                        {confirmLabel}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
