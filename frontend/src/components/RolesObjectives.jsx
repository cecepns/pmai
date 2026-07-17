import React, { useState } from "react";
import { Compass, BookOpen, CheckCircle } from "lucide-react";

export default function RolesObjectives({ content }) {
  const [activeTab, setActiveTab] = useState("peran");

  let roles = [
    "Membantu pemerintah, khususnya Badan Nasional Sertifikasi, dalam mengembangkan Sistem Sertifikasi Nasional.",
    "Membantu lembaga penyelenggara pendidikan dan pelatihan keahlian agar lulusannya memiliki kompetensi yang dibutuhkan oleh pasar kerja.",
    "Membantu pemerintah dalam perumusan Standar Kompetensi Kerja Nasional Indonesia (SKKNI).",
    "Membantu Lembaga Sertifikasi Profesi (LSP) pada sektor terkait dalam pengawasan pelaksanaan uji kompetensi."
  ];

  let objectives = [
    "Menjadi mitra pemerintah, khususnya Badan Nasional Sertifikasi, dalam mengembangkan Sistem Sertifikasi Nasional.",
    "Mewujudkan profesionalisme anggota yang memiliki disiplin, dedikasi, loyalitas, serta kompetensi di bidangnya sehingga mampu menghadapi persaingan dan memanfaatkan peluang di era globalisasi.",
    "Menjadi wadah komunikasi dan konsultasi antaranggota maupun antara anggota dengan masyarakat.",
    "Menjadi wadah bagi para Master Asesor untuk meningkatkan kemampuan dalam memberikan pelayanan kepada masyarakat.",
    "Menerapkan semangat Asah, Asih, dan Asuh di antara seluruh anggota perkumpulan."
  ];

  if (content?.peran_items) {
    try {
      roles = JSON.parse(content.peran_items);
    } catch (e) {
      console.warn("Failed to parse roles, using defaults.", e);
    }
  }

  if (content?.tujuan_items) {
    try {
      objectives = JSON.parse(content.tujuan_items);
    } catch (e) {
      console.warn("Failed to parse objectives, using defaults.", e);
    }
  }

  return (
    <section id="peran-tujuan" className="py-24 bg-slate-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-xs font-bold text-pmai-blue uppercase tracking-widest">Komitmen Kerja</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Peran & Tujuan Organisasi
          </h3>
          <div className="h-1 w-16 bg-pmai-red mx-auto rounded-full"></div>
          <p className="text-slate-600 text-sm sm:text-base">
            PMAI beroperasi dengan peran terdefinisi demi mencapai tujuan mulia pengembangan standar kompetensi kerja nasional.
          </p>

          {/* Tabs Selector */}
          <div className="inline-flex p-1.5 bg-slate-200/80 rounded-xl mt-6">
            <button 
              onClick={() => setActiveTab("peran")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "peran" 
                  ? "bg-white text-pmai-blue shadow-md" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <Compass size={16} />
                Peran PMAI
              </span>
            </button>
            <button 
              onClick={() => setActiveTab("tujuan")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "tujuan" 
                  ? "bg-white text-pmai-blue shadow-md" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen size={16} />
                Tujuan PMAI
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="max-w-5xl mx-auto">
          {activeTab === "peran" ? (
            <div className="grid sm:grid-cols-2 gap-6 animate-fade-in">
              {roles.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start"
                >
                  <div className="p-2 rounded-lg bg-pmai-blue/10 text-pmai-blue shrink-0">
                    <CheckCircle size={20} className="text-pmai-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wide">
                      Peran 0{idx + 1}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
              {objectives.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-8 h-8 bg-pmai-red/10 text-pmai-red rounded-lg font-bold flex items-center justify-center text-xs">
                      0{idx + 1}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
