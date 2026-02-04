import { RotateCw, AlertTriangle } from 'lucide-react';

interface DatabaseErrorProps {
    onRetry: () => void;
}

export default function DatabaseError({ onRetry }: DatabaseErrorProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-red-100">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Connection Failed
                    <br />
                    <span className="text-lg text-gray-500 font-medium">Koneksi Gagal</span>
                </h1>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    We cannot connect to the database. Please ensure the MySQL service is running.
                    <br />
                    <span className="text-sm text-gray-400 mt-2 block">
                        Kami tidak dapat terhubung ke database. Mohon pastikan layanan MySQL sedang berjalan.
                    </span>
                </p>

                <button
                    onClick={onRetry}
                    className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 group shadow-lg shadow-emerald-200"
                >
                    <RotateCw className="w-5 h-5 group-hover:rotate-180 transition duration-700" />
                    Try Again / Coba Lagi
                </button>
            </div>
        </div>
    );
}
