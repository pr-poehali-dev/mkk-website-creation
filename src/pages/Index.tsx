import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Message = { from: "bot" | "user"; text: string };

const BOT_REPLIES: { keywords: string[]; answer: string }[] = [
  { keywords: ["сумм", "сколько", "максимум", "минимум", "100"], answer: "Мы выдаём займы от 5 000 до 100 000 ₽. Сумма подбирается индивидуально в зависимости от вашей истории." },
  { keywords: ["процент", "ставк", "переплат"], answer: "Ставка — от 0,8% в день. Точную сумму переплаты рассчитайте в нашем калькуляторе на сайте 👆" },
  { keywords: ["срок", "дней", "месяц", "период"], answer: "Срок займа — от 7 до 365 дней. Вы выбираете удобный срок при оформлении заявки." },
  { keywords: ["документ", "паспорт", "справк", "нужн"], answer: "Только паспорт гражданина РФ! Справки о доходах, поручители и залог не нужны 🎉" },
  { keywords: ["одобр", "отказ", "история", "плохая"], answer: "Мы рассматриваем заявки даже с плохой кредитной историей. Решение принимается за 2–15 минут." },
  { keywords: ["перевод", "карт", "получить", "деньги", "быстро"], answer: "Деньги переводим на любую карту РФ в течение 5 минут после одобрения. Работаем 24/7 🚀" },
  { keywords: ["верификац", "фото", "селфи", "паспорт", "проверк"], answer: "Верификация проходит онлайн: нужно сфотографировать паспорт и сделать селфи. Занимает 3–5 минут." },
  { keywords: ["досрочн", "погасить", "раньше"], answer: "Досрочное погашение доступно в любой момент без штрафов и комиссий ✅" },
  { keywords: ["заявк", "оформить", "подать", "начать"], answer: "Отлично! Нажмите кнопку «Получить займ» вверху страницы или перейдите в раздел «Заявка» — это займёт 3 минуты." },
  { keywords: ["привет", "здравствуй", "добрый", "хай", "hello"], answer: "Привет! 👋 Я помогу разобраться с займами. Спросите что угодно: сумма, ставка, документы — отвечу мгновенно!" },
];

const BOT_QUICK = ["Какая ставка?", "Нужен ли паспорт?", "Как быстро деньги?", "Можно с плохой КИ?"];

function getBotReply(text: string): string {
  const lower = text.toLowerCase();
  for (const r of BOT_REPLIES) {
    if (r.keywords.some((k) => lower.includes(k))) return r.answer;
  }
  return "Хороший вопрос! Для точного ответа свяжитесь с нами по телефону 8 800 555-XX-XX (бесплатно) или оставьте заявку — менеджер перезвонит за 5 минут.";
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Привет! 👋 Я Кредо — бот КредитБыстро. Задайте вопрос о займе или выберите тему ниже." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: getBotReply(text) }]);
    }, 900);
  };

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-gradient shadow-2xl flex items-center justify-center animate-pulse-glow transition-transform hover:scale-110"
        aria-label="Открыть чат"
      >
        {open ? <Icon name="X" size={24} className="text-white" /> : <Icon name="MessageCircle" size={26} className="text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
        )}
      </button>

      {/* Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-violet-100 flex flex-col overflow-hidden"
          style={{ maxHeight: "520px", animation: "fadeUp 0.25s ease-out" }}>
          {/* Header */}
          <div className="btn-gradient px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Bot" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm font-['Oswald']">Кредо — бот поддержки</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                <span className="text-white/70 text-xs">Онлайн · отвечает мгновенно</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                {m.from === "bot" && (
                  <div className="w-7 h-7 rounded-full btn-gradient flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Icon name="Bot" size={13} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.from === "user"
                      ? "btn-gradient text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-7 h-7 rounded-full btn-gradient flex items-center justify-center flex-shrink-0">
                  <Icon name="Bot" size={13} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {BOT_QUICK.map((q) => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs border border-violet-200 text-violet-600 px-3 py-1 rounded-full hover:bg-violet-50 transition-colors">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Напишите вопрос..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
            <button onClick={() => sendMessage(input)}
              className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center flex-shrink-0">
              <Icon name="Send" size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const HERO_IMG = "https://cdn.poehali.dev/projects/6b2e5350-d352-46b3-ad8a-13c70bd08e7a/files/e67eb373-6fdc-4ed7-92fb-517580fd4b29.jpg";
const BG_IMG = "https://cdn.poehali.dev/projects/6b2e5350-d352-46b3-ad8a-13c70bd08e7a/files/58b1ea75-c1c0-433f-b5da-3dcb91c2a54d.jpg";

const NAV_LINKS = [
  { label: "Главная", href: "#hero" },
  { label: "Калькулятор", href: "#calc" },
  { label: "Условия", href: "#terms" },
  { label: "Заявка", href: "#apply" },
  { label: "FAQ", href: "#faq" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Статьи", href: "#blog" },
  { label: "Контакты", href: "#contacts" },
];

const TERMS = [
  { icon: "Zap", title: "До 100 000 ₽", desc: "Сумма займа" },
  { icon: "Clock", title: "До 365 дней", desc: "Срок кредитования" },
  { icon: "Percent", title: "От 0.8%", desc: "Ставка в день" },
  { icon: "CheckCircle", title: "15 минут", desc: "Решение по заявке" },
  { icon: "Shield", title: "Без залога", desc: "Без поручителей" },
  { icon: "Smartphone", title: "100% онлайн", desc: "Без визита в офис" },
];

const REVIEWS = [
  { name: "Алина К.", age: 23, text: "Оформила займ за 10 минут прямо с телефона! Деньги пришли мгновенно. Очень удобный сервис, буду пользоваться ещё.", stars: 5, date: "12 мая 2024" },
  { name: "Дмитрий В.", age: 28, text: "Нужны были срочно деньги до зарплаты. КредитБыстро не подвёл — всё прозрачно, без скрытых комиссий. Рекомендую!", stars: 5, date: "3 июня 2024" },
  { name: "Наташа Р.", age: 21, text: "Первый раз брала микрозайм. Боялась, но всё оказалось просто. Понятный сайт, быстрое одобрение. 5 звёзд!", stars: 5, date: "28 мая 2024" },
  { name: "Михаил Т.", age: 31, text: "Третий раз пользуюсь. Всегда быстро, условия не меняются. Лучший сервис из тех, что пробовал.", stars: 4, date: "7 июня 2024" },
];

const FAQS = [
  { q: "Кто может получить займ?", a: "Гражданин РФ в возрасте от 18 до 70 лет с постоянной регистрацией. Нужен только паспорт." },
  { q: "Как быстро одобряют заявку?", a: "Решение принимается автоматически за 2–15 минут. Деньги поступают на карту в течение 5 минут после одобрения." },
  { q: "Нужна ли кредитная история?", a: "Мы рассматриваем заявки даже с плохой кредитной историей. Каждый случай оценивается индивидуально." },
  { q: "Можно ли погасить займ досрочно?", a: "Да, досрочное погашение доступно в любой момент без штрафов и комиссий." },
  { q: "Как проходит верификация личности?", a: "Мы используем онлайн-верификацию: фото паспорта и селфи. Весь процесс занимает 3–5 минут прямо на сайте." },
  { q: "Какие документы нужны?", a: "Только паспорт гражданина РФ. Справки о доходах, поручители и залог не нужны." },
];

const ARTICLES = [
  { icon: "BookOpen", title: "Как правильно брать микрозайм", desc: "Разбираем все тонкости: когда микрозайм выгоден, а когда лучше искать альтернативы", tag: "Гид", color: "from-violet-500 to-purple-600" },
  { icon: "TrendingUp", title: "Как улучшить кредитную историю", desc: "5 проверенных способов поднять кредитный рейтинг за 3–6 месяцев", tag: "Советы", color: "from-pink-500 to-rose-600" },
  { icon: "PiggyBank", title: "Финансовая подушка безопасности", desc: "Как накопить резервный фонд и больше не зависеть от займов", tag: "Финансы", color: "from-cyan-500 to-blue-600" },
];

export default function Index() {
  const [amount, setAmount] = useState(30000);
  const [days, setDays] = useState(30);
  const [menuOpen, setMenuOpen] = useState(false);

  const rate = 0.008;
  const totalInterest = Math.round(amount * rate * days);
  const totalPayment = amount + totalInterest;

  const [form, setForm] = useState({ name: "", phone: "", email: "", amount: "30000", agree: false });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-['Golos_Text']">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-violet-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <a href="#hero" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm font-['Oswald']">КБ</span>
            </div>
            <span className="font-['Oswald'] font-bold text-lg text-gradient">КредитБыстро</span>
          </a>
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-violet-600 transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>
          <a href="#apply" className="hidden lg:flex btn-gradient text-white text-sm font-semibold px-5 py-2 rounded-full">
            Получить деньги
          </a>
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} className="text-violet-600" />
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-violet-100 px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-1">
                {l.label}
              </a>
            ))}
            <a href="#apply" className="btn-gradient text-white font-semibold px-5 py-2.5 rounded-full text-center mt-2">
              Получить деньги
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen hero-bg noise-overlay overflow-hidden flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-pink-600/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-violet-500/10 animate-spin-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-sm">Заявки принимаются 24/7</span>
            </div>
            <h1 className="font-['Oswald'] text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              ДЕНЬГИ<br />
              <span style={{ background: "linear-gradient(90deg, #A78BFA, #F472B6, #FB923C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                ЗА 15 МИНУТ
              </span>
            </h1>
            <p className="text-white/70 text-xl mb-8 leading-relaxed max-w-lg">
              Микрозайм до <strong className="text-white">100 000 ₽</strong> без залога, справок и поручителей. Одобрение онлайн — деньги на карту мгновенно.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#apply" className="btn-gradient text-white font-bold px-8 py-4 rounded-full text-lg animate-pulse-glow">
                Получить займ →
              </a>
              <a href="#calc" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
                Рассчитать
              </a>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { num: "50K+", label: "клиентов" },
                { num: "97%", label: "одобрений" },
                { num: "4.9★", label: "рейтинг" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-['Oswald'] text-2xl font-bold text-white">{s.num}</div>
                  <div className="text-white/50 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-3xl animate-pulse-glow" style={{ background: "linear-gradient(135deg, #7C3AED33, #EC489933)" }} />
              <img src={HERO_IMG} alt="Молодые люди с телефонами" className="relative w-full h-full object-cover rounded-3xl border border-white/20" />
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Одобрено!</div>
                    <div className="text-sm font-bold text-gray-800">30 000 ₽</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-xl animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                    <Icon name="Zap" size={16} className="text-violet-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Перевод за</div>
                    <div className="text-sm font-bold text-gray-800">3 минуты</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TERMS */}
      <section id="terms" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-['Oswald'] text-4xl font-bold mb-3 text-gradient">Условия кредитования</h2>
            <p className="text-gray-500 text-lg">Прозрачно, честно, без скрытых комиссий</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TERMS.map((t) => (
              <div key={t.title} className="card-glow rounded-2xl p-5 text-center">
                <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center mx-auto mb-3">
                  <Icon name={t.icon} size={22} className="text-white" />
                </div>
                <div className="font-['Oswald'] text-xl font-bold text-gray-900 mb-1">{t.title}</div>
                <div className="text-gray-500 text-sm">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calc" className="py-20 section-alt">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-['Oswald'] text-4xl font-bold mb-3 text-gradient">Калькулятор займа</h2>
            <p className="text-gray-500 text-lg">Рассчитайте сумму и срок прямо сейчас</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-violet-100">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-10">
                <div className="mb-8">
                  <div className="flex justify-between mb-3">
                    <label className="font-semibold text-gray-700">Сумма займа</label>
                    <span className="font-['Oswald'] text-2xl font-bold text-gradient">{amount.toLocaleString()} ₽</span>
                  </div>
                  <input
                    type="range" min="5000" max="100000" step="1000"
                    value={amount}
                    onChange={(e) => setAmount(+e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer slider-thumb"
                    style={{ background: `linear-gradient(to right, #7C3AED ${(amount - 5000) / 950}%, #E5E7EB ${(amount - 5000) / 950}%)` }}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>5 000 ₽</span>
                    <span>100 000 ₽</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between mb-3">
                    <label className="font-semibold text-gray-700">Срок займа</label>
                    <span className="font-['Oswald'] text-2xl font-bold text-gradient">{days} дней</span>
                  </div>
                  <input
                    type="range" min="7" max="365" step="1"
                    value={days}
                    onChange={(e) => setDays(+e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer slider-thumb"
                    style={{ background: `linear-gradient(to right, #EC4899 ${(days - 7) / 3.58}%, #E5E7EB ${(days - 7) / 3.58}%)` }}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>7 дней</span>
                    <span>365 дней</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[7, 14, 30].map((d) => (
                    <button key={d} onClick={() => setDays(d)}
                      className={`py-2 rounded-xl text-sm font-semibold transition-all ${days === d ? "btn-gradient text-white" : "bg-gray-100 text-gray-600 hover:bg-violet-50"}`}>
                      {d} дней
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 lg:p-10 flex flex-col justify-between" style={{ background: "var(--grad-hero)" }}>
                <div>
                  <h3 className="font-['Oswald'] text-2xl font-bold text-white mb-6">Итого к выплате</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-white/60">Сумма займа</span>
                      <span className="text-white font-semibold">{amount.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-white/60">Проценты ({days} дн.)</span>
                      <span className="text-white font-semibold">{totalInterest.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-white/80 font-semibold">Итого</span>
                      <span className="font-['Oswald'] text-3xl font-bold" style={{ color: "#A78BFA" }}>
                        {totalPayment.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs mt-4">
                    *Расчёт носит информационный характер. Ставка 0,8% в день.
                  </p>
                </div>
                <a href="#apply" className="btn-gradient text-white font-bold py-4 rounded-2xl text-center mt-6 block hover:opacity-90 transition-opacity">
                  Оформить займ на {amount.toLocaleString()} ₽ →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-['Oswald'] text-4xl font-bold mb-3 text-gradient">Как это работает</h2>
            <p className="text-gray-500 text-lg">Всего 3 шага до получения денег</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: "FileText", title: "Заполните заявку", desc: "Укажите данные паспорта и реквизиты карты. Займёт 3 минуты." },
              { step: "02", icon: "Camera", title: "Верификация", desc: "Сфотографируйте паспорт и сделайте селфи. Автоматическая проверка за 5 минут." },
              { step: "03", icon: "CreditCard", title: "Деньги на карте", desc: "После одобрения деньги поступят на вашу карту в течение 5 минут." },
            ].map((s, i) => (
              <div key={s.step} className="relative card-glow rounded-3xl p-8">
                <div className="font-['Oswald'] text-6xl font-bold text-gradient opacity-20 absolute top-4 right-6">{s.step}</div>
                <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mb-5">
                  <Icon name={s.icon} size={26} className="text-white" />
                </div>
                <h3 className="font-['Oswald'] text-xl font-bold mb-3 text-gray-900">{s.title}</h3>
                <p className="text-gray-500">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full btn-gradient items-center justify-center">
                    <Icon name="ChevronRight" size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLY FORM */}
      <section id="apply" className="py-20 section-alt">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-['Oswald'] text-4xl font-bold mb-3 text-gradient">Подать заявку</h2>
            <p className="text-gray-500 text-lg">Заполните форму — мы перезвоним за 5 минут</p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-violet-100">
              <div className="w-20 h-20 rounded-full btn-gradient flex items-center justify-center mx-auto mb-6">
                <Icon name="CheckCircle" size={36} className="text-white" />
              </div>
              <h3 className="font-['Oswald'] text-3xl font-bold text-gray-900 mb-3">Заявка отправлена!</h3>
              <p className="text-gray-500 text-lg">Наш специалист свяжется с вами в течение 5 минут</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl border border-violet-100 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ваше имя *</label>
                <input required placeholder="Иван Иванов" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Телефон *</label>
                <input required type="tel" placeholder="+7 (___) ___-__-__" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" placeholder="ivan@mail.ru" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Желаемая сумма</label>
                <select value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all bg-white">
                  {["5000", "10000", "20000", "30000", "50000", "70000", "100000"].map((v) => (
                    <option key={v} value={v}>{Number(v).toLocaleString()} ₽</option>
                  ))}
                </select>
              </div>

              <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Shield" size={20} className="text-violet-600" />
                  <span className="font-semibold text-violet-800">Верификация личности</span>
                </div>
                <p className="text-sm text-violet-600 mb-3">После подачи заявки вам предложат пройти онлайн-верификацию: фото паспорта + селфи.</p>
                <div className="flex gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-violet-200">
                    <Icon name="Camera" size={14} className="text-violet-500" />
                    <span className="text-xs text-violet-700">Фото паспорта</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-violet-200">
                    <Icon name="User" size={14} className="text-violet-500" />
                    <span className="text-xs text-violet-700">Селфи</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" id="agree" required checked={form.agree}
                  onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded flex-shrink-0" style={{ accentColor: "#7C3AED" }} />
                <label htmlFor="agree" className="text-sm text-gray-500">
                  Я согласен с{" "}
                  <a href="#" className="text-violet-600 underline">условиями обработки персональных данных</a>
                  {" "}и{" "}
                  <a href="#" className="text-violet-600 underline">правилами предоставления займов</a>
                </label>
              </div>

              <button type="submit" className="w-full btn-gradient text-white font-bold py-4 rounded-2xl text-lg">
                Отправить заявку →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-['Oswald'] text-4xl font-bold mb-3 text-gradient">Частые вопросы</h2>
            <p className="text-gray-500 text-lg">Всё, что нужно знать о займах</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className={`card-glow rounded-2xl overflow-hidden transition-all ${openFaq === i ? "border-violet-300" : ""}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-semibold text-gray-800">{f.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={20} className="text-violet-500 flex-shrink-0 ml-3" />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-['Oswald'] text-4xl font-bold mb-3 text-gradient">Отзывы клиентов</h2>
            <p className="text-gray-500 text-lg">Нам доверяют тысячи людей по всей России</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.name} className="card-glow bg-white rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full btn-gradient flex items-center justify-center text-white font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{r.name}, {r.age}</div>
                    <div className="text-xs text-gray-400">{r.date}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="Star" size={14} className={i < r.stars ? "text-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-['Oswald'] text-4xl font-bold mb-3 text-gradient">Финансовая грамотность</h2>
            <p className="text-gray-500 text-lg">Статьи и советы для умного управления деньгами</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ARTICLES.map((a) => (
              <div key={a.title} className="card-glow rounded-3xl overflow-hidden group cursor-pointer">
                <div className={`h-36 bg-gradient-to-br ${a.color} flex items-center justify-center relative`}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${BG_IMG})`, backgroundSize: "cover" }} />
                  <Icon name={a.icon} size={48} className="text-white relative z-10 opacity-90" />
                  <span className="absolute top-4 left-4 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {a.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-['Oswald'] text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{a.desc}</p>
                  <span className="text-violet-600 text-sm font-semibold flex items-center gap-1">
                    Читать статью <Icon name="ArrowRight" size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 hero-bg relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="font-['Oswald'] text-4xl font-bold text-white mb-3">Контакты и поддержка</h2>
            <p className="text-white/60 text-lg">Работаем 24/7 — всегда на связи</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { icon: "Phone", title: "Телефон", value: "8 800 555-XX-XX", sub: "Бесплатно по РФ" },
              { icon: "MessageCircle", title: "Чат", value: "Онлайн-чат", sub: "Ответ за 1 минуту" },
              { icon: "Mail", title: "Email", value: "help@kreditbystro.ru", sub: "Ответ за 2 часа" },
              { icon: "MapPin", title: "Офис", value: "Москва, ул. Тверская, 1", sub: "Пн–Пт 9:00–18:00" },
            ].map((c) => (
              <div key={c.title} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center mx-auto mb-3">
                  <Icon name={c.icon} size={20} className="text-white" />
                </div>
                <div className="text-white/60 text-sm mb-1">{c.title}</div>
                <div className="text-white font-semibold">{c.value}</div>
                <div className="text-white/40 text-xs mt-1">{c.sub}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-white/40 text-sm">
              КредитБыстро — МКК. Свидетельство о внесении в реестр МФО ЦБ РФ №ХХХХ-ХХХХ. ОГРН 0000000000000
            </p>
          </div>
        </div>
      </section>

      {/* CHATBOT */}
      <ChatBot />

      {/* FOOTER */}
      <footer className="bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm font-['Oswald']">КБ</span>
              </div>
              <span className="font-['Oswald'] font-bold text-lg text-white">КредитБыстро</span>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Договор займа</a>
              <a href="#" className="hover:text-white transition-colors">Правила сайта</a>
            </div>
            <div className="text-gray-500 text-sm">© 2024 КредитБыстро МКК</div>
          </div>
          <p className="text-gray-600 text-xs mt-6 max-w-4xl mx-auto text-center">
            Внимание: микрозаймы — краткосрочный финансовый инструмент. Перед оформлением ознакомьтесь с условиями договора. Ставка 0.8% в день. ПСК рассчитывается индивидуально. Несвоевременное погашение может повлиять на кредитную историю.
          </p>
        </div>
      </footer>
    </div>
  );
}