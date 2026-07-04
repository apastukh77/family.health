import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Phone, MapPin, Clock, Facebook, Instagram, Send } from "lucide-react";
import { useLang } from "../../i18n";
import { 
  PHONES_DISPLAY, 
  PHONE_TEL_UA, 
  FACEBOOK_URL, 
  INSTAGRAM_DIRECT_URL, 
  TELEGRAM_URL 
} from "../../lib/constants";

export const Footer = () => {
  const { t } = useLang();
  return (
    <footer data-testid="site-footer" className="bg-[#2C3D30] text-[#E2DACD]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 grid gap-12 md:grid-cols-3">
        {/* КОЛОНКА 1: Логотип, Описание и Соцсети */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo-FamilyHealth.webp"
                alt="Family Health Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-serif text-2xl font-semibold text-[#FAF8F5]">
                Family Health
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#B9C2B3] max-w-xs">
              {t("footer_tagline")}
            </p>
          </div>

          {/* Блок социальных сетей строго по твоим константам */}
          <div className="mt-6 pt-2">
            <p className="text-xs uppercase tracking-widest text-[#B9C2B3]/60 mb-3">
              {t("footer_follow_us") || "Follow us:"}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#B9C2B3] hover:bg-[#FAF8F5] hover:text-[#2C3D30] hover:border-white transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#B9C2B3] hover:bg-[#FAF8F5] hover:text-[#2C3D30] hover:border-white transition-all duration-300 shadow-sm"
                aria-label="Telegram"
              >
                <Send size={16} />
              </a>
              <a
                href={INSTAGRAM_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#B9C2B3] hover:bg-[#FAF8F5] hover:text-[#2C3D30] hover:border-white transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* КОЛОНКА 2: Быстрые ссылки */}
        <div>
          <h4 className="font-serif text-xl text-[#FAF8F5] mb-4">
            {t("footer_quick")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                {t("nav_home")}
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:text-white transition-colors"
              >
                {t("nav_services")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                {t("nav_about")}
              </Link>
            </li>
            <li>
              <Link
                to="/booking"
                className="hover:text-white transition-colors"
              >
                {t("nav_book")}
              </Link>
            </li>
          </ul>
        </div>

        {/* КОЛОНКА 3: Контакты */}
        <div>
          <h4 className="font-serif text-xl text-[#FAF8F5] mb-4">
            {t("footer_contact")}
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5" />
              <a
                href={`tel:${PHONE_TEL_UA}`}
                className="hover:text-white transition-colors whitespace-pre-line"
              >
                {PHONES_DISPLAY.join("\n")}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5" />
              {t("contact_address_val")}
            </li>
            <li className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5" />
              {t("contact_hours_val")}
            </li>
          </ul>
        </div>
      </div>

      {/* НИЖНЯЯ ПАНЕЛЬ */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 text-xs text-[#B9C2B3] flex flex-col sm:flex-row justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Family Health. {t("footer_rights")}
          </span>
          <Link
            to="/admin"
            className="hover:text-white transition-colors"
            data-testid="footer-admin-link"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};