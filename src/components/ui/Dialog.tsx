import Modal from './Modal';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    type?: 'danger' | 'info' | 'success';
}

export default function Dialog({
    isOpen,
    onClose,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    type = 'info'
}: DialogProps) {

    const confirmColors = {
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-200',
        info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200',
        success: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-200'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
            <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition"
                >
                    {cancelText}
                </button>
                <button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className={`px-5 py-2.5 rounded-xl text-white font-bold shadow-lg transition transform hover:-translate-y-0.5 focus:ring-4 ${confirmColors[type]}`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}
