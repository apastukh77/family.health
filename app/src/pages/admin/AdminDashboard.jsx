import React, { useEffect, useState } from "react";
import {
  LogOut,
  Trash2,
  Plus,
  Calendar,
  ClipboardList,
  Pencil,
  X,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../i18n";
import { api } from "../../lib/api";

const STATUS_COLORS = {
  pending: "bg-[#C17767]/15 text-[#A85A4D]",
  confirmed: "bg-[#4A5D4E]/15 text-[#4A5D4E]",
  cancelled: "bg-[#5C6656]/15 text-[#5C6656]",
};

const emptyService = {
  name_en: "",
  name_uk: "",
  name_ro: "",
  description_en: "",
  description_uk: "",
  description_ro: "",
  duration: "60",
  price: "",
  image_url: "",
  category: "massage",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const [tab, setTab] = useState("bookings");
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "" });

  const loadAll = () => {
    api.get("/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/bookings").then((r) => setBookings(r.data)).catch(() => {});
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "mp4", "mov"];
    const fileExt = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      toast.error("Неподдерживаемый формат! Используйте jpg, png, mp4 или mov.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditing({ ...editing, image_url: res.data.url });
      toast.success("Файл успешно загружен");
    } catch (err) {
      toast.error("Ошибка при загрузке файла");
    }
  };

  const saveService = async (e) => {
    e.preventDefault();
    const payload = {
      ...editing,
      name_en: editing.name_en || "",
      name_uk: editing.name_uk || "",
      name_ro: editing.name_ro || "",
      duration: String(editing.duration),
      price: String(editing.price),
      active: true,
    };

    if (editing.id) await api.put(`/services/${editing.id}`, payload);
    else await api.post("/services", payload);

    setShowForm(false);
    setEditing(null);
    loadAll();
    toast.success(t("saved"));
  };

  const updateStatus = async (id, status) => { 
    await api.patch(`/bookings/${id}`, { status }); 
    loadAll(); 
    toast.success(t("status_updated")); 
  };
  
  const delBooking = async (id) => { 
    await api.delete(`/bookings/${id}`); 
    loadAll(); 
    toast.success(t("deleted")); 
  };
  
  const delService = async (id) => { 
    await api.delete(`/services/${id}`); 
    loadAll(); 
    toast.success(t("deleted")); 
  };
  
  const changePassword = async () => {
    try {
      await api.post("/auth/change-password", passwords);
      toast.success(t("password_updated"));
      setShowPasswordModal(false);
      setPasswords({ old: "", new: "" });
    } catch { 
      toast.error(t("failed_to_change_password")); 
    }
  };

  const statCards = stats ? [
    { label: t("admin_total"), value: stats.total_bookings },
    { label: t("admin_pending"), value: stats.pending },
    { label: t("admin_confirmed"), value: stats.confirmed },
    { label: t("admin_services_count"), value: stats.services },
  ] : [];

  const inputCls = "w-full bg-white border border-[#E2DACD] rounded-xl px-3 py-2 text-sm text-[#2C3D30] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]";

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <header className="bg-[#2C3D30] text-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-FamilyHealth.webp" alt="Logo" className="w-9 h-9 object-contain" />
            <span className="font-serif text-xl font-semibold">Family Health · {t("admin_dashboard")}</span>
          </div>
          <div className="flex items-center gap-3">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-white rounded-full px-3 py-1.5 text-xs text-[#2C3D30] border-none cursor-pointer font-medium">
              <option value="en">EN</option>
              <option value="ro">RO</option>
              <option value="uk">UK</option>
            </select>
            <button onClick={() => setShowPasswordModal(true)} className="flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors">
              <Key size={14} /> {t("admin_password")}
            </button>
            <button onClick={logout} className="flex items-center gap-2 text-sm bg-[#C17767] hover:bg-[#A85A4D] rounded-full px-4 py-2 transition-colors">
              <LogOut size={16} /> {t("admin_logout")}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((s, i) => (
            <div key={i} className="bg-[#F0EBE1] border border-[#E2DACD] rounded-2xl p-6">
              <p className="font-serif text-4xl text-[#4A5D4E]">{s.value}</p>
              <p className="text-sm text-[#5C6656] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("bookings")} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${tab === "bookings" ? "bg-[#4A5D4E] text-white" : "bg-[#F0EBE1] text-[#5C6656] border border-[#E2DACD]"}`}>
            <ClipboardList size={16} /> {t("admin_bookings")}
          </button>
          <button onClick={() => setTab("services")} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${tab === "services" ? "bg-[#4A5D4E] text-white" : "bg-[#F0EBE1] text-[#5C6656] border border-[#E2DACD]"}`}>
            <Calendar size={16} /> {t("admin_services")}
          </button>
        </div>

        {tab === "bookings" && (
          <div className="bg-[#F0EBE1] border border-[#E2DACD] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#E7E0D3] text-[#5C6656]">
                <tr>
                  <th className="text-left px-5 py-3">{t("admin_name")}</th>
                  <th className="text-left px-5 py-3">{t("admin_phone")}</th>
                  <th className="text-left px-5 py-3">{t("admin_service")}</th>
                  <th className="text-left px-5 py-3">{t("admin_date")}</th>
                  <th className="text-left px-5 py-3">Time</th>
                  <th className="text-left px-5 py-3">Notes</th>
                  <th className="text-left px-5 py-3">{t("admin_status")}</th>
                  <th className="text-right px-5 py-3">{t("admin_actions")}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-[#E2DACD]">
                    <td className="px-5 py-3">{b.name}</td>
                    <td className="px-5 py-3">{b.phone}</td>
                    <td className="px-5 py-3">{b.service_name}</td>
                    <td className="px-5 py-3">{b.date}</td>
                    <td className="px-5 py-3">{b.time}</td>
                    <td className="px-5 py-3">{b.notes || "-"}</td>
                    <td className="px-5 py-3">
                      <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className="bg-white border rounded px-2 py-1">
                        <option value="pending">{t("status_pending")}</option>
                        <option value="confirmed">{t("status_confirmed")}</option>
                        <option value="cancelled">{t("status_cancelled")}</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => delBooking(b.id)} className="text-[#A85A4D]"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "services" && (
          <div>
            <div className="flex justify-end mb-5">
              <button onClick={() => { setEditing({ ...emptyService }); setShowForm(true); }} className="flex items-center gap-2 bg-[#4A5D4E] text-white rounded-full px-5 py-2.5 text-sm font-semibold">
                <Plus size={16} /> {t("admin_add_service")}
              </button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={s.id} className="bg-[#F0EBE1] border border-[#E2DACD] rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif text-xl">{lang === "uk" ? s.name_uk : lang === "ro" ? s.name_ro : s.name_en}</h4>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditing(s); setShowForm(true); }}><Pencil size={15} /></button>
                      <button onClick={() => delService(s.id)} className="text-[#A85A4D]"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <p className="text-sm mt-3">{s.duration} {t("min")} · {s.price} RON</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={saveService} className="bg-[#FAF8F5] rounded-3xl w-full max-w-lg p-7">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-2xl">{editing.id ? t("admin_edit_service") : t("admin_add_service")}</h3>
              <button type="button" onClick={() => setShowForm(false)}><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <input placeholder={t("name_en")} className={inputCls} value={editing.name_en || ""} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
              <input placeholder={t("name_uk")} className={inputCls} value={editing.name_uk || ""} onChange={(e) => setEditing({ ...editing, name_uk: e.target.value })} />
              <input placeholder={t("name_ro")} className={inputCls} value={editing.name_ro || ""} onChange={(e) => setEditing({ ...editing, name_ro: e.target.value })} />
              <input type="text" placeholder={t("duration_min")} className={inputCls} value={editing.duration || ""} onChange={(e) => setEditing({ ...editing, duration: String(e.target.value) })} />
              <input type="text" placeholder={t("price")} className={inputCls} value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: String(e.target.value) })} />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-[#5C6656] mb-1">Изображение/Видео</label>
              <input type="file" onChange={handleFileUpload} className="w-full text-sm text-[#5C6656] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#E2DACD] hover:file:bg-[#D4CDBE]" />
              {editing.image_url && (
                <div className="mt-3 p-2 bg-[#E7E0D3] rounded-xl overflow-hidden">
                  {editing.image_url.toLowerCase().endsWith(".mp4") || editing.image_url.toLowerCase().endsWith(".mov") ? (
                    <video src={editing.image_url} controls className="w-full rounded-lg" />
                  ) : (
                    <img src={editing.image_url} alt="Preview" className="w-full rounded-lg" />
                  )}
                </div>
              )}
            </div>
            <button type="submit" className="w-full mt-6 bg-[#4A5D4E] text-white rounded-full py-3">
              {t("admin_save")}
            </button>
          </form>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl w-full max-w-sm p-7">
            <h3 className="font-serif text-xl mb-4">{t("admin_change_password")}</h3>
            <div className="relative mb-3">
              <input type={showPass ? "text" : "password"} placeholder={t("old_password")} className={inputCls} onChange={(e) => setPasswords({ ...passwords, old: e.target.value })} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-[#5C6656] hover:text-[#2C3D30]">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative mb-4">
              <input type={showPass ? "text" : "password"} placeholder={t("new_password")} className={inputCls} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-[#5C6656] hover:text-[#2C3D30]">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-2 rounded-full border">{t("admin_cancel")}</button>
              <button onClick={changePassword} className="flex-1 py-2 rounded-full bg-[#4A5D4E] text-white">{t("admin_save")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}