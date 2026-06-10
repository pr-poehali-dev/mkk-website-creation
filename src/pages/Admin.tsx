import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { Loan, fetchAllLoans, setLoanStatus } from "@/lib/api";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: "На рассмотрении", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { label: "Одобрено", cls: "bg-green-50 text-green-700 border-green-200" },
  rejected: { label: "Отклонено", cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function Admin() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stats, setStats] = useState<Record<string, { count: number; sum: number }>>({});
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Loan | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => { if (user?.role === "admin") load(); }, [user]);

  const load = async () => {
    try {
      const data = await fetchAllLoans();
      setLoans(data.loans);
      setStats(data.stats);
    } catch { /* ignore */ }
  };

  const changeStatus = async (id: number, status: "approved" | "rejected") => {
    await setLoanStatus(id, status);
    await load();
    setSelected(null);
  };

  if (!user || user.role !== "admin") return null;

  const filtered = loans.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (l.full_name || "").toLowerCase().includes(q) || (l.phone || "").includes(q) || String(l.id).includes(q);
    }
    return true;
  });

  const totalCount = loans.length;
  const approvedSum = stats.approved?.sum || 0;
  const pendingCount = stats.pending?.count || 0;

  const STAT_CARDS = [
    { icon: "FileText", label: "Всего заявок", value: totalCount, color: "text-gray-900" },
    { icon: "Clock", label: "На рассмотрении", value: pendingCount, color: "text-amber-600" },
    { icon: "CheckCircle", label: "Одобрено", value: stats.approved?.count || 0, color: "text-green-600" },
    { icon: "Wallet", label: "Выдано, ₽", value: approvedSum.toLocaleString("ru"), color: "text-red-600" },
  ];

  return (
    <div className="min-h-screen section-gray font-['Golos_Text']">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span>Credit</span>
            <span className="relative"><span className="text-red-600">365</span>
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-600" /></span>
            <span className="text-xs font-semibold bg-gray-900 text-white px-2 py-0.5 rounded ml-2">ADMIN</span>
          </Link>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600">
            <Icon name="LogOut" size={16} /> Выйти
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Управление заявками</h1>

        {/* Статистика */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="card-light p-5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Icon name={s.icon} size={16} /> {s.label}
              </div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Фильтры + поиск */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f ? "btn-red" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}>
                {f === "all" ? "Все" : STATUS_MAP[f].label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по имени, телефону, №"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
        </div>

        {/* Таблица */}
        <div className="card-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">№</th>
                  <th className="px-4 py-3 font-medium">Клиент</th>
                  <th className="px-4 py-3 font-medium">Телефон</th>
                  <th className="px-4 py-3 font-medium">Сумма</th>
                  <th className="px-4 py-3 font-medium">Срок</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">Заявок не найдено</td></tr>
                ) : filtered.map((l) => (
                  <tr key={l.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">#{l.id}</td>
                    <td className="px-4 py-3 font-medium">{l.full_name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{l.phone}</td>
                    <td className="px-4 py-3 font-semibold">{l.amount.toLocaleString("ru")} ₽</td>
                    <td className="px-4 py-3 text-gray-600">{l.days} дн.</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_MAP[l.status].cls}`}>
                        {STATUS_MAP[l.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(l)} className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                        Открыть <Icon name="ChevronRight" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Карточка клиента / заявки */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold">Заявка #{selected.id}</h3>
              <button onClick={() => setSelected(null)}><Icon name="X" size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { label: "Клиент", value: selected.full_name || "—" },
                { label: "Телефон", value: selected.phone || "—" },
                { label: "Сумма", value: `${selected.amount.toLocaleString("ru")} ₽` },
                { label: "Срок", value: `${selected.days} дней` },
                { label: "К возврату", value: `${selected.total_payment.toLocaleString("ru")} ₽` },
                { label: "Дата возврата", value: selected.due_date || "—" },
                { label: "Создана", value: selected.created_at ? new Date(selected.created_at).toLocaleString("ru-RU") : "—" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="font-medium text-gray-900">{r.value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-1">
                <span className="text-gray-500">Статус</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_MAP[selected.status].cls}`}>
                  {STATUS_MAP[selected.status].label}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => changeStatus(selected.id, "approved")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <Icon name="Check" size={18} /> Одобрить
              </button>
              <button onClick={() => changeStatus(selected.id, "rejected")}
                className="flex-1 btn-red py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                <Icon name="X" size={18} /> Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
