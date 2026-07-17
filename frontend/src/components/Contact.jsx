import React from "react";
import { MapPin, Instagram, Mail, MessageSquare, ExternalLink } from "lucide-react";

export default function Contact({ setIsContactModalOpen }) {
  return (
    <section id="kontak" className="py-24 bg-slate-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-pmai-blue uppercase tracking-widest">Informasi Hubung</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Hubungi PMAI
              </h3>
              <div className="h-1 w-12 bg-pmai-red rounded-full"></div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Ada pertanyaan seputar keanggotaan, lisensi sertifikasi, atau perumusan kompetensi kerja? Hubungi kantor pusat sekretariat kami.
              </p>
            </div>

            {/* Detail Items */}
            <div className="space-y-6">
              
              {/* Alamat */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white border border-slate-200 text-pmai-blue rounded-xl shrink-0 shadow-sm">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Kantor Sekretariat</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Jalan Parpostel Raya Perumahan CRV Residence, Jatiasih, Bekasi 10230, Kota Bekasi, Indonesia
                  </p>
                </div>
              </div>

              {/* Instagram */}
              <a 
                href="https://instagram.com/pmaiindonesia" 
                target="_blank" 
                rel="noreferrer"
                className="flex gap-4 items-start group"
              >
                <div className="p-3 bg-white border border-slate-200 text-pmai-red rounded-xl shrink-0 shadow-sm group-hover:bg-pmai-red group-hover:text-white transition-colors">
                  <Instagram size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Instagram Resmi</h4>
                  <p className="text-slate-600 text-sm flex items-center gap-1 group-hover:text-pmai-red transition-colors">
                    @pmaiindonesia
                    <ExternalLink size={12} />
                  </p>
                </div>
              </a>

              {/* Email / Info */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white border border-slate-200 text-pmai-blue rounded-xl shrink-0 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Email Sekretariat</h4>
                  <p className="text-slate-600 text-sm">
                    info@pmai.or.id
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="pt-4">
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl"
              >
                <MessageSquare size={18} />
                Kirim Pesan Langsung
              </button>
            </div>

          </div>

          {/* Map Container */}
          <div className="lg:col-span-7 h-[420px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white p-2">
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              <iframe
                title="Peta Lokasi PMAI"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7335607312154!2d106.9634994!3d-6.298717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d00085a6a6f%3A0xe510cfc8d23b378b!2sJalan%20Parpostel%20Raya%20Perumahan%20CRV%20Residence!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
