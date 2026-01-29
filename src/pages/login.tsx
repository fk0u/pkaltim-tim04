import Image from 'next/image';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Shield, Briefcase, Mail, Info, Check, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
    const { login, loginSocial } = useAuth();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'client' | 'staff'>('client');
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<'login' | 'forgot_password' | 'social_auth'>('login');
    const [socialProvider, setSocialProvider] = useState<'google' | 'facebook' | null>(null);
    const [socialLoading, setSocialLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Forgot Password State
    const [resetEmail, setResetEmail] = useState('');
    const [isResetSent, setIsResetSent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = await login(email, password);
        if (!success) {
            alert('Login failed. Please check your credentials.');
        }
        setIsLoading(false);
    };

    const handleSocialLogin = (provider: 'google' | 'facebook') => {
        setSocialProvider(provider);
        setView('social_auth');
        setSocialLoading(true);
        setTimeout(() => {
            setSocialLoading(false);
        }, 1000);
    };

    const confirmSocialLogin = () => {
        setIsLoading(true);
        if (socialProvider) {
            loginSocial(socialProvider);
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate password reset API call
        setTimeout(() => {
            setIsResetSent(true);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <>
            <Head>
                <title>{`${view === 'login' ? t.auth.loginTitle : t.auth.forgotPasswordTitle} - BorneoTrip`}</title>
                <meta name="description" content="Akses akun BorneoTrip Anda." />
            </Head>

            <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
                {/* Back Button */}
                <div className="absolute top-6 left-6 z-20">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-all group px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">{t.auth.back}</span>
                    </Link>
                </div>

                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-950/90 via-black/60 to-emerald-900/90 backdrop-blur-[2px]"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
                >
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block group">
                            <h1 className="text-5xl font-black text-white tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-300">
                                BorneoTrip<span className="text-emerald-400">.</span>
                            </h1>
                        </Link>
                        <p className="text-emerald-100/80 text-lg font-medium">{t.auth.subtitle}</p>
                    </div>

                    <div className="glass-panel py-10 px-8 rounded-[2.5rem] relative overflow-hidden">
                        {/* Decorative Top Line */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>

                        <AnimatePresence mode="wait">
                            {view === 'login' ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Role Switcher */}
                                    <div className="flex p-1.5 bg-gray-100/80 rounded-2xl mb-8 relative">
                                        <motion.div
                                            className="absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-sm z-0"
                                            initial={false}
                                            animate={{
                                                left: activeTab === 'client' ? '6px' : '50%',
                                                width: 'calc(50% - 6px)'
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                        <button
                                            onClick={() => setActiveTab('client')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${activeTab === 'client' ? 'text-emerald-900' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <User className="w-4 h-4" /> {t.auth.traveler}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('staff')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${activeTab === 'staff' ? 'text-emerald-900' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <Briefcase className="w-4 h-4" /> {t.auth.staff}
                                        </button>
                                    </div>

                                    <form className="space-y-6" onSubmit={handleLogin}>
                                        {/* Demo Credentials Hint */}
                                        {/* Demo Credentials Hint Removed */}

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t.auth.emailLabel}</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                    </div>
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-gray-50 focus:bg-white font-medium"
                                                        placeholder={activeTab === 'staff' ? 'admin@borneotrip.id' : t.auth.emailPlaceholder}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t.auth.passwordLabel}</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                    </div>
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        required
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-gray-50 focus:bg-white font-medium"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {activeTab === 'client' && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRememberMe(!rememberMe)}
                                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${rememberMe ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                                        role="switch"
                                                        aria-checked={rememberMe}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${rememberMe ? 'translate-x-5' : 'translate-x-0'}`}
                                                        />
                                                    </button>
                                                    <span className="ml-3 text-sm font-medium text-gray-700 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>{t.auth.rememberMe}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => setView('forgot_password')}
                                                        className="font-bold text-emerald-600 hover:text-emerald-500 hover:underline"
                                                    >
                                                        {t.auth.forgotPasswordLink}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-emerald-500/30 text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        {activeTab === 'staff' ? t.auth.dashboardBtn : t.auth.loginBtn} <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Social Login Divider */}
                                        {activeTab === 'client' && (
                                            <div className="mt-8">
                                                <div className="relative">
                                                    <div className="absolute inset-0 flex items-center">
                                                        <div className="w-full border-t border-gray-200"></div>
                                                    </div>
                                                    <div className="relative flex justify-center text-sm">
                                                        <span className="px-4 bg-white text-gray-400 font-medium">{t.auth.orLoginWith}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 grid grid-cols-2 gap-4">
                                                    <button type="button" onClick={() => handleSocialLogin('google')} className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                                        Google
                                                    </button>
                                                    <button type="button" onClick={() => handleSocialLogin('facebook')} className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-[#1877F2] text-sm font-bold text-white hover:bg-[#166fe5] transition-all">
                                                        <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                        Facebook
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </motion.div>
                            ) : view === 'social_auth' ? (
                                <motion.div
                                    key="social_auth"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {socialLoading ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="w-10 h-10 border-3 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4" />
                                            <p className="text-gray-500 font-medium animate-pulse">{t.auth.connecting} {socialProvider === 'google' ? 'Google' : 'Facebook'}...</p>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xl">
                                            {/* Mock Provider Header */}
                                            <div className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between ${socialProvider === 'facebook' ? 'bg-[#1877F2] text-white' : 'bg-white text-gray-800'}`}>
                                                {socialProvider === 'google' ? (
                                                    <div className="flex items-center gap-2">
                                                        <svg className="h-6 w-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                                        <span className="font-bold text-lg">Google</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                        <span className="font-bold text-lg">Facebook</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6">
                                                <p className="text-gray-600 mb-6 font-medium">
                                                    {socialProvider === 'google'
                                                        ? t.auth.selectAccount
                                                        : `${t.auth.continueAs} Dian? BorneoTrip akan menerima profil publik dan email Anda.`}
                                                </p>

                                                {/* Mock User Item */}
                                                <div onClick={confirmSocialLogin} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer border border-gray-200 transition-colors mb-4 group ring-2 ring-transparent hover:ring-emerald-500/20">
                                                    <div className="relative">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                                                            <span className="font-bold text-emerald-600">DS</span>
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                            {socialProvider === 'google' ? (
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                                            ) : (
                                                                <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">Dian Sastro</p>
                                                        <p className="text-xs text-gray-500">dian.sastro@example.com</p>
                                                    </div>
                                                    {isLoading && <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
                                                </div>

                                                <div className="flex items-center justify-between gap-3 mt-8">
                                                    <button
                                                        onClick={() => setView('login')}
                                                        className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                                                    >
                                                        {t.auth.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="forgot_password"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <button
                                        onClick={() => setView('login')}
                                        className="flex items-center text-sm font-bold text-gray-500 hover:text-emerald-600 mb-6 transition-colors group"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                        {t.auth.backToLogin}
                                    </button>

                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Shield className="w-8 h-8 text-emerald-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">{t.auth.resetTitle}</h2>
                                        <p className="text-gray-500 mt-2 text-sm">{t.auth.resetDesc}</p>
                                    </div>

                                    {!isResetSent ? (
                                        <form onSubmit={handleResetPassword} className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t.auth.emailLabel}</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={resetEmail}
                                                        onChange={(e) => setResetEmail(e.target.value)}
                                                        className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-gray-50 focus:bg-white font-medium"
                                                        placeholder="name@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-emerald-500/30 text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        {t.auth.sendResetBtn} <Send className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center bg-green-50 border border-green-100 rounded-2xl p-6"
                                        >
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Check className="w-6 h-6 text-green-600" />
                                            </div>
                                            <h3 className="font-bold text-green-800 text-lg mb-2">{t.auth.emailSentTitle}</h3>
                                            <p className="text-green-700 text-sm mb-4">
                                                {t.auth.emailSentDesc} <span className="font-bold">{resetEmail}</span> {t.auth.emailSentInstruction}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setIsResetSent(false);
                                                    setResetEmail('');
                                                    setView('login');
                                                }}
                                                className="text-green-700 font-bold text-sm hover:underline"
                                            >
                                                {t.auth.backToLogin}
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 text-center relative z-10">
                        {view === 'login' && (
                            <p className="text-white/80 text-sm font-medium">
                                {t.auth.noAccount}{' '}
                                <Link href="/register" className="font-bold text-emerald-300 hover:text-emerald-200 underline decoration-2 underline-offset-4">
                                    {t.auth.registerLink}
                                </Link>
                            </p>
                        )}
                        <p className="mt-4 text-xs text-white/40">
                            &copy; 2026 BorneoTrip. Sustainable Tourism for East Kalimantan.
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
