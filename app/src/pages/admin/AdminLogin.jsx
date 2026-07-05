import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react"; // Добавили Eye и EyeOff
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../i18n";

function formatErr(detail) {
  if (!detail) return "Login failed";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e.msg || JSON.stringify(e)).join(" ");
  return String(detail);
}

export default function AdminLogin() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Состояние для переключения видимости
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatErr(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white border border-[#E2DACD] rounded-xl px-4 py-3 text-[#2C3D30] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E] transition-shadow";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-6">
      <form onSubmit={submit} data-testid="admin-login-form" className="relative w-full max-w-md bg-[#F0EBE1] border border-[#E2DACD] rounded-3xl p-9 shadow-[0_12px_40px_rgba(44,61,48,0.08)]">
        
        {/* Кнопка Назад */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 flex items-center justify-center w-8 h-8 rounded-full border border-[#E2DACD] text-[#5C6656] hover:text-[#2C3D30] hover:bg-[#FAF8F5] transition-all group"
          title="Назад"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        </Link>

        {/* Блок логотипа */}
        <div className="flex items-center gap-2 justify-center mb-8 mt-4">
          <img
            src="/logo-FamilyHealth.webp"
            alt="Family Health Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="font-serif text-2xl font-semibold text-[#2C3D30] tracking-tight">
            Family Health
          </span>
        </div>
        
        <h1 className="font-serif text-3xl text-[#2C3D30] text-center mb-6">{t("admin_login_title")}</h1>

        {error && <p data-testid="admin-login-error" className="bg-[#A85A4D]/10 text-[#A85A4D] text-sm rounded-xl px-4 py-3 mb-4">{error}</p>}

        <label className="block text-sm font-semibold text-[#5C6656] mb-2">{t("admin_email")}</label>
        <input data-testid="admin-login-input-email" type="email" className={inputCls + " mb-4"} value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label className="block text-sm font-semibold text-[#5C6656] mb-2">{t("admin_password")}</label>
        {/* Обертка для пароля */}
        <div className="relative mb-6">
          <input 
            data-testid="admin-login-input-password" 
            type={showPassword ? "text" : "password"} 
            className={inputCls + " pr-12"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6656] hover:text-[#2C3D30]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button data-testid="admin-login-submit" type="submit" disabled={loading} className="w-full bg-[#4A5D4E] text-white hover:bg-[#3A4A3D] rounded-full px-8 py-3.5 font-semibold transition-colors disabled:opacity-60">
          {loading ? "..." : t("admin_signin")}
        </button>
      </form>
    </div>
  );
}