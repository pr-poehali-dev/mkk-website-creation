import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function ApplyForm() {
  const [form, setForm] = useState({ name: "", phone: "", agree: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
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
  );
}
