import Icon from "@/components/ui/icon";

interface HeroSectionProps {
  amount: number;
  setAmount: (v: number) => void;
  days: number;
  setDays: (v: number) => void;
  isFirst: boolean;
  totalPayment: number;
  dueDateStr: string;
}

export default function HeroSection({ amount, setAmount, days, setDays, isFirst, totalPayment, dueDateStr }: HeroSectionProps) {
  return (
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
  );
}
