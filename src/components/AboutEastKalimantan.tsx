
import React from 'react';
import InteractiveMap from './InteractiveMap';
import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf, Map, Mountain, Sunset } from 'lucide-react';

const AboutEastKalimantan = () => {
    const { t } = useLanguage();

    const facts = [
        {
            icon: <Leaf className="w-6 h-6 text-emerald-500" />,
            title: t.about.why.reason1Title,
            desc: t.about.why.reason1Desc
        },
        {
            icon: <Sunset className="w-6 h-6 text-orange-500" />,
            title: t.about.why.reason2Title,
            desc: t.about.why.reason2Desc
        },
        {
            icon: <Mountain className="w-6 h-6 text-blue-500" />,
            title: "Karst Sangkulirang",
            desc: "One of the largest karst clusters in the world, holding prehistoric rock art dating back 40,000 years."
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="explore-region">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 skew-x-12 translate-x-32 z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] opacity-60"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                    <div>
                        <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase block mb-4">{t.region.badge}</span>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                            {t.region.title} <br />
                            <span className="relative inline-block">
                                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">{t.region.titleHighlight}</span>
                                <span className="absolute bottom-2 left-0 w-full h-4 bg-emerald-100/50 -rotate-2 -z-0"></span>
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8 font-light">
                            {t.region.subtitle}
                        </p>

                        <div className="space-y-6">
                            {facts.map((fact, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition duration-300 border border-transparent hover:border-gray-100">
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                                        {fact.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg mb-1">{fact.title}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">{fact.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Map Container */}
                        <div className="relative z-10">
                            <InteractiveMap />
                        </div>

                        {/* Floating Stats Card behind map */}
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-900 rounded-[2rem] p-6 text-white hidden lg:flex flex-col justify-between z-20 shadow-2xl">
                            <Map className="w-8 h-8 opacity-50" />
                            <div>
                                <div className="text-4xl font-black">129k</div>
                                <div className="text-xs uppercase tracking-widest opacity-70">Km² Total Area</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutEastKalimantan;
