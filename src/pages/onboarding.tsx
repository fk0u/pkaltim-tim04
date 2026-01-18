import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Check, ArrowRight, User, Users, Heart, Camera, Coffee, Compass, Map, DollarSign, Loader2 } from 'lucide-react';

const INTERESTS = [
  { id: 'nature', label: 'Alam & Ekowisata', icon: Map, color: 'text-emerald-500' },
  { id: 'culture', label: 'Budaya & Sejarah', icon: Compass, color: 'text-amber-600' },
  { id: 'culinary', label: 'Kuliner Lokal', icon: Coffee, color: 'text-orange-500' },
  { id: 'adventure', label: 'Petualangan', icon: Camera, color: 'text-blue-500' },
  { id: 'wellness', label: 'Wellness & Healing', icon: Heart, color: 'text-rose-500' },
];

const TRAVEL_STYLES = [
  { id: 'solo', label: 'Solo Traveler', icon: User, desc: 'Bebas eksplorasi sendiri' },
  { id: 'couple', label: 'Pasangan', icon: Heart, desc: 'Romantis & santai' },
  { id: 'family', label: 'Keluarga', icon: Users, desc: 'Ramah anak & lansia' },
  { id: 'group', label: 'Rombongan', icon: Users, desc: 'Seru-seruan bareng teman' },
];

const BUDGETS = [
  { id: 'budget', label: 'Hemat', range: '< Rp 2 Jt', icon: DollarSign },
  { id: 'standard', label: 'Menengah', range: 'Rp 2 - 5 Jt', icon: DollarSign },
  { id: 'luxury', label: 'Sultan', range: '> Rp 5 Jt', icon: DollarSign },
];

export default function Onboarding() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<{
    interests: string[];
    travelStyle: string;
    budget: string;
  }>({
    interests: [],
    travelStyle: '',
    budget: '',
  });

  const handleInterestToggle = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          preferences
        }),
      });

      if (res.ok) {
        updateUserProfile({ onboardingCompleted: true, ...preferences as any }); // Update local state (ignoring type strictness for prototype)
        // Fake AI processing delay
        setTimeout(() => {
          router.push('/dashboard/client');
        }, 1500);
      } else {
        alert('Gagal menyimpan preferensi. Silakan coba lagi.');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (!user) {
     if (typeof window !== 'undefined') router.push('/login');
     return null;
  }

  return (
    <Layout transparentNavbar={false}>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-20 pb-12 px-4">
        
        {/* Progress Bar */}
        <div className="w-full max-w-xl mb-8">
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <span className={step >= 1 ? 'text-emerald-600' : ''}>Minat</span>
                <span className={step >= 2 ? 'text-emerald-600' : ''}>Gaya</span>
                <span className={step >= 3 ? 'text-emerald-600' : ''}>Budget</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>
        </div>

        <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl p-6 md:p-10 overflow-hidden relative min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Apa minat utamamu?</h2>
                        <p className="text-slate-500 mb-6">Pilih satu atau lebih kategori yang kamu suka.</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {INTERESTS.map(({ id, label, icon: Icon, color }) => (
                                <button
                                    key={id}
                                    onClick={() => handleInterestToggle(id)}
                                    className={`relative p-4 rounded-xl border-2 text-left transition-all group hover:shadow-md
                                        ${preferences.interests.includes(id) 
                                            ? 'border-emerald-500 bg-emerald-50' 
                                            : 'border-slate-100 bg-white hover:border-emerald-200'
                                        }`}
                                >
                                    <Icon className={`w-8 h-8 mb-3 ${color}`} />
                                    <span className="block font-semibold text-slate-700">{label}</span>
                                    
                                    {preferences.interests.includes(id) && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Siapa teman perjalananmu?</h2>
                        <p className="text-slate-500 mb-6">Kami akan sesuaikan itinerary dengan gaya travel kalian.</p>
                        
                        <div className="space-y-3">
                            {TRAVEL_STYLES.map(({ id, label, icon: Icon, desc }) => (
                                <button
                                    key={id}
                                    onClick={() => setPreferences(p => ({ ...p, travelStyle: id }))}
                                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:shadow-md
                                        ${preferences.travelStyle === id 
                                            ? 'border-emerald-500 bg-emerald-50' 
                                            : 'border-slate-100 bg-white hover:border-emerald-200'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                                        ${preferences.travelStyle === id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-800">{label}</h3>
                                        <p className="text-sm text-slate-500">{desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Berapa budget liburanmu?</h2>
                        <p className="text-slate-500 mb-6">Estimasi per orang untuk perjalanan 3 hari.</p>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {BUDGETS.map(({ id, label, range, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setPreferences(p => ({ ...p, budget: id }))}
                                    className={`p-6 rounded-2xl border-2 text-center transition-all hover:shadow-lg
                                        ${preferences.budget === id 
                                            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 ring-offset-2' 
                                            : 'border-slate-100 bg-white hover:border-emerald-200'
                                        }`}
                                >
                                    <span className="block text-2xl font-black text-slate-800 mb-1">{range}</span>
                                    <span className="text-slate-500 font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100">
                {step > 1 ? (
                    <button 
                        onClick={handleBack}
                        className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
                        disabled={loading}
                    >
                        Kembali
                    </button>
                ) : (
                    <div></div> // Spacer
                )}

                <button
                    onClick={step < 3 ? handleNext : handleSubmit}
                    disabled={
                        loading || 
                        (step === 1 && preferences.interests.length === 0) ||
                        (step === 2 && !preferences.travelStyle) ||
                        (step === 3 && !preferences.budget)
                    }
                    className={`
                        flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-200 transition-all
                        ${loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95'}
                    `}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" /> Menyusun Personalisasi...
                        </>
                    ) : (
                        <>
                            {step === 3 ? 'Selesai' : 'Lanjut'} <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </Layout>
  );
}
