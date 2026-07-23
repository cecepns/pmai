import React, { useState, useEffect } from "react";
import {
  Search, Plus, RefreshCw, Loader2, Image as ImageIcon,
  Trash2, Edit, X, Check
} from "lucide-react";
import toast from "react-hot-toast";
import { request } from "../../utils/request";
import { API_ENDPOINTS } from "../../utils/endpoints";

export default function AdminActivities() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchActivities();
    }, 300); // 300ms debounce as per rules
    return () => clearTimeout(delayDebounceFn);
  }, [search, page, limit]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const params = { page, limit, search };
      const res = await request.get(API_ENDPOINTS.ACTIVITIES.LIST, params);
      if (res.success) {
        setActivities(res.data);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      toast.error(err.message || "Gagal memuat daftar kegiatan.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    resetForm();
    setEditingId(activity.id);
    setTitle(activity.title);
    setDescription(activity.description || "");
    if (activity.image) {
      setImagePreview(`https://api.kingcreativestudio.my.id/pmai/uploads/${activity.image}`);
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Judul kegiatan wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      let res;
      if (editingId) {
        res = await request.put(API_ENDPOINTS.ACTIVITIES.UPDATE(editingId), formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        res = await request.post(API_ENDPOINTS.ACTIVITIES.CREATE, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      if (res.success) {
        toast.success(res.message);
        resetForm();
        fetchActivities();
      }
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan kegiatan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
      try {
        const res = await request.delete(API_ENDPOINTS.ACTIVITIES.DELETE(id));
        if (res.success) {
          toast.success(res.message);
          fetchActivities();
        }
      } catch (err) {
        toast.error(err.message || "Gagal menghapus kegiatan.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Action & Filter Bar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="grid md:grid-cols-12 gap-4 items-center">

          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul kegiatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue"
            />
          </div>

          {/* Limit Selection */}
          <div className="md:col-span-3 flex items-center gap-2 text-sm text-slate-500 justify-end md:justify-start">
            <span>Limit:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none"
            >
              <option value={10}>10 data</option>
              <option value={25}>25 data</option>
              <option value={50}>50 data</option>
              <option value={100}>100 data</option>
            </select>
          </div>

          {/* Actions */}
          <div className="md:col-span-4 flex justify-end gap-2">
            <button
              onClick={fetchActivities}
              className="btn-secondary py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={openCreateModal}
              className="btn-primary py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus size={14} /> Tambah Kegiatan
            </button>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <th className="p-4 pl-6">Foto</th>
                <th className="p-4">Judul Kegiatan</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Memuat data...
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">
                    <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
                    Belum ada foto kegiatan.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      {act.image ? (
                        <img
                          src={`https://api.kingcreativestudio.my.id/pmai/uploads/${act.image}`}
                          alt={act.title}
                          className="w-16 h-16 object-cover rounded-xl shadow-sm"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=No+Image"; }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800 text-sm">{act.title}</p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{act.description}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-600">
                        {new Date(act.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(act)}
                          className="p-1.5 text-slate-400 hover:text-pmai-blue hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(act.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        {!isLoading && total > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div>
              Menampilkan {activities.length} dari {total} data
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Prev
              </button>
              <span className="px-3 font-medium text-slate-700">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {editingId ? <Edit size={18} className="text-pmai-blue" /> : <Plus size={18} className="text-pmai-blue" />}
                {editingId ? "Edit Foto Kegiatan" : "Tambah Foto Kegiatan"}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-4">

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Kegiatan <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue"
                  placeholder="Contoh: Rapat Kerja Nasional 2025"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Singkat</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue min-h-[100px]"
                  placeholder="Keterangan foto..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Upload Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pmai-blue/10 file:text-pmai-blue hover:file:bg-pmai-blue/20"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
                  ) : (
                    <><Check size={16} /> Simpan</>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
