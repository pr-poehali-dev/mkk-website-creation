import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

/* ─── ChatBot ───────────────────────────────────────────────── */
type Message = { from: "bot" | "user"; text: string };

const BOT_REPLIES: { keywords: string[]; answer: string }[] = [
  { keywords: ["сумм","сколько","максимум","минимум","100"], answer: "Мы выдаём займы от 1 000 до 30 000 ₽. Сумма подбирается индивидуально." },
  { keywords: ["процент","ставк","переплат"], answer: "Первый займ — бесплатно! Повторный под 0,8% в день. ПСК от 0 до 292% годовых." },
  { keywords: ["срок","дней","месяц"], answer: "Срок первого займа — до 7 дней бесплатно. Повторный — от 7 до 30 дней." },
  { keywords: ["документ","паспорт","справк","нужн"], answer: "Только паспорт гражданина РФ! Справки не нужны 🎉" },
  { keywords: ["одобр","отказ","история","плохая"], answer: "Рассматриваем даже плохую кредитную историю. Решение за 2–15 минут." },
  { keywords: ["перевод","карт","получить","деньги","быстро"], answer: "Деньги на карту за 5 минут после одобрения. Работаем 24/7 🚀" },
  { keywords: ["верификац","фото","селфи","проверк"], answer: "Онлайн-верификация: фото паспорта + селфи. Занимает 3–5 минут." },
  { keywords: ["досрочн","погасить","раньше"], answer: "Досрочное погашение — в любой момент, без штрафов ✅" },
  { keywords: ["заявк","оформить","подать","начать"], answer: "Нажмите «Получить деньги» вверху — заявка займёт 3 минуты." },
  { keywords: ["привет","здравствуй","добрый","хай"], answer: "Привет! 👋 Я Кредо — бот КредитБыстро. Задайте любой вопрос!" },
  { keywords: ["самозан","самозанят"], answer: "Для самозанятых скидка до 20% на ставку! Укажите это при оформлении заявки." },
];
const BOT_QUICK = ["Первый займ бесплатно?", "Какая ставка?", "Нужен ли паспорт?", "Скидка самозанятым?"];
function getBotReply(text: string) {
  const l = text.toLowerCase();
  for (const r of BOT_REPLIES) if (r.keywords.some((k) => l.includes(k))) return r.answer;
  return "Для точного ответа позвоните: 8 800 555-XX-XX (бесплатно) или оставьте заявку — перезвоним за 5 мин.";
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Привет! 👋 Я Кредо — бот КредитБыстро. Задайте вопрос о займе." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((p) => [...p, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => { setTyping(false); setMessages((p) => [...p, { from: "bot", text: getBotReply(text) }]); }, 900);
  };

  return (
    <>
      <button onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-red shadow-xl flex items-center justify-center animate-pulse-glow transition-transform hover:scale-110">
        {open ? <Icon name="X" size={22} className="text-white" /> : <Icon name="MessageCircle" size={24} className="text-white" />}
        {!open && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: 500, animation: "fadeUp 0.22s ease-out" }}>
          <div className="btn-red px-5 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Bot" size={18} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Кредо — бот поддержки</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                <span className="text-white/75 text-xs">Онлайн · отвечает мгновенно</span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                {m.from === "bot" && (
                  <div className="w-7 h-7 rounded-full btn-red flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <Icon name="Bot" size={12} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.from === "user" ? "btn-red text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}>{m.text}</div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-full btn-red flex items-center justify-center flex-shrink-0">
                  <Icon name="Bot" size={12} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  {[0,1,2].map((d) => <span key={d} className="w-2 h-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: `${d*0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {BOT_QUICK.map((q) => (
              <button key={q} onClick={() => send(q)} className="text-xs border border-red-200 text-red-600 px-3 py-1 rounded-full hover:bg-red-50 transition-colors">{q}</button>
            ))}
          </div>
          <div className="px-4 pb-4 pt-2 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Напишите вопрос..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" />
            <button onClick={() => send(input)} className="w-10 h-10 rounded-xl btn-red flex items-center justify-center flex-shrink-0">
              <Icon name="Send" size={15} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

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

  const isFirst = days <= 7 && amount <= 30000;
  const rate    = isFirst ? 0 : 0.008;
  const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + days);
  const dueDateStr = dueDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const totalPayment = amount + Math.round(amount * rate * days);

  const [form, setForm]     = useState({ name: "", phone: "", agree: false });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq]     = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

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
          {/* Лого */}
          <a href="#hero" className="flex items-center gap-1.5 font-bold text-xl text-gray-900">
            <span>Credit</span>
            <span className="relative">
              <span className="text-red-600">365</span>
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-600" />
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV.map((n) => (
              <a key={n} href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{n}</a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a href="#apply" className="btn-red text-sm font-semibold px-5 py-2 rounded-lg hidden sm:flex items-center">
              Внести платёж
            </a>
            <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Icon name="LogIn" size={16} />
              <span className="hidden sm:inline">Войти</span>
            </button>
            <button className="md:hidden ml-1" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={22} className="text-gray-700" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
            {NAV.map((n) => <a key={n} href="#" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">{n}</a>)}
            <a href="#apply" className="btn-red font-semibold px-5 py-2.5 rounded-lg text-center mt-1">Внести платёж</a>
          </div>
        )}
      </header>

      {/* HERO — калькулятор слева, текст справа */}
      <section id="hero" className="section-gray">
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14 grid lg:grid-cols-2 gap-10 items-center">

          {/* Калькулятор */}
          <div className="card-light p-7 animate-fade-up">
            {/* Сумма */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">Выберите сумму</span>
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
                  <span className="font-bold text-gray-900">{amount.toLocaleString("ru")}</span>
                  <span className="text-red-600 font-bold">₽</span>
                </div>
              </div>
              <input type="range" min={1000} max={30000} step={500} value={amount}
                onChange={(e) => setAmount(+e.target.value)}
                style={{ background: `linear-gradient(to right, #E32636 ${((amount-1000)/290)}%, #e2e8f0 ${((amount-1000)/290)}%)` }}
                className="w-full" />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>1 000 ₽</span><span>30 000 ₽</span>
              </div>
            </div>

            {/* Срок */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">Выберите срок</span>
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
                  <span className="font-bold text-gray-900">{days}</span>
                  <span className="text-red-600 font-bold">дней</span>
                </div>
              </div>
              <input type="range" min={7} max={30} step={1} value={days}
                onChange={(e) => setDays(+e.target.value)}
                style={{ background: `linear-gradient(to right, #E32636 ${((days-7)/23)*100}%, #e2e8f0 ${((days-7)/23)*100}%)` }}
                className="w-full" />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>7 дней</span><span>30 дней</span>
              </div>
            </div>

            {/* Итог */}
            <div className="bg-gray-50 rounded-xl px-5 py-4 mb-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Вы возвращаете</span>
                <span className="font-bold text-gray-900">{totalPayment.toLocaleString("ru")} ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">До (включительно)</span>
                <span className="font-semibold text-gray-700">{dueDateStr}</span>
              </div>
              {isFirst && (
                <div className="text-xs text-green-600 font-medium pt-1">🎉 Первый займ бесплатно — переплата 0 ₽</div>
              )}
            </div>

            <a href="#apply" className="btn-red w-full py-3.5 rounded-xl text-center font-bold text-lg block mb-4">
              Получить деньги
            </a>

            <p className="text-center text-xs text-gray-400 mb-4">Быстрая заявка через Т‑Банк или Госуслуги</p>
            <div className="flex gap-3">
              <button className="pill flex-1 justify-center">
                <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-white">T</span>
                Т‑Банк
              </button>
              <button className="pill flex-1 justify-center">
                <Icon name="Globe" size={16} className="text-red-600" />
                Госуслуги
              </button>
            </div>

            <button className="mt-3 w-full text-center text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors">
              У меня есть промокод ?
            </button>

            {/* Самозанятым */}
            <div className="mt-3 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-green-50 transition-colors">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-lg">🌿</span>
                <span>Скидки самозанятым до</span>
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">20%</span>
              </div>
              <Icon name="ChevronDown" size={16} className="text-gray-400" />
            </div>

            {/* Ссылки */}
            <div className="mt-4 space-y-1.5">
              {["А если я не успею вернуть займ вовремя?", "Условия бесплатного займа МКК", "Правила применения промокода МКК"].map((t) => (
                <a key={t} href="#" className="block text-xs text-red-600 hover:underline">{t}</a>
              ))}
            </div>
          </div>

          {/* Правая сторона — текст */}
          <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <p className="text-sm text-gray-500 mb-2 font-medium">Займ онлайн</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Первый заём<br />
              <span className="text-red-600">бесплатно*</span>
            </h1>

            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 mb-8 bg-white shadow-sm">
              <Icon name="Clock" size={16} className="text-gray-500" />
              <span className="text-gray-700 font-medium">Деньги у вас уже в</span>
              <span className="font-bold text-gray-900 ml-1">
                {new Date(Date.now() + 15 * 60000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* Преимущества */}
            <div className="space-y-4 mb-8">
              {[
                { icon: "Zap", title: "Получите деньги за 7 минут", desc: "Моментальное одобрение заявки и мгновенное зачисление на карту." },
                { icon: "FileText", title: "Прозрачные и простые условия", desc: "Первый займ без процентов. Следующий — всего под 0,8% в день. Никаких скрытых комиссий." },
                { icon: "CalendarCheck", title: "Возвращайте когда вам удобно", desc: "Легко погасить досрочно или изменить дату оплаты, оплачивая лишь проценты." },
              ].map((f) => (
                <div key={f.title} className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={f.icon} size={20} className="text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-0.5">{f.title}</div>
                    <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              *при условии полного погашения займа в срок. При повторном займе на сумму до 30 000 р, деньги выдаются под 0,8% в день.
              Срок первого займа не должен превышать 7 дней для бесплатного займа.
            </p>
          </div>
        </div>
      </section>

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
      <section id="apply" className="py-14 bg-white">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Подать заявку</h2>
          <p className="text-gray-500 text-center mb-8">Заполните форму — ответим за 5 минут</p>

          {submitted ? (
            <div className="card-light p-10 text-center">
              <div className="w-16 h-16 rounded-full btn-red flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={30} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
              <p className="text-gray-500">Специалист свяжется с вами в течение 5 минут</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-light p-7 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ваше имя *</label>
                <input required placeholder="Иван Иванов" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон *</label>
                <input required type="tel" placeholder="+7 (___) ___-__-__" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" />
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Shield" size={16} className="text-red-600" />
                  <span className="text-sm font-semibold text-red-800">Верификация личности</span>
                </div>
                <p className="text-xs text-red-600 mb-2">После заявки — фото паспорта + селфи онлайн (3–5 мин)</p>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-1.5 border border-red-200 text-xs text-red-700">
                    <Icon name="Camera" size={12} /> Паспорт
                  </div>
                  <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-1.5 border border-red-200 text-xs text-red-700">
                    <Icon name="User" size={12} /> Селфи
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input type="checkbox" id="agree" required checked={form.agree}
                  onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                  className="mt-1 w-4 h-4 flex-shrink-0" style={{ accentColor: "#E32636" }} />
                <label htmlFor="agree" className="text-xs text-gray-500 leading-relaxed">
                  Я согласен с{" "}
                  <a href="#" className="text-red-600 underline">условиями обработки персональных данных</a>
                  {" "}и{" "}
                  <a href="#" className="text-red-600 underline">правилами предоставления займов</a>
                </label>
              </div>

              <button type="submit" className="btn-red w-full py-3.5 rounded-xl font-bold text-lg">
                Отправить заявку
              </button>
            </form>
          )}
        </div>
      </section>

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
