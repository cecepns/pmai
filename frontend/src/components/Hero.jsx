import React from "react";
import { ArrowRight, Award } from "lucide-react";
import asesorImg from "../assets/asesor.png";

export default function Hero({ content }) {
  const title = content?.hero_title || "Menuju Indonesia Emas dengan Asesor Kompeten";
  const subtitle = content?.hero_subtitle || "Perkumpulan Master Asesor Indonesia (PMAI) bersinergi secara profesional mengembangkan kemampuan asesor untuk mendukung percepatan program Sistem Sertifikasi Nasional.";

  const renderTitle = (text) => {
    if (text.includes("Asesor Kompeten")) {
      const parts = text.split("Asesor Kompeten");
      return (
        <>
          {parts[0]}
          <span className="text-pmai-blue">Asesor Kompeten</span>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <section className="relative pt-28 pb-24 md:pt-48 md:pb-36 bg-gradient-to-b from-sky-50/60 via-white to-white text-slate-900 overflow-hidden animate-fade-in">

      {/* Subtle background abstract graphics */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-100/50 rounded-full filter blur-[120px] animate-pulse-subtle"></div>
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-sky-50 rounded-full filter blur-[80px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">

          {/* Left Content Column */}
          <div className="md:col-span-7 lg:col-span-6 space-y-6 md:space-y-8 animate-fade-in-up text-center md:text-left flex flex-col items-center md:items-start">

            {/* Pill Badge matching sample design */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-50 text-pmai-blue rounded-full border border-sky-100/80 text-xs font-bold tracking-wider uppercase">
              <Award size={14} className="text-pmai-blue" />
              <span>Sistem Sertifikasi Nasional</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
              {renderTitle(title)}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#tentang"
                className="btn-primary py-3.5 px-8 rounded-full flex items-center justify-center gap-2"
              >
                Pelajari Selengkapnya
              </a>
            </div>
          </div>

          {/* Right Graphic Column */}
          <div className="md:col-span-5 lg:col-span-6 flex justify-center animate-fade-in-up animate-delay-200 mt-10 md:mt-0">
            <div className="relative w-full max-w-[450px] lg:max-w-[600px] xl:max-w-[700px] flex justify-center items-center">
              {/* Optional glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-200/40 to-pmai-blue/20 rounded-full filter blur-[60px] opacity-70 transform -translate-y-4"></div>

              <img
                src={asesorImg}
                alt="Asesor Kompeten"
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
