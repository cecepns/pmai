import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, User, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { request } from "../../utils/request";
import { API_ENDPOINTS } from "../../utils/endpoints";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!form.username.trim()) tempErrors.username = "Username wajib diisi.";
    if (!form.password.trim()) tempErrors.password = "Password wajib diisi.";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await request.post(API_ENDPOINTS.AUTH.LOGIN, form);
      if (response.success && response.token) {
        localStorage.setItem("pmai_token", response.token);
        localStorage.setItem("pmai_username", response.username);
        toast.success("Login Admin berhasil!");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Username atau password salah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decorations matching the clean digital service layout */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-10 right-10 w-96 h-96 bg-pmai-blue rounded-full filter blur-[100px] animate-pulse-subtle"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-100 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
        
        {/* Back Link */}
        <button 
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Kembali ke Beranda
        </button>

        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 bg-pmai-blue/10 text-pmai-blue rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Panel Admin PMAI
          </h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Masuk untuk mengelola konten dan anggota
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pmai-blue/10 transition-all ${
                  errors.username ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-pmai-blue"
                }`}
                placeholder="Masukkan username"
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs font-medium">{errors.username}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pmai-blue/10 transition-all ${
                  errors.password ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-pmai-blue"
                }`}
                placeholder="Masukkan password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password}</p>}
          </div>

          {/* Submit Button - rounded-full solid blue */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 rounded-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
