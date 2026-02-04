import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PartnerLayout from '@/components/layouts/PartnerLayout';
import { PartnerOnboarding } from '@/components/features/partner/PartnerOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';

export default function OnboardingPage() {
    const { user, updateUserProfile } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Check if already has profile
        const checkProfile = async () => {
            try {
                const res = await fetch(`/api/partner/profile?userId=${user.id}`);
                const data = await res.json();
                if (data && data.id) {
                    // Already has profile, redirect to dashboard
                    router.push('/dashboard/partner');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsChecking(false);
            }
        };

        checkProfile();
    }, [user, router]);

    const handleOnboardingComplete = async (formData: any) => {
        if (!user) return;

        try {
            const res = await fetch('/api/partner/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId: user.id }),
            });

            if (!res.ok) throw new Error('Failed to submit profile');

            addToast('Pengajuan berhasil dikirim!', 'success');

            // Redirect to dashboard
            router.push('/dashboard/partner');
        } catch (error) {
            console.error(error);
            addToast('Gagal mengirim data. Silakan coba lagi.', 'error');
        }
    };

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <PartnerLayout title="Partner Onboarding">
            <Head>
                <title>Onboarding Mitra - BorneoTrip</title>
            </Head>

            <div className="max-w-5xl mx-auto py-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-gray-900 mb-4">Selamat Datang di BorneoPartner! 🚀</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Lengkapi profil bisnis Anda untuk mulai mempromosikan Event dan Paket Wisata kepada ribuan petualang.
                    </p>
                </div>

                <PartnerOnboarding onComplete={handleOnboardingComplete} />
            </div>
        </PartnerLayout>
    );
}
