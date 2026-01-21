import Layout from '@/components/Layout';
import { Scale, FileCheck, CreditCard, AlertTriangle, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Terms() {
    const { t } = useLanguage();

    return (
        <Layout title={`${t.terms.title} - BorneoTrip`}>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Header */}
                <div className="bg-emerald-900 text-white pt-32 pb-20 rounded-b-[3rem] mb-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/50"></div>
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <div className="inline-flex items-center justify-center p-3 glass-dark rounded-full mb-6 ring-1 ring-white/10">
                            <Scale className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.terms.title}</h1>
                        <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto">
                            {t.terms.subtitle}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6">
                    <div className="glass-panel bg-white/60 rounded-3xl shadow-xl p-8 md:p-12 space-y-12 backdrop-blur-md border border-white/50">

                        {/* Section 1 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                    <FileCheck className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.terms.section1.title}</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {t.terms.section1.desc}
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.terms.section2.title}</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {t.terms.section2.desc}
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-blue-500">
                                    <li>{t.terms.section2.list1}</li>
                                    <li>{t.terms.section2.list2}</li>
                                    <li>{t.terms.section2.list3}</li>
                                    <li>{t.terms.section2.list4}</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-sm">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.terms.section3.title}</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {t.terms.section3.desc}
                                </p>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="flex gap-6">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shadow-sm">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.terms.section4.title}</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {t.terms.section4.desc}
                                </p>
                            </div>
                        </section>

                        <div className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 italic">
                                {t.terms.effectiveDate}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
