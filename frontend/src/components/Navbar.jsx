import React from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ 
  isScrolled, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}) {
  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3" 
        : "bg-white/80 backdrop-blur-sm border-b border-slate-100/50 py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo only - as requested by user */}
          <a href="#" className="flex items-center group shrink-0">
            <img 
              src="/logo.png" 
              alt="Logo PMAI" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </a>

          {/* Desktop Navigation Links - dark slate from the start */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Tentang", href: "#tentang" },
              { label: "Visi & Misi", href: "#visi-misi" },
              { label: "Peran & Tujuan", href: "#peran-tujuan" },
              { label: "Kegiatan", href: "#kegiatan" },
              { label: "Kontak", href: "#kontak" }
            ].map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-sm font-bold text-slate-600 hover:text-pmai-blue transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>


          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full focus:outline-none transition-colors text-slate-700 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu collapse panel */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 transition-all duration-300 shadow-xl overflow-hidden ${
        isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-3">
          {[
            { label: "Tentang", href: "#tentang" },
            { label: "Visi & Misi", href: "#visi-misi" },
            { label: "Peran & Tujuan", href: "#peran-tujuan" },
            { label: "Kegiatan", href: "#kegiatan" },
            { label: "Kontak", href: "#kontak" }
          ].map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-bold text-slate-700 hover:bg-slate-50 hover:text-pmai-blue transition-all"
            >
              {link.label}
            </a>
          ))}

        </div>
      </div>
    </nav>
  );
}
