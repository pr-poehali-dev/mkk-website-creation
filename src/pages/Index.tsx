import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import ChatBot from "@/components/ChatBot";
import HeroSection from "@/components/HeroSection";
import ApplyForm from "@/components/ApplyForm";
import { useAuth } from "@/context/AuthContext";

/* ─── Data ──────────────────────────────────────────────────── */
const REVIEWS = [
  { name: "Алина К.", age: 23, text: "Оформила займ за 10 минут прямо с телефона! Деньги пришли мгновенно.", stars: 5, date: "12 мая 2024" },
  { name: "Дмитрий В.", age: 28, text: "КредитБыстро не подвёл — всё прозрачно, без скрытых комиссий. Рекомендую!", stars: 5, date: "3 июня 2024" },
  { name: "Наташа Р.", age: 21, text: "Первый займ бесплатно — это правда! Вернула ровно столько, сколько брала.", stars: 5, date: "28 мая 2024" },
  { name: "Михаил Т.", age: 31, text: "Третий раз пользуюсь. Всегда быстро, условия честные.", stars: 4, date: "7 июня 2024" },
];

const FAQS = [
  { q: "Кто может получить займ?", a: "Гражданин РФ от 18 до 70 лет с постоянной регистрацией. Нужен только паспорт." },
  { q: "Первый займ действительно бесплатный?", a: "Да! Первый займ до 7 дней — 0%. Вы возвращаете ровно столько, сколько взяли. *при условии полного погашения в срок." },
  { q: "Как быстро одобряют заявку?", a: "Решение принимается за 2–15 минут. Деньги поступают на карту в течение 5 минут после одобрения." },
  { q: "Нужна ли кредитная история?", a: "Рассматриваем заявки даже с плохой кредитной историей. Каждый случай — индивидуально." },
  { q: "Как проходит верификация?", a: "Онлайн: фото паспорта + селфи. Весь процесс — 3–5 минут прямо на сайте." },
  { q: "Есть ли скидки для самозанятых?", a: "Да! Скидка до 20% на ставку. Подтвердите статус самозанятого при оформлении заявки." },
];

const ARTICLES = [
  { icon: "BookOpen", title: "Как правильно брать микрозайм", desc: "Когда микрозайм выгоден, а когда лучше искать альтернативы", tag: "Гид" },
  { icon: "TrendingUp", title: "Как улучшить кредитную историю", desc: "5 способов поднять кредитный рейтинг за 3–6 месяцев", tag: "Советы" },
  { icon: "PiggyBank", title: "Финансовая подушка безопасности", desc: "Как накопить резервный фонд и не зависеть от займов", tag: "Финансы" },
];

/* ─── Main ──────────────────────────────────────────────────── */
export default function Index() {
  const [amount, setAmount] = useState(10000);
  const [days, setDays]     = useState(7);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq]   = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const cabinetPath = user ? (user.role === "admin" ? "/admin" : "/cabinet") : "/login";

  const isFirst      = days <= 7 && amount <= 30000;
  const rate         = isFirst ? 0 : 0.008;
  const dueDate      = new Date(); dueDate.setDate(dueDate.getDate() + days);
  const dueDateStr   = dueDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const totalPayment = amount + Math.round(amount * rate * days);

  const NAV = ["Займ", "Условия", "О нас", "Блог", "Контакты"];

  return (
    <div className="min-h-screen bg-white font-['Golos_Text'] text-gray-900">

      {/* ПСК топ-бар */}
      <div className="bg-gray-100 text-center text-xs text-gray-500 py-1.5 px-4">
        Диапазон Полной стоимости кредита (ПСК) 0,000% – 292,000% годовых.
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <a href="#hero" className="flex items-center gap-1.5 font-bold text-xl text-gray-900">
            <span>Credit</span>
            <span className="relative">
              <span className="text-red-600">365</span>
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-600" />
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-5">
            {NAV.map((n) => (
              <a key={n} href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{n}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate(cabinetPath)} className="btn-red text-sm font-semibold px-5 py-2 rounded-lg hidden sm:flex items-center">
              Оплата
            </button>
            <button onClick={() => navigate(cabinetPath)} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Icon name="LogIn" size={16} />
              <span className="hidden sm:inline">{user ? "Кабинет" : "Войти"}</span>
            </button>
            <button className="md:hidden ml-1" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={22} className="text-gray-700" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
            {NAV.map((n) => <a key={n} href="#" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">{n}</a>)}
            <button onClick={() => navigate(cabinetPath)} className="btn-red font-semibold px-5 py-2.5 rounded-lg text-center mt-1">
              {user ? "Личный кабинет" : "Войти"}
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <HeroSection
        amount={amount}
        setAmount={setAmount}
        days={days}
        setDays={setDays}
        isFirst={isFirst}
        totalPayment={totalPayment}
        dueDateStr={dueDateStr}
      />

      {/* ПСК заметка */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <a href="#" className="text-xs text-red-600 hover:underline">
          Ознакомьтесь с информацией о самостоятельном запрете на заключение договоров потребительского кредита (займа) МКК
        </a>
      </div>

      {/* САМОЗАНЯТЫЕ */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Выгодные займы для самозанятых</h2>
          <p className="text-gray-500 mb-8">Получите деньги на развитие или текущие расходы по сниженной ставке с высоким шансом одобрения</p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "Percent", title: "Ставка от 0%", desc: "Первый займ бесплатно для всех. Для самозанятых — сниженная ставка на повторные займы." },
              { icon: "CheckCircle", title: "Высокое одобрение", desc: "Для самозанятых повышенный процент одобрения заявок — до 92%." },
              { icon: "Repeat", title: "Гибкие условия", desc: "Индивидуальный подход к каждому клиенту. Продление, рефинансирование." },
            ].map((c) => (
              <div key={c.title} className="card-light p-6">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <Icon name={c.icon} size={22} className="text-red-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section className="section-gray py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Как получить займ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "1", icon: "FileText", title: "Заполните заявку", desc: "Паспорт + реквизиты карты. 3 минуты." },
              { n: "2", icon: "Camera", title: "Верификация", desc: "Фото паспорта и селфи онлайн. 5 минут." },
              { n: "3", icon: "CreditCard", title: "Деньги на карте", desc: "Перевод за 5 минут после одобрения." },
            ].map((s, i) => (
              <div key={s.n} className="relative card-light p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full btn-red flex items-center justify-center text-sm font-bold shadow-md">
                  {s.n}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mt-3 mb-4">
                  <Icon name={s.icon} size={26} className="text-red-600" />
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <Icon name="ChevronRight" size={20} className="text-red-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА ЗАЯВКИ */}
      <ApplyForm />

      {/* FAQ */}
      <section id="faq" className="section-gray py-14">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Частые вопросы</h2>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <div key={i} className={`card-light overflow-hidden transition-all ${openFaq === i ? "ring-1 ring-red-200" : ""}`}
                style={{ boxShadow: openFaq === i ? "0 2px 16px rgba(227,38,54,0.08)" : undefined }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-medium text-gray-800">{f.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={18} className="text-red-500 flex-shrink-0 ml-3" />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section id="reviews" className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Отзывы клиентов</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.name} className="card-light p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 rounded-full btn-red flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">{r.name}, {r.age}</div>
                    <div className="text-xs text-gray-400">{r.date}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="Star" size={13} className={i < r.stars ? "text-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОГ */}
      <section id="blog" className="section-gray py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Финансовая грамотность</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {ARTICLES.map((a) => (
              <div key={a.title} className="card-light overflow-hidden group cursor-pointer">
                <div className="h-32 bg-red-50 flex items-center justify-center relative">
                  <Icon name={a.icon} size={44} className="text-red-300" />
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{a.tag}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-1.5 group-hover:text-red-600 transition-colors">{a.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{a.desc}</p>
                  <span className="text-red-600 text-sm font-semibold flex items-center gap-1">
                    Читать <Icon name="ArrowRight" size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contacts" className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Контакты</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "Phone", title: "Телефон", value: "8 800 555-XX-XX", sub: "Бесплатно по РФ" },
              { icon: "MessageCircle", title: "Чат", value: "Онлайн-чат", sub: "Ответ за 1 минуту" },
              { icon: "Mail", title: "Email", value: "help@credit365.ru", sub: "Ответ за 2 часа" },
              { icon: "MapPin", title: "Офис", value: "Москва, Тверская, 1", sub: "Пн–Пт 9:00–18:00" },
            ].map((c) => (
              <div key={c.title} className="card-light p-5 text-center">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                  <Icon name={c.icon} size={20} className="text-red-600" />
                </div>
                <div className="text-xs text-gray-400 mb-0.5">{c.title}</div>
                <div className="font-semibold text-gray-800 text-sm">{c.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <a href="#" className="flex items-center gap-1 font-bold text-lg">
              <span>Credit</span>
              <span className="relative">
                <span className="text-red-600">365</span>
                <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-600" />
              </span>
            </a>
            <div className="flex flex-wrap gap-5 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-700 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Договор займа</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Правила сайта</a>
            </div>
            <span className="text-gray-400 text-sm">© 2024 КредитБыстро МКК</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-4xl">
            МКК. Свидетельство о внесении в реестр МФО ЦБ РФ. Внимание: микрозаймы — краткосрочный финансовый инструмент.
            ПСК 0–292% годовых. Несвоевременное погашение влияет на кредитную историю.
          </p>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
}