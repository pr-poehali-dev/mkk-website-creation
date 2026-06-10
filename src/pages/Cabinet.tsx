import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { Loan, fetchMyLoans, createLoan, updateProfile } from "@/lib/api";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: "На рассмотрении", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { label: "Одобрено", cls: "bg-green-50 text-green-700 border-green-200" },
  rejected: { label: "Отклонено", cls: "bg-red-50 text-red-700 border-red-200" },
};

type Tab = "loans" | "schedule" | "new" | "profile";

export default function Cabinet() {
  const { user, logout, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("loans");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [busy, setBusy] = useState(false);

  // новая заявка
  const [amount, setAmount] = useState(10000);
  const [days, setDays] = useState(7);

  // профиль
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (user && user.role === "admin") navigate("/admin");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setEmail(user.email);
      setCard(user.card_number);
      load();
    }
     
  }, [user]);

  const load = async () => {
    try { setLoans(await fetchMyLoans()); } catch { /* ignore */ }
  };

  const isFirst = days <= 7 && amount <= 30000;
  const rate = isFirst ? 0 : 0.008;
  const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + days);
  const totalPayment = amount + Math.round(amount * rate * days);

  const submitLoan = async () => {
    setBusy(true);
    try {
      await createLoan({ amount, days, total_payment: totalPayment, due_date: dueDate.toISOString().slice(0, 10) });
      await load();
      setTab("loans");
    } finally { setBusy(false); }
  };

  const saveProfile = async () => {
    setBusy(true);
    setSavedMsg("");
    try {
      const u = await updateProfile({ full_name: fullName, email, card_number: card });
      setUser(u);
      setSavedMsg("Сохранено");
    } finally { setBusy(false); }
  };

  if (!user) return null;

  const approved = loans.filter((l) => l.status === "approved");

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "loans", label: "Мои заявки", icon: "FileText" },
    { key: "schedule", label: "График платежей", icon: "Calendar" },
    { key: "new", label: "Новая заявка", icon: "Plus" },
    { key: "profile", label: "Профиль", icon: "User" },
  ];

  return (
    <div className="min-h-screen section-gray font-['Golos_Text']">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 font-bold text-xl">
            <span>Credit</span>
            <span className="relative"><span className="text-red-600">365</span>
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-600" /></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">{user.full_name || user.phone}</span>
            <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600">
              <Icon name="LogOut" size={16} /> Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="card-light p-3 h-fit lg:sticky lg:top-20">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                tab === t.key ? "btn-red" : "text-gray-600 hover:bg-gray-50"
              }`}>
              <Icon name={t.icon} size={18} /> {t.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main>
          {tab === "loans" && (
            <div>
              <h2 className="text-2xl font-bold mb-5">Мои заявки</h2>
              {loans.length === 0 ? (
                <div className="card-light p-10 text-center text-gray-500">
                  <Icon name="Inbox" size={40} className="mx-auto mb-3 text-gray-300" />
                  Заявок пока нет. Оформите первый займ!
                  <div className="mt-4">
                    <button onClick={() => setTab("new")} className="btn-red px-6 py-2.5 rounded-xl font-semibold">Новая заявка</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {loans.map((l) => (
                    <div key={l.id} className="card-light p-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-bold">{l.amount.toLocaleString("ru")} ₽ <span className="text-sm text-gray-400 font-normal">на {l.days} дн.</span></div>
                        <div className="text-sm text-gray-500">К возврату {l.total_payment.toLocaleString("ru")} ₽ · до {l.due_date}</div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_MAP[l.status].cls}`}>
                        {STATUS_MAP[l.status].label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "schedule" && (
            <div>
              <h2 className="text-2xl font-bold mb-5">График платежей</h2>
              {approved.length === 0 ? (
                <div className="card-light p-10 text-center text-gray-500">
                  <Icon name="CalendarOff" size={40} className="mx-auto mb-3 text-gray-300" />
                  Нет одобренных займов с платежами
                </div>
              ) : (
                <div className="space-y-3">
                  {approved.map((l) => (
                    <div key={l.id} className="card-light p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold">Займ №{l.id}</span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">Активен</span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4">
                        <div>
                          <div className="text-sm text-gray-500">Дата платежа</div>
                          <div className="font-semibold">{l.due_date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">К оплате</div>
                          <div className="text-lg font-bold text-red-600">{l.total_payment.toLocaleString("ru")} ₽</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "new" && (
            <div>
              <h2 className="text-2xl font-bold mb-5">Новая заявка</h2>
              <div className="card-light p-7 max-w-lg">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-medium">Сумма</span>
                    <span className="font-bold">{amount.toLocaleString("ru")} ₽</span>
                  </div>
                  <input type="range" min={1000} max={30000} step={500} value={amount}
                    onChange={(e) => setAmount(+e.target.value)}
                    style={{ background: `linear-gradient(to right, #E32636 ${((amount-1000)/290)}%, #e2e8f0 ${((amount-1000)/290)}%)` }}
                    className="w-full" />
                </div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-medium">Срок</span>
                    <span className="font-bold">{days} дней</span>
                  </div>
                  <input type="range" min={7} max={30} step={1} value={days}
                    onChange={(e) => setDays(+e.target.value)}
                    style={{ background: `linear-gradient(to right, #E32636 ${((days-7)/23)*100}%, #e2e8f0 ${((days-7)/23)*100}%)` }}
                    className="w-full" />
                </div>
                <div className="bg-gray-50 rounded-xl px-5 py-4 mb-5 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Вы возвращаете</span><span className="font-bold">{totalPayment.toLocaleString("ru")} ₽</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">До (включительно)</span><span className="font-semibold">{dueDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</span></div>
                  {isFirst && <div className="text-xs text-green-600 font-medium pt-1">🎉 Переплата 0 ₽</div>}
                </div>
                <button onClick={submitLoan} disabled={busy} className="btn-red w-full py-3.5 rounded-xl font-bold text-lg disabled:opacity-60">
                  {busy ? "Отправка..." : "Отправить заявку"}
                </button>
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div>
              <h2 className="text-2xl font-bold mb-5">Профиль</h2>
              <div className="card-light p-7 max-w-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
                  <input value={user.phone} disabled className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Номер карты</label>
                  <input value={card} onChange={(e) => setCard(e.target.value)} placeholder="0000 0000 0000 0000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>
                {savedMsg && <div className="text-sm text-green-600 flex items-center gap-1.5"><Icon name="Check" size={16} /> {savedMsg}</div>}
                <button onClick={saveProfile} disabled={busy} className="btn-red px-8 py-3 rounded-xl font-bold disabled:opacity-60">
                  {busy ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
