import React from "react";
import { Award, Users, Shield } from "lucide-react";

export default function About({ content }) {
  const aboutText = content?.about_text || "Perkumpulan Master Asesor Indonesia (PMAI) merupakan organisasi yang bertujuan untuk mengembangkan kemampuan anggotanya dalam memberikan pelayanan kepada masyarakat umum, serta menjadi wadah bagi para anggota untuk saling bertukar keahlian dan mengayomi sesama dengan semangat Asah, Asih, dan Asuh.";

  return (
    <section id="tentang" className="py-24 bg-white relative animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold text-pmai-blue uppercase tracking-widest">Tentang Kami</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mengenal PMAI Lebih Dekat
          </h3>
          <div className="h-1 w-16 bg-pmai-red mx-auto rounded-full"></div>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
            {aboutText}
          </p>
        </div>

        {/* Pillars Cards (Asah, Asih, Asuh) */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: Asah */}
          <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-pmai-blue/30 transition-all duration-300 flex flex-col group">
            <div className="w-14 h-14 bg-pmai-blue/10 text-pmai-blue rounded-xl flex items-center justify-center mb-6 group-hover:bg-pmai-blue group-hover:text-white transition-all duration-300 shadow-sm">
              <Award size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Asah</h4>
            <p className="text-slate-600 text-sm leading-relaxed flex-grow">
              Mengasah kemampuan, profesionalisme, serta mempertajam kepakaran asesor melalui program peningkatan kompetensi terstruktur dan berkesinambungan.
            </p>
          </div>

          {/* Card 2: Asih */}
          <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-pmai-blue/30 transition-all duration-300 flex flex-col group">
            <div className="w-14 h-14 bg-pmai-red/10 text-pmai-red rounded-xl flex items-center justify-center mb-6 group-hover:bg-pmai-red group-hover:text-white transition-all duration-300 shadow-sm">
              <Users size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Asih</h4>
            <p className="text-slate-600 text-sm leading-relaxed flex-grow">
              Saling mengasihi, peduli, dan menghargai keragaman keahlian. Membina relasi harmonis untuk saling mendukung dalam karir profesional.
            </p>
          </div>

          {/* Card 3: Asuh */}
          <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-pmai-blue/30 transition-all duration-300 flex flex-col group">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <Shield size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Asuh</h4>
            <p className="text-slate-600 text-sm leading-relaxed flex-grow">
              Saling membimbing, mengayomi, dan mentransfer pengetahuan berharga dari asesor senior kepada asesor junior demi regenerasi standar kualitas nasional yang unggul.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
