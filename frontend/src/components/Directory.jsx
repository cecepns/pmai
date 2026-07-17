import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronsUpDown, Loader2, Info } from "lucide-react";

// Mock database of Master Assessors for interactive directory
const MOCK_ASSESSORS_DB = [
  { id: "MA-001", name: "Dr. H. Anang Kosasih, M.T.", bidang: "Sertifikasi & Lisensi", status: "Aktif", provinsi: "Jawa Barat" },
  { id: "MA-002", name: "Prof. Dr. Rini Setyowati, M.Si.", bidang: "Pendidikan & Pelatihan", status: "Aktif", provinsi: "DKI Jakarta" },
  { id: "MA-003", name: "Ir. Bambang Pamungkas, M.M.", bidang: "Teknik & Rekayasa", status: "Aktif", provinsi: "Banten" },
  { id: "MA-004", name: "Dr. Eko Prasetyo, M.Kom.", bidang: "Teknologi Informasi", status: "Aktif", provinsi: "Jawa Timur" },
  { id: "MA-005", name: "Dian Lestari, S.E., M.B.A.", bidang: "Bisnis & Manajemen", status: "Aktif", provinsi: "Jawa Tengah" },
  { id: "MA-006", name: "Dr. Hendra Wijaya, M.Si.", bidang: "Sosial & Kemasyarakatan", status: "Aktif", provinsi: "Bali" },
  { id: "MA-007", name: "Dr. Maria Ulfa, M.Hum.", bidang: "Pendidikan & Pelatihan", status: "Aktif", provinsi: "Sumatera Utara" },
  { id: "MA-008", name: "Rahmat Hidayat, S.T., M.T.", bidang: "Manufaktur & Industri", status: "Aktif", provinsi: "Jawa Barat" },
  { id: "MA-009", name: "H. Achmad Yani, S.E.", bidang: "Keuangan & Akuntansi", status: "Aktif", provinsi: "DKI Jakarta" },
  { id: "MA-010", name: "Dr. Siti Aminah, M.Pd.", bidang: "Pendidikan & Pelatihan", status: "Aktif", provinsi: "DI Yogyakarta" },
  { id: "MA-011", name: "Taufik Hidayat, S.Kom., M.T.", bidang: "Teknologi Informasi", status: "Aktif", provinsi: "Jawa Barat" },
  { id: "MA-012", name: "Dr. Ir. Gunawan, M.Si.", bidang: "Bisnis & Manajemen", status: "Aktif", provinsi: "Sulawesi Selatan" },
  { id: "MA-013", name: "Rina Amelia, S.E., M.M.", bidang: "Keuangan & Akuntansi", status: "Aktif", provinsi: "Sumatera Selatan" },
  { id: "MA-014", name: "Yusuf Mansur, S.H., M.H.", bidang: "Hukum & Sertifikasi", status: "Aktif", provinsi: "DKI Jakarta" },
  { id: "MA-015", name: "Dr. Antonius Hermawan", bidang: "Kesehatan & Farmasi", status: "Aktif", provinsi: "Jawa Tengah" },
  { id: "MA-016", name: "Farida Ariyani, M.Sc.", bidang: "Teknik & Rekayasa", status: "Aktif", provinsi: "Kalimantan Timur" },
  { id: "MA-017", name: "Dr. Deddy Sukmana, M.Psi.", bidang: "Pendidikan & Pelatihan", status: "Aktif", provinsi: "DKI Jakarta" },
  { id: "MA-018", name: "Ir. Joko Widada, M.T.", bidang: "Manufaktur & Industri", status: "Aktif", provinsi: "Jawa Tengah" },
  { id: "MA-019", name: "Siti Rahmawati, S.E., M.B.A.", bidang: "Bisnis & Manajemen", status: "Aktif", provinsi: "Jawa Barat" },
  { id: "MA-020", name: "Dr. Muhammad Ichsan, Ph.D.", bidang: "Teknologi Informasi", status: "Aktif", provinsi: "DI Yogyakarta" },
];

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedBidang, setSelectedBidang] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc"); // asc / desc
  const [filteredAssessors, setFilteredAssessors] = useState(MOCK_ASSESSORS_DB);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);

  // Realtime Debounce for Directory Search (300ms)
  useEffect(() => {
    setIsLoadingDirectory(true);
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Filtering, Searching, and Sorting
  useEffect(() => {
    let result = [...MOCK_ASSESSORS_DB];

    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.provinsi.toLowerCase().includes(q)
      );
    }

    if (selectedBidang !== "Semua") {
      result = result.filter((item) => item.bidang === selectedBidang);
    }

    result.sort((a, b) => {
      let valA = a[sortField].toLowerCase();
      let valB = b[sortField].toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredAssessors(result);
    setCurrentPage(1);
    setIsLoadingDirectory(false);
  }, [debouncedSearchQuery, selectedBidang, sortField, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssessors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssessors.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById("direktori").scrollIntoView({ behavior: "smooth" });
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <section id="direktori" className="py-24 bg-white animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold text-pmai-blue uppercase tracking-widest">Pencarian Anggota</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Direktori Master Asesor Resmi
          </h3>
          <div className="h-1 w-16 bg-pmai-red mx-auto rounded-full"></div>
          <p className="text-slate-600 text-sm sm:text-base">
            Verifikasi keabsahan lisensi dan kompetensi para Master Asesor terdaftar PMAI di seluruh Indonesia.
          </p>
        </div>

        {/* Search, Filter & Limit Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama asesor, kode reg, atau provinsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue focus:ring-2 focus:ring-pmai-blue/10 transition-all"
              />
            </div>

            {/* Bidang Dropdown filter */}
            <div className="md:col-span-3">
              <select
                value={selectedBidang}
                onChange={(e) => setSelectedBidang(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pmai-blue transition-all"
              >
                <option value="Semua">Semua Bidang Keahlian</option>
                <option value="Sertifikasi & Lisensi">Sertifikasi & Lisensi</option>
                <option value="Pendidikan & Pelatihan">Pendidikan & Pelatihan</option>
                <option value="Teknik & Rekayasa">Teknik & Rekayasa</option>
                <option value="Teknologi Informasi">Teknologi Informasi</option>
                <option value="Bisnis & Manajemen">Bisnis & Manajemen</option>
                <option value="Keuangan & Akuntansi">Keuangan & Akuntansi</option>
              </select>
            </div>

            {/* Items per page Selector */}
            <div className="md:col-span-3 flex items-center justify-end gap-2 text-sm text-slate-600">
              <span>Tampilkan:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-pmai-blue transition-all"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>data</span>
            </div>

          </div>
        </div>

        {/* Table Container */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Registrasi</th>
                  <th 
                    onClick={() => toggleSort("name")}
                    className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Nama Lengkap
                      <ChevronsUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    onClick={() => toggleSort("bidang")}
                    className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Bidang Keahlian
                      <ChevronsUpDown size={14} />
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Provinsi</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingDirectory ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin text-pmai-blue" />
                        <span>Memuat database asesor...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Info size={32} className="text-slate-300" />
                        <span className="font-semibold text-slate-600">Tidak ada data ditemukan</span>
                        <span className="text-xs text-slate-400">Gunakan kata kunci pencarian lain atau pilih filter bidang yang berbeda.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 text-sm font-semibold text-pmai-blue font-mono">{item.id}</td>
                      <td className="p-4 text-sm font-bold text-slate-800">{item.name}</td>
                      <td className="p-4 text-sm text-slate-600">{item.bidang}</td>
                      <td className="p-4 text-sm text-slate-600">{item.provinsi}</td>
                      <td className="p-4 text-sm">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Navigation Footer */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* Total entries summary */}
              <div className="text-sm text-slate-500">
                Menampilkan <span className="font-semibold text-slate-800">{indexOfFirstItem + 1}</span> - <span className="font-semibold text-slate-800">{Math.min(indexOfLastItem, filteredAssessors.length)}</span> dari <span className="font-semibold text-slate-800">{filteredAssessors.length}</span> data
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3.5 py-2 rounded-lg border text-sm font-semibold transition-all ${
                      currentPage === pageNumber
                        ? "bg-pmai-blue border-pmai-blue text-white shadow-sm"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
