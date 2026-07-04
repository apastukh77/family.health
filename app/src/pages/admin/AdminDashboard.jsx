import React, { useEffect, useState } from "react";
import { Leaf, LogOut, Trash2, Plus, Calendar, ClipboardList, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../i18n";
import { api } from "../../lib/api";

const STATUS_COLORS = {
  pending: "bg-[#C17767]/15 text-[#A85A4D]",
  confirmed: "bg-[#4A5D4E]/15 text-[#4A5D4E]",
  cancelled: "bg-[#5C6656]/15 text-[#5C6656]",
};

const emptyService = { name_en: "", name_uk: "", description_en: "", description_uk: "", duration: 60, price: 0, image_url: "", category: "massage" };

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState("bookings");
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null); // service obj or null
  const [showForm, setShowForm] = useState(false);

  const loadAll = () => {
    api.get("/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/bookings").then((r) => setBookings(r.data)).catch(() => {});
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/bookings/${id}`, { status });
    loadAll();
    toast.success("Updated");
  };
  const delBooking = async (id) => {
    await api.delete(`/bookings/${id}`);
    loadAll();
    toast.success("Deleted");
  };

  const saveService = async (e) => {
    e.preventDefault();
    const payload = { ...editing, duration: Number(editing.duration), price: Number(editing.price), active: true };
    if (editing.id) await api.put(`/services/${editing.id}`, payload);
    else await api.post("/services", payload);
    setShowForm(false); setEditing(null);
    loadAll();
    toast.success("Saved");
  };
  const delService = async (id) => {
    await api.delete(`/services/${id}`);
    loadAll();
    toast.success("Deleted");
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
            <span className="w-9 h-9 rounded-full bg-[#C17767] flex items-center justify-center"><Leaf size={18} /></span>
            <span className="font-serif text-xl font-semibold">Family Health · {t("admin_dashboard")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#B9C2B3] hidden sm:inline">{user?.email}</span>
            <button data-testid="admin-logout-button" onClick={logout} className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors">
              <LogOut size={16} /> {t("admin_logout")}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((s, i) => (
            <div key={i} data-testid={`stat-card-${i}`} className="bg-[#F0EBE1] border border-[#E2DACD] rounded-2xl p-6">
              <p className="font-serif text-4xl text-[#4A5D4E]">{s.value}</p>
              <p className="text-sm text-[#5C6656] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button data-testid="tab-bookings" onClick={() => setTab("bookings")} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${tab === "bookings" ? "bg-[#4A5D4E] text-white" : "bg-[#F0EBE1] text-[#5C6656] border border-[#E2DACD]"}`}>
            <ClipboardList size={16} /> {t("admin_bookings")}
          </button>
          <button data-testid="tab-services" onClick={() => setTab("services")} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${tab === "services" ? "bg-[#4A5D4E] text-white" : "bg-[#F0EBE1] text-[#5C6656] border border-[#E2DACD]"}`}>
            <Calendar size={16} /> {t("admin_services")}
          </button>
        </div>

        {tab === "bookings" && (
          <div data-testid="bookings-table" className="bg-[#F0EBE1] border border-[#E2DACD] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#E7E0D3] text-[#5C6656]">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">Name</th>
                    <th className="text-left px-5 py-3 font-semibold">Phone</th>
                    <th className="text-left px-5 py-3 font-semibold">Service</th>
                    <th className="text-left px-5 py-3 font-semibold">Date</th>
                    <th className="text-left px-5 py-3 font-semibold">Time</th>
                    <th className="text-left px-5 py-3 font-semibold">Status</th>
                    <th className="text-right px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-[#5C6656]">No bookings yet.</td></tr>
                  )}
                  {bookings.map((b) => (
                    <tr key={b.id} data-testid={`booking-row-${b.id}`} className="border-t border-[#E2DACD]">
                      <td className="px-5 py-3 text-[#2C3D30] font-medium">{b.name}</td>
                      <td className="px-5 py-3 text-[#5C6656]">{b.phone}</td>
                      <td className="px-5 py-3 text-[#5C6656]">{b.service_name}</td>
                      <td className="px-5 py-3 text-[#5C6656]">{b.date}</td>
                      <td className="px-5 py-3 text-[#5C6656]">{b.time}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <select data-testid={`booking-status-${b.id}`} value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className="bg-white border border-[#E2DACD] rounded-lg px-2 py-1 text-xs">
                            <option value="pending">pending</option>
                            <option value="confirmed">confirmed</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                          <button data-testid={`delete-booking-${b.id}`} onClick={() => delBooking(b.id)} className="text-[#A85A4D] hover:bg-[#A85A4D]/10 rounded-lg p-1.5 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "services" && (
          <div>
            <div className="flex justify-end mb-5">
              <button data-testid="add-service-button" onClick={() => { setEditing({ ...emptyService }); setShowForm(true); }} className="flex items-center gap-2 bg-[#4A5D4E] text-white hover:bg-[#3A4A3D] rounded-full px-5 py-2.5 text-sm font-semibold transition-colors">
                <Plus size={16} /> Add Service
              </button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="admin-services-grid">
              {services.map((s) => (
                <div key={s.id} data-testid={`admin-service-${s.id}`} className="bg-[#F0EBE1] border border-[#E2DACD] rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif text-xl text-[#2C3D30]">{s.name_en}</h4>
                    <div className="flex gap-1">
                      <button data-testid={`edit-service-${s.id}`} onClick={() => { setEditing(s); setShowForm(true); }} className="text-[#4A5D4E] hover:bg-[#4A5D4E]/10 rounded-lg p-1.5"><Pencil size={15} /></button>
                      <button data-testid={`delete-service-${s.id}`} onClick={() => delService(s.id)} className="text-[#A85A4D] hover:bg-[#A85A4D]/10 rounded-lg p-1.5"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <p className="text-sm text-[#5C6656] mt-1">{s.name_uk}</p>
                  <p className="text-sm text-[#5C6656] mt-3">{s.duration} {t("min")} · €{s.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Service form modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={saveService} data-testid="service-form" className="bg-[#FAF8F5] rounded-3xl w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-serif text-2xl text-[#2C3D30]">{editing.id ? "Edit" : "New"} Service</h3>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-[#5C6656] hover:text-[#2C3D30]"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input data-testid="service-name-en" placeholder="Name (EN)" className={inputCls} value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} required />
                <input data-testid="service-name-uk" placeholder="Name (UA)" className={inputCls} value={editing.name_uk} onChange={(e) => setEditing({ ...editing, name_uk: e.target.value })} required />
              </div>
              <textarea placeholder="Description (EN)" rows={2} className={inputCls} value={editing.description_en} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
              <textarea placeholder="Description (UA)" rows={2} className={inputCls} value={editing.description_uk} onChange={(e) => setEditing({ ...editing, description_uk: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input data-testid="service-duration" type="number" placeholder="Duration (min)" className={inputCls} value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} />
                <input data-testid="service-price" type="number" placeholder="Price (€)" className={inputCls} value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
              </div>
              <input data-testid="service-image" placeholder="Image URL" className={inputCls} value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
            </div>
            <button data-testid="save-service-button" type="submit" className="w-full mt-6 bg-[#4A5D4E] text-white hover:bg-[#3A4A3D] rounded-full px-8 py-3 font-semibold transition-colors">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}
