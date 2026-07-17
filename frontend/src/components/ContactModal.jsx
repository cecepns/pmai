import React, { useState } from "react";
import { X, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { request } from "../utils/request";
import { API_ENDPOINTS } from "../utils/endpoints";

export default function ContactModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!form.subject.trim()) tempErrors.subject = "Subjek pesan wajib diisi.";
    if (!form.message.trim()) tempErrors.message = "Pesan wajib diisi.";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      toast.error("Harap isi semua kolom dengan benar.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await request.post(API_ENDPOINTS.CONTACT.SUBMIT, form);
      if (response.success) {
        toast.success(response.message);
        setForm({ name: "", email: "", subject: "", message: "" });
        onClose();
      }
    } catch (err) {
      toast.error(err.message || "Gagal mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Modal overlay backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
      ></div>

      {/* Modal body */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative z-10 w-full max-w-lg p-6 sm:p-8 animate-fade-in">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex gap-4 items-start mb-6">
          <div className="p-3 bg-pmai-blue/10 text-pmai-blue rounded-2xl">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Kirim Pesan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tulis pertanyaan Anda, tim sekretariat kami akan menjawab secepat mungkin.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nama */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pmai-blue/10 transition-all ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-pmai-blue"
              }`}
              placeholder="Contoh: Budi Santoso"
            />
            {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name}</p>}
          </div>

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

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Perihal / Subjek</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pmai-blue/10 transition-all ${
                errors.subject ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-pmai-blue"
              }`}
              placeholder="Contoh: Informasi Sertifikasi LSP"
            />
            {errors.subject && <p className="text-red-500 text-xs font-medium">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Pesan Detail</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows="4"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pmai-blue/10 transition-all ${
                errors.message ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-pmai-blue"
              }`}
              placeholder="Tulis pesan lengkap Anda di sini..."
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs font-medium">{errors.message}</p>}
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
              className="flex-1 btn-primary text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <span>Kirim Pesan</span>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
