import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SettingsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
    }, [isAuthenticated, router]);

    if (!user) return null;

    return (
        <AdminLayout title="System Settings">
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-400">Placeholder for Settings Module</h2>
            </div>
        </AdminLayout>
    );
}
