import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  Send,
  Instagram,
  MessageCircle,
  Facebook,
} from "lucide-react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { useLang } from "../i18n";
import {
  PHONES_DISPLAY,
  TELEGRAM_URL,
  INSTAGRAM_DIRECT_URL,
  WHATSAPP_URL,
  FACEBOOK_URL,
} from "../lib/constants";

export default function Contact() {
  const { t } = useLang();
  const items = [
    {
      icon: Phone,
      label: t("contact_phone"),
      value: PHONES_DISPLAY.join("\n"),
    },
    {
      icon: MapPin,
      label: t("contact_address"),
      value: t("contact_address_val"),
    },
    { icon: Clock, label: t("contact_hours"), value: t("contact_hours_val") },
  ];

  return (
    <PublicLayout>
      {/* Секция заголовка */}
      <section className="bg-[#F0EBE1] border-b border-[#E2DACD]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-5xl sm:text-6xl font-medium text-[#2C3D30] tracking-tight"
          >
            {t("contact_title")}
          </motion.h1>
          <p className="mt-5 text-lg text-[#5C6656] max-w-2xl mx-auto">
            {t("contact_sub")}
          </p>
        </div>
      </section>

      {/* Основная секция */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-24">
        
        {/* Блок 3-х карточек (телефон, адрес, часы) */}
        <div className="grid gap-8 sm:grid-cols-3 mb-14">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              data-testid={`contact-item-${i}`}
              className="bg-[#F0EBE1] rounded-3xl border border-[#E2DACD] p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[#4A5D4E] text-[#FAF8F5] flex items-center justify-center mb-4">
                <it.icon size={22} />
              </div>
              <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[#5C6656] mb-2">
                {it.label}
              </p>
              <p className="text-[#2C3D30] whitespace-pre-line">{it.value}</p>
            </motion.div>
          ))}
        </div>

        {/* НОВЫЙ БЛОК: Ссылки на мессенджеры и соцсети (вынесен из сетки карточек) */}
        <div className="mt-16 text-center max-w-4xl mx-auto w-full">
          <p className="text-[#5C6656] font-medium text-base mb-6 uppercase tracking-wider">
            {t("contact_social_title")}
          </p>
          
          {/* Сетка для 4-х кнопок: 2х2 на мобильных, в один ряд от sm */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center items-center max-w-3xl mx-auto">
            {/* Кнопка Telegram */}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-telegram-button"
              className="inline-flex items-center gap-2 bg-[#4A5D4E] text-white hover:bg-[#3A4A3D] rounded-full px-4 py-3.5 font-semibold transition-colors justify-center w-full"
            >
              <Send size={18} /> <span>Telegram</span>
            </a>

            {/* Кнопка WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-whatsapp-button"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#20ba5a] rounded-full px-4 py-3.5 font-semibold transition-colors justify-center w-full"
            >
              <MessageCircle size={18} /> <span>WhatsApp</span>
            </a>

            {/* Кнопка Instagram */}
            <a
              href={INSTAGRAM_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-instagram-button"
              className="inline-flex items-center gap-2 bg-[#2C3D30] text-white hover:bg-[#1E2A21] rounded-full px-4 py-3.5 font-semibold transition-colors justify-center w-full"
            >
              <Instagram size={18} /> <span>Instagram</span>
            </a>

            {/* Кнопка Facebook */}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-facebook-button"
              className="inline-flex items-center gap-2 bg-[#1877F2] text-white hover:bg-[#166FE5] rounded-full px-4 py-3.5 font-semibold transition-colors justify-center w-full"
            >
              <Facebook size={18} /> <span>Facebook</span>
            </a>
          </div>
        </div>

        {/* Карта */}
        <div className="mt-14 rounded-[2rem] overflow-hidden border border-[#E2DACD]">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=44.444095,26.14695&z=18&output=embed&iwloc=near"
            className="w-full h-80"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>
    </PublicLayout>
  );
}