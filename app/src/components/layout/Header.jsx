import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Facebook, Instagram, Send } from "lucide-react";
import { useLang, LANG_LABELS } from "../../i18n";
import { 
  FACEBOOK_URL, 
  INSTAGRAM_DIRECT_URL, 
  TELEGRAM_URL 
} from "../../lib/constants";

export const Header = () => {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/services", label: t("nav_services") },
    { to: "/about", label: t("nav_about") },
    { to: "/contact", label: t("nav_contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/85 backdrop-blur-xl border-b border-[#E2DACD]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo-FamilyHealth.webp"
            alt="Family Health Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="font-serif text-2xl font-semibold text-[#2C3D30] tracking-tight">
            Family Health
          </span>
        </Link>

        {/* Навигация (десктоп) с плавной и аккуратной линией */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm pb-2 transition-all duration-300 font-medium group/link ${
                  isActive 
                    ? "text-[#2C3D30] font-semibold" 
                    : "text-[#5C6656] hover:text-[#2C3D30]"
                }`}
              >
                {link.label}
                {/* Анимированная линия: теперь она ближе к тексту и плавно расширяется */}
                <span 
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#4A5D4E] rounded-full transition-all duration-300 origin-center ${
                    isActive 
                      ? "w-full scale-x-100 opacity-100" 
                      : "w-full scale-x-0 opacity-0 group-hover/link:scale-x-50 group-hover/link:opacity-50"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Правая часть: Соцсети + Язык + Кнопка */}
        <div className="flex items-center gap-4">
          
          {/* Блок социальных сетей (десктоп) */}
          <div className="hidden lg:flex items-center gap-3 border-r border-[#E2DACD] pr-4">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5C6656] hover:text-[#4A5D4E] transition-transform duration-300 hover:scale-110 p-1"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5C6656] hover:text-[#4A5D4E] transition-transform duration-300 hover:scale-110 p-1"
              aria-label="Telegram"
            >
              <Send size={18} />
            </a>
            <a
              href={INSTAGRAM_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5C6656] hover:text-[#4A5D4E] transition-transform duration-300 hover:scale-110 p-1"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>

          {/* Переключатель языка */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="text-sm font-semibold text-[#5C6656] border border-[#E2DACD] rounded-full px-4 py-1.5 hover:border-[#4A5D4E] transition-colors flex items-center gap-1"
            >
              {LANG_LABELS[lang]}
              <span className="text-[10px]">▼</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 py-2 w-20 bg-[#FAF8F5] border border-[#E2DACD] rounded-xl shadow-xl z-50">
                {Object.entries(LANG_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setLang(key);
                      setIsLangOpen(false);
                    }}
                    className="block w-full text-center px-4 py-2 text-sm text-[#5C6656] hover:bg-[#E2DACD]/30 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка записи */}
          <Link
            to="/booking"
            className="hidden sm:inline-flex items-center justify-center min-w-[170px] bg-[#4A5D4E] text-white hover:bg-[#3A4A3D] rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
          >
            {t("nav_book")}
          </Link>

          {/* Мобильный триггер */}
          <button className="md:hidden text-[#2C3D30]" onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E2DACD] px-6 py-4 space-y-4">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block text-lg transition-colors ${
                  isActive 
                    ? "text-[#2C3D30] font-bold border-l-4 border-[#4A5D4E] pl-2" 
                    : "text-[#5C6656] pl-3"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          {/* Дублирование соцсетей в мобильном меню */}
          <div className="flex items-center gap-5 pt-2 border-t border-[#E2DACD]/60">
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-[#5C6656] transition-transform duration-300 hover:scale-110">
              <Facebook size={20} />
            </a>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#5C6656] transition-transform duration-300 hover:scale-110">
              <Send size={20} />
            </a>
            <a href={INSTAGRAM_DIRECT_URL} target="_blank" rel="noopener noreferrer" className="text-[#5C6656] transition-transform duration-300 hover:scale-110">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};