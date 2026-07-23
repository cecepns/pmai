import React, { useState, useEffect } from "react";
import { request } from "../utils/request";
import { API_ENDPOINTS } from "../utils/endpoints";
import { Loader2, Image as ImageIcon } from "lucide-react";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch up to 9 recent activities for the landing page
        const res = await request.get(API_ENDPOINTS.ACTIVITIES.LIST, { limit: 9, page: 1 });
        if (res.success) {
          setActivities(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat foto kegiatan", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <section id="kegiatan" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-pmai-blue/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[800px] h-[800px] bg-pmai-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-sm font-extrabold text-pmai-blue tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-pmai-blue rounded-full"></span>
            Galeri Kami
            <span className="w-8 h-[2px] bg-pmai-blue rounded-full"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Foto <span className="text-transparent bg-clip-text bg-gradient-to-r from-pmai-blue to-pmai-blue/70">Kegiatan</span>
          </h3>
          <p className="text-lg text-slate-600 font-medium">
            Dokumentasi berbagai program, rapat kerja, dan pelatihan yang diselenggarakan oleh Perkumpulan Master Asesor Indonesia (PMAI).
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-semibold">Memuat galeri...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-3xl border border-slate-100">
            <ImageIcon size={64} className="mb-4 opacity-50" />
            <p className="font-semibold text-lg text-slate-500">Belum ada foto kegiatan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((act, index) => (
              <div
                key={act.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {act.image ? (
                    <img
                      src={`https://api.kingcreativestudio.my.id/pmai/uploads/${act.image}`}
                      alt={act.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/600x450?text=PMAI+Kegiatan"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-slate-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content Container */}
                <div className="p-8 flex-grow flex flex-col justify-center">
                  <div className="text-xs font-bold text-pmai-blue mb-3 uppercase tracking-wider">
                    {new Date(act.created_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-pmai-blue transition-colors duration-300">
                    {act.title}
                  </h4>
                  {act.description && (
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {act.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
