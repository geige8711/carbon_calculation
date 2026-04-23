import { Link } from 'react-router-dom';
import { NEWS_ARTICLES } from '@/data/newsArticles';

const modules = [
  {
    icon: '⚗️',
    title: '氢气制取',
    description:
      '涵盖电解水制氢、天然气制氢、煤制氢等多种制氢工艺路线，精确核算制氢环节碳排放因子。',
    path: '/production',
    borderColor: 'border-[#1565A0]',
    buttonColor: 'text-[#1565A0]',
  },
  {
    icon: '⛽',
    title: '氢气加注',
    description:
      '覆盖氢气压缩、储存、运输及加注全过程，量化加氢站运营环节的碳排放因子。',
    path: '/refueling',
    borderColor: 'border-[#2D8C3C]',
    buttonColor: 'text-[#2D8C3C]',
  },
  {
    icon: '🚚',
    title: '氢气运输',
    description:
      '覆盖管道运输与运氢车运输两种方式，精确核算氢气运输环节的碳排放因子。',
    path: '/transport',
    borderColor: 'border-[#6B4C9A]',
    buttonColor: 'text-[#6B4C9A]',
  },
  {
    icon: '🚛',
    title: '用氢车辆',
    description:
      '对比燃料电池汽车与传统燃油汽车，科学评估氢能车辆的碳减排效能与环境效益。',
    path: '/vehicle',
    borderColor: 'border-amber-500',
    buttonColor: 'text-amber-600',
  },
];

export default function HomePage() {
  const latestNews = NEWS_ARTICLES.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0D2137] via-[#1565A0] to-[#2B7CB8] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-28">
          <div className="flex flex-col items-start gap-2 mb-6">
            <span className="bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1 rounded-full">
              中国特种设备检测研究院
            </span>
            <span className="bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1 rounded-full">
              嘉兴市长三角氢安全研究中心
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 max-w-3xl">
            氢能全生命周期
            <br />
            <span className="text-[#6DD5A0]">碳足迹</span>量化与低碳减排效能评估
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
            基于国家标准方法学，构建氢气制取、加注、用氢车辆全链条碳排放核算体系，
            为氢能产业低碳发展提供科学量化工具与决策支撑。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/production"
              className="inline-block bg-[#2D8C3C] hover:bg-[#24742F] text-white px-8 py-3 rounded-lg font-medium no-underline transition-colors shadow-lg"
            >
              开始计算
            </Link>
            <Link
              to="/about"
              className="inline-block border-2 border-white/60 hover:border-white text-white px-8 py-3 rounded-lg font-medium no-underline transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m) => (
            <div
              key={m.path}
              className={`bg-white rounded-xl shadow-lg border-t-4 ${m.borderColor} p-6 hover:shadow-xl transition-shadow`}
            >
              <div className="text-3xl mb-3">{m.icon}</div>
              <h3 className="text-lg font-bold text-[#1A2E44] mb-2">
                {m.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {m.description}
              </p>
              <Link
                to={m.path}
                className={`text-sm font-medium ${m.buttonColor} no-underline hover:underline`}
              >
                进入模块 &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* About Section - 平台支撑单位 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-[#1A2E44] text-center mb-2">
          平台支撑单位
        </h2>
        <p className="text-gray-500 text-center mb-10 text-sm">
          依托国内权威科研机构，保障平台数据与方法学的专业性
        </p>
        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
          {/* Org 1 */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="./logo-csei.png"
                alt="CSEI Logo"
                className="h-14 w-auto"
              />
              <div>
                <h3 className="font-bold text-[#1A2E44]">
                  中国特种设备检测研究院
                </h3>
                <p className="text-xs text-gray-400">
                  China Special Equipment Inspection and Research Institute
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              中国特种设备检测研究院（简称中国特检院，CSEI）始建于1979年，是国家市场监督管理总局直属事业单位，
              承担特种设备安全与节能领域的技术检验、科学研究和标准制定工作，是我国特种设备安全技术的权威机构。
            </p>
            <a
              href="https://www.csei.org.cn/page/navigationListTwo?catid=11&parentid=10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-[#1565A0] font-medium hover:underline"
            >
              查看更多 &rarr;
            </a>
          </div>
          {/* Org 2 */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="./logo.png"
                alt="H2 Safety Center Logo"
                className="h-14 w-auto"
              />
              <div>
                <h3 className="font-bold text-[#1A2E44]">
                  嘉兴市长三角氢安全研究中心
                </h3>
                <p className="text-xs text-gray-400">
                  Yangtze River Delta Hydrogen Safety Research Center
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              嘉兴市长三角氢安全研究中心是由中国特种设备检测研究院、嘉兴港区管委会和同济大学共同发起组建的新型研发机构，
              围绕制氢、储氢、运氢、用氢等重点领域开展检验检测、安全评估与标准研制工作。
            </p>
            <a
              href="https://mp.weixin.qq.com/s/T9d_Hk80zrpoo2jyWknOMw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-[#1565A0] font-medium hover:underline"
            >
              查看更多 &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1A2E44] mb-1">
              新闻动态
            </h2>
            <p className="text-gray-500 text-sm">
              了解氢能产业与平台最新进展
            </p>
          </div>
          <Link
            to="/news"
            className="text-sm text-[#1565A0] font-medium no-underline hover:underline"
          >
            查看全部 &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl shadow-md overflow-hidden no-underline hover:shadow-lg transition-shadow"
            >
              <div className="h-40 bg-gradient-to-br from-[#1565A0] to-[#2B7CB8] flex items-center justify-center overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-[#1A2E44] mb-2 line-clamp-2 group-hover:text-[#1565A0] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-400">{article.date}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
