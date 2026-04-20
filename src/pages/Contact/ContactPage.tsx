import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    org: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('感谢您的留言，我们将尽快与您联系！');
    setForm({ name: '', org: '', phone: '', email: '', message: '' });
  };

  const infoCards = [
    {
      icon: '📍',
      label: '地址',
      value: '浙江省嘉兴市嘉兴港区长三角（嘉兴）氢能产业园',
    },
    { icon: '📞', label: '电话', value: '0573-XXXXXXXX' },
    { icon: '✉️', label: '邮箱', value: 'contact@h2-carbon.cn' },
    { icon: '🕐', label: '工作时间', value: '周一至周五 09:00 - 17:30' },
  ];

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#0D2137] via-[#1565A0] to-[#2B7CB8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">联系我们</h1>
          <p className="text-white/70 text-lg">
            如有任何问题或合作意向，欢迎随时与我们联系
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Info cards */}
          <div className="space-y-5">
            {infoCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4"
              >
                <div className="text-2xl">{card.icon}</div>
                <div>
                  <h3 className="font-semibold text-[#1A2E44] mb-1">
                    {card.label}
                  </h3>
                  <p className="text-sm text-gray-500">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Contact form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#1A2E44] mb-6">
              在线留言
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565A0]/30 focus:border-[#1565A0]"
                  placeholder="请输入您的姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  单位
                </label>
                <input
                  type="text"
                  name="org"
                  value={form.org}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565A0]/30 focus:border-[#1565A0]"
                  placeholder="请输入您的单位名称"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    电话
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565A0]/30 focus:border-[#1565A0]"
                    placeholder="联系电话"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565A0]/30 focus:border-[#1565A0]"
                    placeholder="电子邮箱"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  留言
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565A0]/30 focus:border-[#1565A0] resize-none"
                  placeholder="请输入您的留言内容"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2D8C3C] hover:bg-[#24742F] text-white py-3 rounded-lg font-medium transition-colors cursor-pointer border-none"
              >
                提交留言
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
