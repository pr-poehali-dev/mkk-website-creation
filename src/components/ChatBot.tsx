import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

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

export default function ChatBot() {
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
