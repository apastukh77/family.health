import React from "react";
import { motion } from "framer-motion";
import { PublicLayout } from "../components/layout/PublicLayout";
import { useLang } from "../i18n";

export default function About() {
  const { t } = useLang();
  const stats = [
    { value: "8+", label: t("about_stat_1") },
    { value: "5k+", label: t("about_stat_2") },
    { value: "10+", label: t("about_stat_3") },
  ];

  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-28 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <img
            src="./assets/IMG_3341.webp"
            alt="Soothing massage therapy"
            className="w-full h-[440px] lg:h-[560px] object-cover rounded-[2rem] shadow-[0_20px_60px_rgba(44,61,48,0.12)]"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C17767]">{t("nav_about")}</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#2C3D30] tracking-tight mt-4">{t("about_title")}</h1>
          <p className="mt-6 text-lg text-[#5C6656] leading-relaxed">{t("about_p1")}</p>
          <p className="mt-4 text-lg text-[#5C6656] leading-relaxed">{t("about_p2")}</p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center sm:text-left">
                <p className="font-serif text-4xl text-[#4A5D4E]">{s.value}</p>
                <p className="text-sm text-[#5C6656] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </PublicLayout>
  );
}