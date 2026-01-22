import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
}

export default function ImageUpload({ value, onChange, label = "Upload Image", className = "" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size too large (max 5MB)");
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onChange(data.url);
        } catch (err) {
            console.error(err);
            setError("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = () => {
        onChange('');
        setError(null);
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-gray-700">{label}</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setMode('upload')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition ${mode === 'upload' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition ${mode === 'url' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        URL
                    </button>
                </div>
            </div>

            {mode === 'url' ? (
                <div className="space-y-3">
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={value}
                            placeholder="https://example.com/image.jpg"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </div>
                    {value && (
                        <div className="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-video w-full bg-gray-100">
                            <Image
                                src={value}
                                alt="Preview"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    )}
                </div>
            ) : (
                !value ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-emerald-100 transition">
                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600 group-hover:text-emerald-700 text-center">
                            {isUploading ? "Uploading..." : "Click to upload image"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Max 5MB (JPG, PNG, WEBP)</p>
                        {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
                    </div>
                ) : (
                    <div className="relative group rounded-2xl overflow-hidden border border-gray-200">
                        <div className="aspect-video w-full relative bg-gray-100">
                            <Image
                                src={value}
                                alt="Uploaded image"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-500 shadow-sm transition opacity-0 group-hover:opacity-100"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
