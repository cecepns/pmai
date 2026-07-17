import React, { useState, useEffect } from "react";
import { X, UserPlus, BookOpen, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { request } from "../utils/request";
import { API_ENDPOINTS } from "../utils/endpoints";

export default function RegisterModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ 
    name: "", email: "", phone: "", regNo: "", bidang: "Teknologi Informasi", provinsi: "DKI Jakarta", cvFile: null 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "Nama lengkap wajib diisi.";
    if (!form.email.trim()) {
      tempErrors.email = "Email wajib diisi.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Format email tidak valid.";
    }
    if (!form.phone.trim()) {
      tempErrors.phone = "Nomor telepon/WhatsApp wajib diisi.";
    } else if (!/^[0-9+ -]{9,15}$/.test(form.phone)) {
      tempErrors.phone = "Nomor telepon tidak valid.";
    }
    if (!form.regNo.trim()) tempErrors.regNo = "Nomor Registrasi Asesor/MET wajib diisi.";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      toast.error("Harap periksa form pendaftaran Anda.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await request.post(API_ENDPOINTS.MEMBERSHIP.REGISTER, form);
      if (response.success) {
        toast.success(response.message);
        setForm({ 
          name: "", email: "", phone: "", regNo: "", bidang: "Teknologi Informasi", provinsi: "DKI Jakarta", cvFile: null 
        });
        onClose();
      }
    } catch (err) {
      toast.error(err.message || "Gagal mendaftar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Overlay backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
      ></div>

      {/* Modal body */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative z-10 w-full max-w-xl p-6 sm:p-8 animate-fade-in overflow-y-auto max-h-[90vh] hide-scrollbar-mobile">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex gap-4 items-start mb-6">
          <div className="p-3 bg-pmai-red/10 text-pmai-red rounded-2xl">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Gabung Anggota PMAI</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ajukan keanggotaan Anda sebagai Master Asesor bersertifikasi secara online.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nama */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap (Serta Gelar)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pmai-blue/10 transition-all ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-pmai-blue"
              }`}
              placeholder="Contoh: Dr. Budi Santoso, M.T."
            />
            {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Alamat Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pmai-blue/10 transition-all ${
                  errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-pmai-blue"
                }`}
                placeholder="Contoh: budi@gmail.com"
              />
              {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}
            </div>

            {/* Telepon */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">No. WhatsApp</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pmai-blue/10 transition-all ${
                  errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-pmai-blue"
                }`}
                placeholder="Contoh: 081234567890"
              />
              {errors.phone && <p className="text-red-500 text-xs font-medium">{errors.phone}</p>}
            </div>

          </div>

          {/* No Reg Asesor */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">No. Registrasi MET (Badan Nasional Sertifikasi)</label>
            <input
              type="text"
              value={form.regNo}
              onChange={(e) => setForm({ ...form, regNo: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pmai-blue/10 transition-all ${
                errors.regNo ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-pmai-blue"
              }`}
              placeholder="Contoh: REG.MET.000.000000"
            />
            {errors.regNo && <p className="text-red-500 text-xs font-medium">{errors.regNo}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Bidang Keahlian */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Bidang Keahlian</label>
              <select
                value={form.bidang}
                onChange={(e) => setForm({ ...form, bidang: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue transition-all"
              >
                <option value="Sertifikasi & Lisensi">Sertifikasi & Lisensi</option>
                <option value="Pendidikan & Pelatihan">Pendidikan & Pelatihan</option>
                <option value="Teknik & Rekayasa">Teknik & Rekayasa</option>
                <option value="Teknologi Informasi">Teknologi Informasi</option>
                <option value="Bisnis & Manajemen">Bisnis & Manajemen</option>
                <option value="Keuangan & Akuntansi">Keuangan & Akuntansi</option>
              </select>
            </div>

            {/* Provinsi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Domisili Provinsi</label>
              <select
                value={form.provinsi}
                onChange={(e) => setForm({ ...form, provinsi: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue transition-all"
              >
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Banten">Banten</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="DI Yogyakarta">DI Yogyakarta</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Bali">Bali</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
              </select>
            </div>

          </div>

          {/* Upload CV Mock */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Upload CV / Sertifikat Asesor (PDF)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-pmai-blue transition-colors relative bg-slate-50/50">
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setForm({ ...form, cvFile: e.target.files[0] })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-1">
                <BookOpen size={24} className="text-slate-400" />
                <span className="text-xs text-slate-600 font-semibold">
                  {form.cvFile ? form.cvFile.name : "Pilih file PDF atau tarik ke sini"}
                </span>
                <span className="text-[10px] text-slate-400">Ukuran maksimal file 5MB</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-accent text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Mengajukan...</span>
                </>
              ) : (
                <span>Ajukan Anggota</span>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
