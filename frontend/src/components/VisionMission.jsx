import React from "react";
import { Award } from "lucide-react";

export default function VisionMission({ content }) {
  const visi = content?.visi_text || "Menjadi wadah perkumpulan Master Asesor Indonesia yang kompeten untuk mendukung program Sistem Sertifikasi Nasional.";
  let missions = [
    "Membangun dan mengembangkan kemampuan Master Asesor di seluruh wilayah Indonesia.",
    "Menumbuhkembangkan profesi dengan kejelasan kerangka kualifikasi.",
    "Memberikan pelayanan konsultasi berbasis teknologi informasi demi tercapainya Sistem Sertifikasi Nasional."
  ];

  if (content?.misi_items) {
    try {
      missions = JSON.parse(content.misi_items);
    } catch (e) {
      console.warn("Failed to parse mission items, using default fallbacks.", e);
    }
  }

  return (
    <section id="visi-misi" className="py-24 bg-slate-900 text-white relative overflow-hidden animate-fade-in">
      
      {/* Glow visual decoration */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-pmai-blue/20 rounded-full filter blur-[80px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Vision */}
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-xs font-bold text-pmai-red uppercase tracking-widest">Arah & Landasan</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Visi Kami
            </h3>
            <div className="h-1 w-12 bg-pmai-red rounded-full"></div>
            <div className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl flex gap-4">
              <div className="text-amber-400 mt-1 shrink-0">
                <Award size={32} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-100 leading-relaxed italic">
                  "{visi}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Block: Mision */}
          <div className="md:col-span-7 space-y-6">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Misi Kami
            </h3>
            <div className="h-1 w-12 bg-pmai-blue rounded-full"></div>
            <div className="space-y-4">
              {missions.map((misi, idx) => (
                <div 
                  key={idx} 
                  className="p-5 bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-pmai-blue/20 text-pmai-blue-light font-bold flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </div>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {misi}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
