import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { useLang, serviceName } from "../i18n";
import { api } from "../lib/api";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export default function Booking() {
  const { t, lang } = useLang();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "", phone: "", email: "", service_id: "", date: "", time: "", notes: "",
  });

  useEffect(() => {
    api.get("/services").then((r) => {
      setServices(r.data);
      const pre = params.get("service");
      if (pre && r.data.some((s) => s.id === pre)) {
        setForm((f) => ({ ...f, service_id: pre }));
      }
    }).catch(() => {});
  }, [params]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service_id || !form.date || !form.time) {
      toast.error(t("form_error"));
      return;
    }
    setLoading(true);
    const svc = services.find((s) => s.id === form.service_id);
    try {
      await api.post("/bookings", {
        ...form,
        service_name: svc ? svc.name_en : "",
      });
      setSubmitted(true);
      toast.success(t("form_success"));
    } catch {
      toast.error(t("form_error"));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white/60 border border-[#E2DACD] rounded-xl px-4 py-3 text-[#2C3D30] placeholder-[#9aa394] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E] focus:border-transparent transition-shadow";

  return (
    <PublicLayout>
      <section className="relative max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
        {/* Кнопка Назад приведена к общему круглому стилю */}
        {!submitted && (
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-4 left-6 sm:left-10 flex items-center justify-center w-8 h-8 rounded-full border border-[#E2DACD] text-[#5C6656] hover:text-[#2C3D30] hover:bg-[#F0EBE1] transition-all group"
            title="Назад"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}

        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl sm:text-6xl font-medium text-[#2C3D30] tracking-tight">{t("booking_title")}</h1>
          <p className="mt-4 text-lg text-[#5C6656]">{t("booking_sub")}</p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-testid="booking-success"
            className="bg-[#F0EBE1] border border-[#E2DACD] rounded-3xl p-12 text-center"
          >
            <CheckCircle2 size={56} className="mx-auto text-[#4A5D4E] mb-5" />
            <p className="text-lg text-[#2C3D30]">{t("form_success")}</p>
          </motion.div>
        ) : (
          <form onSubmit={submit} data-testid="booking-form" className="bg-[#F0EBE1] border border-[#E2DACD] rounded-3xl p-7 sm:p-10 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#5C6656] mb-2">{t("form_name")}</label>
                <input data-testid="booking-name" className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5C6656] mb-2">{t("form_phone")}</label>
                <input data-testid="booking-phone" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5C6656] mb-2">{t("form_email")}</label>
              <input data-testid="booking-email" type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5C6656] mb-2">{t("form_service")}</label>
              <select data-testid="booking-service" className={inputCls} value={form.service_id} onChange={(e) => set("service_id", e.target.value)} required>
                <option value="">—</option>
                 {services.map((s) => {
                  const label = `${serviceName(s, lang)} · €${s.price}`;
                  return (
                    <option key={s.id} value={s.id}>{label}</option>
                  );
                })}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#5C6656] mb-2">{t("form_date")}</label>
                <input data-testid="booking-date" type="date" min={today} className={inputCls} value={form.date} onChange={(e) => set("date", e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5C6656] mb-2">{t("form_time")}</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      data-testid={`time-slot-${slot}`}
                      onClick={() => set("time", slot)}
                      className={`rounded-lg py-2 text-sm font-medium transition-colors border ${
                        form.time === slot
                          ? "bg-[#4A5D4E] text-white border-[#4A5D4E]"
                          : "bg-white/60 text-[#5C6656] border-[#E2DACD] hover:border-[#4A5D4E]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5C6656] mb-2">{t("form_notes")}</label>
              <textarea data-testid="booking-notes" rows={3} className={inputCls} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="booking-submit-button"
              className="w-full bg-[#4A5D4E] text-white hover:bg-[#3A4A3D] rounded-full px-8 py-4 font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? "..." : t("form_submit")}
            </button>
          </form>
        )}
      </section>
    </PublicLayout>
  );
}