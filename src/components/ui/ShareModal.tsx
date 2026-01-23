
import React from 'react';
import Modal from './Modal';
import { MessageSquare, Share2, FileText } from 'lucide-react';
import { useToast } from './Toast';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    url?: string;
}

export default function ShareModal({ isOpen, onClose, title = "Share this Trip", url }: ShareModalProps) {
    const { addToast } = useToast();
    // Use window.location as default if available, otherwise empty string (SSR safety)
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    const handleCopy = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl);
        addToast('Link copied to clipboard', 'success');
    };

    const handleShare = (platform: string) => {
        addToast(`Shared to ${platform}`, 'success');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                <p className="text-gray-500 text-sm text-center">Invite your friends to join this amazing trip!</p>

                <div className="grid grid-cols-4 gap-4">
                    {[
                        { name: 'WhatsApp', color: 'bg-green-500', icon: MessageSquare },
                        { name: 'Twitter', color: 'bg-sky-500', icon: Share2 },
                        { name: 'Facebook', color: 'bg-blue-600', icon: Share2 },
                        { name: 'Copy', color: 'bg-gray-600', icon: FileText, action: handleCopy },
                    ].map((platform) => (
                        <button
                            key={platform.name}
                            onClick={(e) => {
                                e.stopPropagation();
                                platform.action ? platform.action() : handleShare(platform.name);
                            }}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-14 h-14 ${platform.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-110 group-active:scale-95`}>
                                <platform.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-gray-600">{platform.name}</span>
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <input type="text" value={shareUrl} readOnly className="w-full bg-gray-50 border-gray-200 rounded-xl pl-4 pr-24 py-3 text-sm font-medium text-gray-600" />
                    <button onClick={handleCopy} className="absolute right-2 top-2 bottom-2 bg-white border border-gray-200 rounded-lg px-3 text-xs font-bold text-gray-700 hover:bg-gray-50">
                        Copy
                    </button>
                </div>
            </div>
        </Modal>
    );
}
