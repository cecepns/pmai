import React from "react";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">

          {/* Column 1: Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo PMAI"
                className="h-10 w-10 bg-white rounded-lg p-1"
              />
              <h4 className="text-xl font-bold uppercase tracking-wider text-white">
                PMAI
              </h4>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Perkumpulan Master Asesor Indonesia merupakan wadah pengembangan kemampuan Master Asesor untuk mendukung program Sistem Sertifikasi Nasional di Indonesia dengan semangat Asah, Asih, dan Asuh.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com/pmaiindonesia"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-pmai-red text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Pintasan
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#tentang" className="hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#visi-misi" className="hover:text-white transition-colors">Visi & Misi</a></li>
              <li><a href="#peran-tujuan" className="hover:text-white transition-colors">Peran & Tujuan</a></li>
              <li><a href="#kontak" className="hover:text-white transition-colors">Sekretariat</a></li>
            </ul>
          </div>

          {/* Column 3: Secretariat */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Sekretariat
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jalan Parpostel Raya Perumahan CRV Residence, Jatiasih, Bekasi 10230, Kota Bekasi, Indonesia
            </p>
            <p className="text-xs text-slate-400">
              Email: info@pmai.or.id
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            &copy; {new Date().getFullYear()} Perkumpulan Master Asesor Indonesia. Hak Cipta Dilindungi.
          </p>
          {/* <p className="flex items-center gap-1.5">
            <span>Sistem Sertifikasi Nasional</span>
            <span className="w-1.5 h-1.5 rounded-full bg-pmai-red"></span>
            <span>Indonesia Emas</span>
          </p> */}
        </div>

      </div>
    </footer>
  );
}
