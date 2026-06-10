import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { login, register } from "@/lib/api";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = mode === "login"
        ? await login(phone.trim(), password)
        : await register(phone.trim(), password, fullName.trim());
      loginUser(res.token, res.user);
      navigate(res.user.role === "admin" ? "/admin" : "/cabinet");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen section-gray flex flex-col font-['Golos_Text']">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center">
          <Link to="/" className="flex items-center gap-1.5 font-bold text-xl text-gray-900">
            <span>Credit</span>
            <span className="relative">
              <span className="text-red-600">365</span>
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-600" />
            </span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="card-light p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-1 text-center">
            {mode === "login" ? "Вход в кабинет" : "Регистрация"}
          </h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            {mode === "login" ? "Введите телефон и пароль" : "Создайте личный кабинет за минуту"}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Иван Иванов"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <Icon name="AlertCircle" size={16} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-red w-full py-3.5 rounded-xl font-bold text-lg disabled:opacity-60">
              {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>

          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="mt-5 w-full text-center text-sm text-gray-500 hover:text-red-600 transition-colors">
            {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}
