import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useLang, serviceName, serviceDesc } from "../i18n";

export const ServiceCard = ({ service, index = 0 }) => {
  const { t, lang } = useLang();
  const name = lang === "uk" ? service.name_uk : service.name_en;
  const desc = lang === "uk" ? service.description_uk : service.description_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      data-testid={`service-card-${service.id}`}
      className="bg-[#F0EBE1] rounded-3xl border border-[#E2DACD] overflow-hidden shadow-[0_8px_30px_rgba(44,61,48,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(44,61,48,0.08)] transition-all duration-300 flex flex-col"
    >
      {service.image_url && (
        <div className="h-52 overflow-hidden">
          <img
            src={service.image_url}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
      <div className="p-7 flex flex-col flex-1">
        <h3 className="font-serif text-2xl text-[#2C3D30] mb-2">{name}</h3>
        <p className="text-[#5C6656] text-sm leading-relaxed flex-1">{desc}</p>
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-[#E2DACD]">
          <span className="flex items-center gap-1.5 text-sm text-[#5C6656]">
            <Clock size={15} /> {service.duration} {t("min")}
          </span>
          <span className="font-serif text-2xl text-[#4A5D4E]">€{service.price}</span>
        </div>
        <Link
          to={`/booking?service=${service.id}`}
          data-testid={`book-service-${service.id}`}
          className="mt-5 text-center bg-[#4A5D4E] text-white hover:bg-[#3A4A3D] rounded-full px-6 py-3 text-sm font-semibold transition-colors"
        >
          {t("book_this")}
        </Link>
      </div>
    </motion.div>
  );
};
