import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function RegisterRedirect() {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            router.replace({
                pathname: '/login',
                query: { ...router.query, mode: 'register' }
            });
        }
    }, [router.isReady, router.query]);

    return (
        <>
            <Head>
                <title>Redirecting... - BorneoTrip</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        </>
    );
}
