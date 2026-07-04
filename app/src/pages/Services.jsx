import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicLayout } from "../components/layout/PublicLayout";
import { useLang } from "../i18n";
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";

const backgroundImages = {
  manual:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070",
  hardware:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070",
  combo:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070",
};

export default function Services() {
  const { t } = useLang();

  const [activeTab, setActiveTab] = useState("manual");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const tabItems = [
    { id: "manual", labelKey: "services_tab_manual" },
    { id: "hardware", labelKey: "services_tab_hardware" },
    { id: "combo", labelKey: "services_tab_combo" },
  ];

  const categories = {
    manual: [
      { labelKey: "price_title_back", duration: "45", price: "150" },
      { labelKey: "price_title_general", duration: "60", price: "170" },
      { labelKey: "price_title_lymph", duration: "60", price: "170" },
      { labelKey: "price_title_facial", duration: "40", price: "170" },
      { labelKey: "price_title_baby", duration: "30", price: "120" },
      { labelKey: "price_title_taping", duration: "30/45", price: "100 / 150" },
    ],
    hardware: [
      { labelKey: "price_title_anti", duration: "50", price: "170" },
      { labelKey: "price_title_presso", duration: "40", price: "150 / 170" },
      { labelKey: "price_title_myo", duration: "45", price: "150" },
      { labelKey: "price_title_rf", duration: "45", price: "170" },
      { labelKey: "price_title_vacuum", duration: "40", price: "150" },
    ],
    combo: [
      { labelKey: "price_title_face_back", duration: "90", price: "280" },
      { labelKey: "price_title_gen_face", duration: "100", price: "300" },
      { labelKey: "price_title_presso_face", duration: "80", price: "280" },
    ],
  };

  const sanitizePhone = (value) =>
    value.replace(/[^0-9+()\s]/g, "").slice(0, 15);

  const handlePhoneKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Tab",
      "Enter",
      "Escape",
    ];

    if (allowedKeys.includes(e.key)) return;
    if (/^[0-9+()\s]$/.test(e.key)) return;

    e.preventDefault();
  };

  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    setFormData((prev) => ({
      ...prev,
      phone: sanitizePhone(pasted),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData((prev) => ({
        ...prev,
        phone: sanitizePhone(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID;

    // 1. Формируем данные для почты 
    const emailData = new FormData();
    emailData.append(
      "_subject",
      `🎁 [Family Health] Нове замовлення сертифікату — ${formData.name}`,
    );
    emailData.append("name", `👤 ${formData.name}`);
    emailData.append("phone", `📞 ${formData.phone}`);
    emailData.append("message", `📝  ${formData.message || "-"}`);
    emailData.append("_captcha", "false");

    try {
      // Отправка на почту
      await fetch("https://formsubmit.co/ajax/pastukh180587@gmail.com", {
        method: "POST",
        body: emailData, // Без заголовка Content-Type, браузер сам все сделает
      });

      // 2. Отправка в Telegram ( JSON, так как Telegram API его требует)
      if (botToken && chatId) {
        const telegramMessage = `
🎁 *Нове замовлення сертифікату!*
👤 *Ім'я:* ${formData.name}
📞 *Телефон:* ${formData.phone}
📝 *Повідомлення:* ${formData.message || "-"}
        `.trim();

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: "Markdown",
          }),
        });
      }

      setSubmitStatus("success");
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <section className="bg-[#F0EBE1] border-b border-[#E2DACD]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-5xl sm:text-6xl font-medium text-[#2C3D30] tracking-tight"
          >
            {t("services_title")}
          </motion.h1>
          <p className="mt-5 text-lg text-[#5C6656] max-w-2xl mx-auto">
            {t("services_sub")}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-10 pt-16 pb-8">
        <div className="flex justify-center p-1.5 bg-[#F0EBE1]/60 backdrop-blur-sm rounded-2xl border border-[#E2DACD] max-w-xl mx-auto mb-10">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl uppercase tracking-wider transition-all duration-300 relative"
            >
              <span
                className={`relative z-10 ${
                  activeTab === tab.id ? "text-[#FAF8F5]" : "text-[#5C6656]"
                }`}
              >
                {t(tab.labelKey)}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-[#4A5D4E] rounded-xl shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] shadow-lg min-h-[500px] flex flex-col bg-[#FAF8F5]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${backgroundImages[activeTab]})` }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#F0EBE1]/20" />

          <div className="relative p-6 sm:p-10 flex-1 flex flex-col justify-between z-10">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1"
                >
                  {categories[activeTab].map((item, index) => (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`
                        group flex flex-col sm:flex-row sm:items-baseline justify-between
                        p-3 sm:p-4 rounded-2xl transition-all duration-300 gap-2
                        ${
                          hoveredIndex === index
                            ? "bg-white/80 shadow-md scale-[1.01]"
                            : "hover:bg-white/40"
                        }
                      `}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 max-w-xl">
                        <span
                          className={`text-base sm:text-lg font-medium transition-colors duration-300 ${
                            hoveredIndex === index
                              ? "text-[#0A0F0B]"
                              : "text-[#1A281E]"
                          }`}
                        >
                          {t(item.labelKey)}
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#5C6656] bg-[#F0EBE1]/60 px-2 py-0.5 rounded-md border border-[#E2DACD]/60 flex-shrink-0 w-fit">
                          <Clock size={12} className="text-[#4A5D4E]" />
                          {item.duration} {t("services_min_short")}
                        </span>
                      </div>

                      <div className="hidden sm:block flex-grow mx-4 border-b border-dashed border-[#E2DACD] group-hover:border-[#4A5D4E]/40 transition-colors" />

                      <div className="flex-shrink-0 text-left sm:text-right">
                        <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#2C3D30]">
                          {item.price.split(/(\d+)/).map((part, i) => {
                            if (/^\d+$/.test(part)) {
                              return (
                                <span
                                  key={i}
                                  className={`inline-block transition-all duration-300 ${
                                    hoveredIndex === index
                                      ? "scale-110 font-bold"
                                      : ""
                                  }`}
                                  style={{ transformOrigin: "center" }}
                                >
                                  {part}
                                </span>
                              );
                            }
                            return <span key={i}>{part}</span>;
                          })}{" "}
                          {t("currency")}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center flex-shrink-0">
              <p className="text-xs tracking-[0.15em] uppercase text-[#5C6656] font-medium">
                * {t("services_certified_note")}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-2.5 bg-[#4A5D4E] text-[#FAF8F5] hover:bg-[#3A4A3D] rounded-full px-10 py-4 font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Calendar size={20} />
            <span>{t("services_book_btn")}</span>
          </a>
        </motion.div>
      </section>

      <section className="bg-[#FAF8F5] border-t border-[#E2DACD] mt-16 py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col md:flex-row items-center gap-10 bg-white border border-[#E2DACD] p-8 sm:p-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0EBE1]/40 rounded-full blur-2xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />

            <div className="w-full md:w-1/2 overflow-hidden rounded-2xl bg-neutral-50 border border-[#E2DACD]/60 relative aspect-[16/10] flex-shrink-0 flex items-center justify-center p-2 shadow-inner">
              <img
                src="/assets/Sertificate.webp"
                alt="Premium Gift Certificate"
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-102"
              />
            </div>

            <div className="flex-1 text-left relative z-10">
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#2C3D30] tracking-tight">
                {t("services_cert_block_title")}
              </h3>

              <div className="mt-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#C2B299]">
                {t("services_cert_subtitle")}
              </div>

              <p className="mt-5 text-base text-[#5C6656] leading-relaxed font-light">
                {t("services_cert_block_desc")}
              </p>

              <div className="mt-8">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center gap-3 bg-[#2C3D30] text-[#FAF8F5] hover:bg-[#4A5D4E] px-8 py-3.5 rounded-xl text-sm font-medium tracking-widest uppercase transition-all duration-300 shadow-sm group/btn"
                >
                  <span>{t("services_cert_btn") || "Придбати сертифікат"}</span>
                  <ArrowRight
                    size={16}
                    className={`transition-transform duration-300 ${
                      showForm ? "rotate-90" : "group-hover/btn:translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 overflow-hidden"
              >
                <div className="bg-[#FAF8F5] border border-[#E2DACD] rounded-[2.5rem] p-6 sm:p-10 text-center shadow-inner">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2C3D30] mb-6 font-medium">
                    {t("services_form_title")}
                  </h3>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 max-w-2xl mx-auto"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t("form_placeholder_name")}
                        required
                        disabled={isSubmitting}
                        className="w-full bg-white border border-[#E2DACD] rounded-xl px-5 py-4 text-base text-[#1A281E] placeholder-[#B3A288] focus:outline-none focus:border-[#4A5D4E] transition-colors shadow-sm disabled:opacity-50"
                      />

                      <input
                        type="text"
                        inputMode="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onKeyDown={handlePhoneKeyDown}
                        onPaste={handlePhonePaste}
                        placeholder={t("form_placeholder_phone")}
                        required
                        disabled={isSubmitting}
                        className="w-full bg-white border border-[#E2DACD] rounded-xl px-5 py-4 text-base text-[#1A281E] placeholder-[#B3A288] focus:outline-none focus:border-[#4A5D4E] transition-colors shadow-sm disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t("form_placeholder_msg")}
                        rows="3"
                        disabled={isSubmitting}
                        className="w-full bg-white border border-[#E2DACD] rounded-xl px-5 py-4 text-base text-[#1A281E] placeholder-[#B3A288] focus:outline-none focus:border-[#4A5D4E] transition-colors shadow-sm resize-none disabled:opacity-50"
                      ></textarea>
                    </div>

                    <AnimatePresence>
                      {submitStatus === "success" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-xl justify-center text-sm font-medium"
                        >
                          <CheckCircle2 size={18} /> {t("form_submit_success")}
                        </motion.div>
                      )}
                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-red-700 bg-red-50 p-4 rounded-xl justify-center text-sm font-medium"
                        >
                          <AlertCircle size={18} /> {t("form_submit_error")}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-3 bg-[#C2B299] text-white hover:bg-[#B3A288] px-10 py-4 rounded-xl text-base font-medium tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 min-w-[240px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            {t("form_btn_sending")}
                          </>
                        ) : (
                          <>
                            {t("form_btn_send")}
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PublicLayout>
  );
}
