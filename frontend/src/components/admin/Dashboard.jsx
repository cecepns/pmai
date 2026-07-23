import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, LogOut, FileText, Users, Mail, Menu, X, Save,
  Trash2, Check, RefreshCw, Eye, Loader2, ArrowLeft,
  ChevronLeft, ChevronRight, Search, Plus, Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { request } from "../../utils/request";
import { API_ENDPOINTS } from "../../utils/endpoints";
import AdminActivities from "./Activities";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("content");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAdminLoaded, setIsAdminLoaded] = useState(false);
  const navigate = useNavigate();

  // 1. CONTENT MANAGING STATE
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [visiText, setVisiText] = useState("");
  const [misiItems, setMisiItems] = useState([]);
  const [peranItems, setPeranItems] = useState([]);
  const [isSavingContent, setIsSavingContent] = useState(false);

  // 2. ASSESSORS MANAGING STATE
  const [assessors, setAssessors] = useState([]);
  const [assessorSearch, setAssessorSearch] = useState("");
  const [assessorStatusFilter, setAssessorStatusFilter] = useState("Semua");
  const [assessorLimit, setAssessorLimit] = useState(10);
  const [assessorPage, setAssessorPage] = useState(1);
  const [assessorTotalPages, setAssessorTotalPages] = useState(1);
  const [assessorTotal, setAssessorTotal] = useState(0);
  const [assessorSortBy, setAssessorSortBy] = useState("name");
  const [assessorSortOrder, setAssessorSortOrder] = useState("asc");
  const [isLoadingAssessors, setIsLoadingAssessors] = useState(false);

  // 3. INBOX MESSAGES MANAGING STATE
  const [messages, setMessages] = useState([]);
  const [messagePage, setMessagePage] = useState(1);
  const [messageTotalPages, setMessageTotalPages] = useState(1);
  const [messageTotal, setMessageTotal] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Guard authentication
  useEffect(() => {
    const token = localStorage.getItem("pmai_token");
    if (!token) {
      toast.error("Silakan login terlebih dahulu.");
      navigate("/admin/login");
    } else {
      setIsAdminLoaded(true);
    }
  }, [navigate]);

  // Load Content Initial Data
  useEffect(() => {
    if (!isAdminLoaded) return;

    const loadContentData = async () => {
      try {
        const res = await request.get(API_ENDPOINTS.CONTENT.GET);
        if (res.success && res.data) {
          setHeroTitle(res.data.hero_title || "");
          setHeroSubtitle(res.data.hero_subtitle || "");
          setAboutText(res.data.about_text || "");
          setVisiText(res.data.visi_text || "");
          try {
            setMisiItems(JSON.parse(res.data.misi_items || "[]"));
          } catch {
            setMisiItems([]);
          }
          try {
            setPeranItems(JSON.parse(res.data.peran_items || "[]"));
          } catch {
            setPeranItems([]);
          }
        }
      } catch (err) {
        console.error("Gagal memuat data landing content.", err);
      }
    };

    loadContentData();
  }, [isAdminLoaded]);

  // Load Assessors and Messages
  useEffect(() => {
    if (!isAdminLoaded) return;
    if (activeTab === "assessors") {
      fetchAssessors();
    } else if (activeTab === "messages") {
      fetchMessages();
    }
  }, [isAdminLoaded, activeTab, assessorPage, assessorLimit, assessorSortBy, assessorSortOrder, assessorStatusFilter]);

  // Fetch Assessors API
  const fetchAssessors = async () => {
    setIsLoadingAssessors(true);
    try {
      const params = {
        page: assessorPage,
        limit: assessorLimit,
        search: assessorSearch,
        sortBy: assessorSortBy,
        sortOrder: assessorSortOrder,
      };
      // Note: backend endpoint filtering handled dynamically
      const res = await request.get(API_ENDPOINTS.MEMBERSHIP.LIST, params);
      if (res.success) {
        setAssessors(res.data);
        setAssessorTotal(res.pagination.total);
        setAssessorTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      toast.error(err.message || "Gagal memuat daftar asesor.");
    } finally {
      setIsLoadingAssessors(false);
    }
  };

  // Fetch Messages API
  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const res = await request.get(API_ENDPOINTS.MESSAGES.LIST, { page: messagePage, limit: 10 });
      if (res.success) {
        setMessages(res.data);
        setMessageTotal(res.pagination.total);
        setMessageTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      toast.error(err.message || "Gagal memuat pesan inbox.");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("pmai_token");
    localStorage.removeItem("pmai_username");
    toast.success("Anda berhasil keluar.");
    navigate("/");
  };

  // Save Content API
  const handleSaveContent = async (e) => {
    e.preventDefault();
    setIsSavingContent(true);
    try {
      const payload = {
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        about_text: aboutText,
        visi_text: visiText,
        misi_items: JSON.stringify(misiItems),
        peran_items: JSON.stringify(peranItems),
      };
      const res = await request.post(API_ENDPOINTS.CONTENT.UPDATE, payload);
      if (res.success) {
        toast.success(res.message || "Konten landing page berhasil disimpan!");
      }
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan konten.");
    } finally {
      setIsSavingContent(false);
    }
  };

  // Verify Assessor (Approve/Reject)
  const handleVerifyAssessor = async (id, newStatus) => {
    try {
      const res = await request.put(API_ENDPOINTS.MEMBERSHIP.VERIFY(id), { status: newStatus });
      if (res.success) {
        toast.success(res.message);
        fetchAssessors();
      }
    } catch (err) {
      toast.error(err.message || "Gagal memverifikasi asesor.");
    }
  };

  // Delete Assessor
  const handleDeleteAssessor = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data asesor ini?")) return;
    try {
      const res = await request.delete(API_ENDPOINTS.MEMBERSHIP.DELETE(id));
      if (res.success) {
        toast.success(res.message);
        fetchAssessors();
      }
    } catch (err) {
      toast.error(err.message || "Gagal menghapus asesor.");
    }
  };

  // Mark Message as Read
  const handleReadMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.is_read) return;
    try {
      const res = await request.put(API_ENDPOINTS.MESSAGES.READ(msg.id));
      if (res.success) {
        // Update locally
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      }
    } catch (err) {
      console.warn("Gagal menandai pesan dibaca.", err);
    }
  };

  // Delete Message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Hapus pesan ini dari inbox?")) return;
    try {
      const res = await request.delete(API_ENDPOINTS.MESSAGES.DELETE(id));
      if (res.success) {
        toast.success(res.message);
        setSelectedMessage(null);
        fetchMessages();
      }
    } catch (err) {
      toast.error(err.message || "Gagal menghapus pesan.");
    }
  };

  // Manage Array Fields helper
  const addMisiItem = () => setMisiItems([...misiItems, ""]);
  const updateMisiItem = (idx, val) => {
    const list = [...misiItems];
    list[idx] = val;
    setMisiItems(list);
  };
  const removeMisiItem = (idx) => setMisiItems(misiItems.filter((_, i) => i !== idx));

  const addPeranItem = () => setPeranItems([...peranItems, ""]);
  const updatePeranItem = (idx, val) => {
    const list = [...peranItems];
    list[idx] = val;
    setPeranItems(list);
  };
  const removePeranItem = (idx) => setPeranItems(peranItems.filter((_, i) => i !== idx));

  if (!isAdminLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans relative">

      {/* SIDEBAR - Desktop and Mobile (Responsive side drawer) */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${isMobileSidebarOpen ? "translate-x-0 w-64" : "md:translate-x-0 -translate-x-full " + (isSidebarCollapsed ? "w-20" : "w-64")
        }`}>

        <div>
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-pmai-blue rounded-xl shrink-0">
                <Shield size={20} className="text-white" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-extrabold text-sm uppercase tracking-wider text-white">
                  PMAI Admin
                </span>
              )}
            </div>
            {/* Mobile close toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {[
              { id: "content", label: "Kelola Konten", icon: <FileText size={20} /> },
              { id: "assessors", label: "Kelola Asesor", icon: <Users size={20} /> },
              { id: "messages", label: "Pesan Masuk", icon: <Mail size={20} /> },
              { id: "activities", label: "Foto Kegiatan", icon: <ImageIcon size={20} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                    ? "bg-pmai-blue text-white shadow-md shadow-pmai-blue/15"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                <div className="shrink-0">{tab.icon}</div>
                {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>{tab.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3.5 p-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>Kembali ke Web</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 p-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={20} />
            {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>Keluar</span>}
          </button>
        </div>

      </aside>

      {/* BACKGROUND SIDEBAR OVERLAY FOR MOBILE */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-xs md:hidden"
        ></div>
      )}

      {/* MAIN CONTAINER */}
      <div className={`flex-grow min-h-screen flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}>

        {/* TOP HEADER */}
        <header className="bg-white border-b border-slate-100 py-4 px-6 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">

            {/* Desktop Collapse toggler */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:block p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            >
              <Menu size={20} />
            </button>

            {/* Mobile Sidebar toggler */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            >
              <Menu size={20} />
            </button>

            <h1 className="text-lg font-bold text-slate-900">
              {activeTab === "content" && "Manajemen Konten Halaman Utama"}
              {activeTab === "assessors" && "Manajemen Database Asesor"}
              {activeTab === "messages" && "Inbox Pesan Masuk"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">
              Administrator: {localStorage.getItem("pmai_username") || "Admin"}
            </span>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="p-6 sm:p-8 flex-grow">

          {/* TAB 1: MANAGE LANDING PAGE CONTENT */}
          {activeTab === "content" && (
            <form onSubmit={handleSaveContent} className="max-w-4xl space-y-8 animate-fade-in">

              {/* Card - Hero */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-pmai-blue rounded-full"></span>
                  Bagian Utama (Hero Section)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Judul Utama (Title)</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Sub-Judul (Subtitle)</label>
                    <textarea
                      rows="3"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Card - Tentang & Visi */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-pmai-blue rounded-full"></span>
                  Tentang Kami & Visi
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Deskripsi Tentang Kami</label>
                    <textarea
                      rows="4"
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue"
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Teks Visi Organisasi</label>
                    <textarea
                      rows="3"
                      value={visiText}
                      onChange={(e) => setVisiText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Card - Misi Items Array */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-pmai-blue rounded-full"></span>
                    Misi Organisasi
                  </h3>
                  <button
                    type="button"
                    onClick={addMisiItem}
                    className="btn-secondary py-1.5 px-3 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus size={14} /> Tambah Misi
                  </button>
                </div>
                <div className="space-y-3">
                  {misiItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateMisiItem(idx, e.target.value)}
                        className="flex-grow px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue"
                        placeholder="Tulis poin misi baru..."
                      />
                      <button
                        type="button"
                        onClick={() => removeMisiItem(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {misiItems.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">Belum ada poin misi ditambahkan.</p>
                  )}
                </div>
              </div>

              {/* Card - Peran Items Array */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-pmai-blue rounded-full"></span>
                    Peran Organisasi
                  </h3>
                  <button
                    type="button"
                    onClick={addPeranItem}
                    className="btn-secondary py-1.5 px-3 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus size={14} /> Tambah Peran
                  </button>
                </div>
                <div className="space-y-3">
                  {peranItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updatePeranItem(idx, e.target.value)}
                        className="flex-grow px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue"
                        placeholder="Tulis poin peran baru..."
                      />
                      <button
                        type="button"
                        onClick={() => removePeranItem(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {peranItems.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">Belum ada poin peran ditambahkan.</p>
                  )}
                </div>
              </div>

              {/* Action Floating Bar */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="btn-primary px-8 py-3 rounded-full flex items-center gap-2 text-sm shadow-lg shadow-pmai-blue/20"
                >
                  {isSavingContent ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: MANAGE ASSESSORS */}
          {activeTab === "assessors" && (
            <div className="space-y-6 animate-fade-in">

              {/* Filter controls matching rules */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="grid md:grid-cols-12 gap-4 items-center">

                  {/* Search */}
                  <div className="md:col-span-5 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama, No Reg, atau provinsi..."
                      value={assessorSearch}
                      onChange={(e) => setAssessorSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue"
                    />
                  </div>

                  {/* Limit Selection */}
                  <div className="md:col-span-3 flex items-center gap-2 text-sm text-slate-500 justify-end md:justify-start">
                    <span>Limit:</span>
                    <select
                      value={assessorLimit}
                      onChange={(e) => {
                        setAssessorLimit(Number(e.target.value));
                        setAssessorPage(1);
                      }}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none"
                    >
                      <option value={10}>10 data</option>
                      <option value={25}>25 data</option>
                      <option value={50}>50 data</option>
                      <option value={100}>100 data</option>
                    </select>
                  </div>

                  {/* Refresh Button */}
                  <div className="md:col-span-4 flex justify-end gap-2">
                    <button
                      onClick={fetchAssessors}
                      className="btn-secondary py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} /> Refresh
                    </button>
                  </div>

                </div>
              </div>

              {/* Table rendering list */}
              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No Reg Asesor</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bidang Keahlian</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Provinsi</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CV Asli</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingAssessors ? (
                        <tr>
                          <td colSpan="7" className="p-12 text-center text-slate-400">
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 size={18} className="animate-spin text-pmai-blue" />
                              <span>Memuat data Asesor dari server...</span>
                            </div>
                          </td>
                        </tr>
                      ) : assessors.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-12 text-center text-slate-400">
                            Tidak ada data asesor terdaftar.
                          </td>
                        </tr>
                      ) : (
                        assessors.map((item) => (
                          <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                            <td className="p-4 text-sm font-semibold text-pmai-blue font-mono">{item.id}</td>
                            <td className="p-4 text-sm font-bold text-slate-800">
                              <div>{item.name}</div>
                              <div className="text-[10px] font-medium text-slate-400">{item.email} &bull; {item.phone}</div>
                            </td>
                            <td className="p-4 text-sm text-slate-600">{item.bidang}</td>
                            <td className="p-4 text-sm text-slate-600">{item.provinsi}</td>
                            <td className="p-4 text-sm">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.status === "Aktif"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : item.status === "Pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-800"
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Aktif" ? "bg-emerald-500" : item.status === "Pending" ? "bg-amber-500" : "bg-slate-400"
                                  }`}></span>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-4 text-sm">
                              {item.cv_file ? (
                                <a
                                  href={`https://api.kingcreativestudio.my.id/pmai/uploads/${item.cv_file}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-semibold text-pmai-blue hover:underline inline-flex items-center gap-1"
                                >
                                  Unduh PDF <Eye size={12} />
                                </a>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">Tidak ada berkas</span>
                              )}
                            </td>
                            <td className="p-4 text-sm text-right space-x-1 whitespace-nowrap">
                              {item.status !== "Aktif" && (
                                <button
                                  onClick={() => handleVerifyAssessor(item.id, "Aktif")}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-0.5 shadow-sm"
                                >
                                  <Check size={12} /> Setujui
                                </button>
                              )}
                              {item.status !== "Nonaktif" && (
                                <button
                                  onClick={() => handleVerifyAssessor(item.id, "Nonaktif")}
                                  className="px-2.5 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                                >
                                  Nonaktifkan
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteAssessor(item.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                {assessorTotalPages > 1 && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-slate-500">
                      Menampilkan <span className="font-semibold">{Math.min(assessors.length, assessorLimit)}</span> data dari <span className="font-semibold">{assessorTotal}</span> data asesor
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setAssessorPage(p => Math.max(p - 1, 1))}
                        disabled={assessorPage === 1}
                        className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm font-semibold text-slate-700 px-3">
                        Halaman {assessorPage} dari {assessorTotalPages}
                      </span>
                      <button
                        onClick={() => setAssessorPage(p => Math.min(p + 1, assessorTotalPages))}
                        disabled={assessorPage === assessorTotalPages}
                        className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: CONTACT INBOX MESSAGES */}
          {activeTab === "messages" && (
            <div className="grid lg:grid-cols-12 gap-6 items-start animate-fade-in">

              {/* Inbox Message List */}
              <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Inbox</h4>
                  <button
                    onClick={fetchMessages}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {isLoadingMessages ? (
                    <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-pmai-blue" />
                      <span className="text-xs">Memuat inbox...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="p-8 text-center text-slate-400 text-xs">Inbox Anda kosong.</p>
                  ) : (
                    messages.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleReadMessage(item)}
                        className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${!item.is_read ? "bg-sky-50/20 border-l-4 border-pmai-blue" : ""
                          } ${selectedMessage?.id === item.id ? "bg-slate-100/50" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-sm text-slate-800 truncate max-w-[150px]">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {new Date(item.created_at).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-600 truncate mt-1">{item.subject}</div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">{item.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Message Reading Pane */}
              <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
                {selectedMessage ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900">{selectedMessage.name}</h3>
                        <p className="text-xs text-slate-500 font-semibold">{selectedMessage.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block">Diterima Pada:</span>
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(selectedMessage.created_at).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-pmai-blue uppercase tracking-wider block">Subjek Pesan:</span>
                      <h4 className="font-extrabold text-md text-slate-800">{selectedMessage.subject}</h4>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-pmai-blue uppercase tracking-wider block">Isi Pesan:</span>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-2xl p-4 whitespace-pre-line border border-slate-100">
                        {selectedMessage.message}
                      </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 size={14} /> Hapus Pesan Ini
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 flex-grow">
                    <Mail size={40} className="text-slate-300" />
                    <p className="text-xs font-semibold">Pilih pesan di sebelah kiri untuk membaca detail</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: ACTIVITIES */}
          {activeTab === "activities" && <AdminActivities />}

        </main>
      </div>

    </div>
  );
}
