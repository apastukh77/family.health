import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, HeartHandshake, Flower2, ArrowRight } from "lucide-react";
import { PublicLayout, Marquee } from "../components/layout/PublicLayout";
import { ServiceCard } from "../components/ServiceCard";
import { useLang } from "../i18n";
import { api } from "../lib/api";

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Home() {
  const { t } = useLang();
  const [services, setServices] = useState([]);

  const partners = [
    { 
      name: "Pastukh Studio", 
      logo: "/assets/partners/pastukh-studio-og-image.webp", 
      url: "https://pastukh-studio.vercel.app/" 
    },
    // { 
    //   name: "Partner 2", 
    //   logo: "/assets/partners/logo2.webp", 
    //   url: "https://ссылка-на-второго-партнера.com" 
    // },
   
  ];
  
  useEffect(() => {
    api
      .get("/services")
      .then((r) => {
        const data = r.data;
        // Защита: проверяем, массив ли это. Если ответ объекта — ищем вложенный массив.
        if (Array.isArray(data)) {
          setServices(data);
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray(data.services)
        ) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      })
      .catch((err) => {
        console.error("Ошибка API:", err);
        setServices([]);
      });
  }, []);

  const reasons = [
    { icon: Sparkles, title: t("why_1_title"), text: t("why_1_text") },
    { icon: Flower2, title: t("why_2_title"), text: t("why_2_text") },
    { icon: HeartHandshake, title: t("why_3_title"), text: t("why_3_text") },
  ];

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[#C17767] mb-5">
              {t("hero_eyebrow")}
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] text-[#2C3D30] tracking-tight">
              {t("hero_title")}
            </h1>
            <p className="mt-6 text-lg text-[#5C6656] leading-relaxed max-w-xl">
              {t("hero_sub")}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/booking"
                data-testid="hero-book-button"
                className="inline-flex items-center gap-2 bg-[#4A5D4E] text-white hover:bg-[#3A4A3D] rounded-full px-8 py-4 font-semibold transition-colors"
              >
                {t("hero_cta")} <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                data-testid="hero-services-button"
                className="inline-flex items-center border border-[#4A5D4E] text-[#4A5D4E] hover:bg-[#4A5D4E] hover:text-white rounded-full px-8 py-4 font-semibold transition-colors"
              >
                {t("hero_secondary")}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <img
              src="./assets/IMG_3340.webp"
              alt="Relaxing massage session"
              className="w-full h-[420px] lg:h-[560px] object-cover rounded-[2rem] shadow-[0_20px_60px_rgba(44,61,48,0.15)]"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#FAF8F5] border border-[#E2DACD] rounded-3xl px-7 py-5 shadow-lg hidden sm:block">
              <p className="font-serif text-3xl text-[#4A5D4E]">8+</p>
              <p className="text-xs text-[#5C6656] tracking-wide">
                {t("about_stat_1")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Marquee text={t("marquee")} />

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <motion.div
          {...fade}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#2C3D30] tracking-tight">
            {t("services_title")}
          </h2>
          <p className="mt-4 text-lg text-[#5C6656]">{t("services_sub")}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {Array.isArray(services) && services.length > 0 ? (
            services.map((s, i) => (
              <ServiceCard key={s.id || i} service={s} index={i} />
            ))
          ) : (
            <p className="col-span-3 text-center text-[#5C6656]">
              {t("services_unavailable")}
            </p>
          )}
        </div>

        <motion.div
          {...fade}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-md h-[280px] sm:h-[360px] w-full flex flex-col justify-center items-center p-8 group cursor-pointer border border-[#E2DACD]/50 mt-12"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
          >
            <source
              src="/videos/Give_love_and_care_to_your_body.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px] transition-colors duration-500 group-hover:bg-black/45" />
          <div className="relative z-10 w-full max-w-xs sm:max-w-md text-center px-4">
            <Link
              to="/services"
              data-testid="home-view-all-services"
              className="inline-flex items-center justify-center gap-3 w-full bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full px-8 py-4 font-semibold text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-[#2C3D30] hover:border-white shadow-[inset_0_1px_12px_rgba(255,255,255,0.15)] hover:shadow-xl hover:scale-102"
            >
              <span>{t("services_view_all")}</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* PARTNERS */}
      <section className="py-20 border-t border-[#E2DACD]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#2C3D30] tracking-tight mb-16">
            {t("partners_title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
            {partners.map((p, i) => (
              <a 
                key={i} 
                href={p.url}
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex justify-center transition-transform hover:scale-110"
              >
                <img 
                  src={p.logo} 
                  alt={p.name} 
                  className="h-20 w-auto object-contain" 
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-[#F0EBE1] border-y border-[#E2DACD]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <motion.h2
            {...fade}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl sm:text-5xl font-medium text-[#2C3D30] tracking-tight text-center mb-16"
          >
            {t("why_title")}
          </motion.h2>
          <div className="grid gap-10 md:grid-cols-3">
            {reasons.map((r, i) => (
              <motion.div
                key={i}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#4A5D4E] text-[#FAF8F5] flex items-center justify-center mb-5">
                  <r.icon size={26} />
                </div>
                <h3 className="font-serif text-2xl text-[#2C3D30] mb-2">
                  {r.title}
                </h3>
                <p className="text-[#5C6656] leading-relaxed">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <motion.div
          {...fade}
          transition={{ duration: 0.6 }}
          className="bg-[#4A5D4E] rounded-[2.5rem] px-8 sm:px-16 py-16 text-center"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#FAF8F5] tracking-tight">
            {t("hero_cta")}
          </h2>
          <p className="mt-4 text-[#D6DDD2] max-w-xl mx-auto">
            {t("hero_sub")}
          </p>
          <Link
            to="/booking"
            data-testid="cta-book-button"
            className="inline-flex items-center gap-2 mt-8 bg-[#FAF8F5] text-[#2C3D30] hover:bg-white rounded-full px-8 py-4 font-semibold transition-colors"
          >
            {t("nav_book")} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </PublicLayout>
  );
}
