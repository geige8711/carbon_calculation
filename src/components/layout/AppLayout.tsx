import { Link, Outlet } from 'react-router-dom';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-[#f5f7fa]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0D2137] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Platform info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold leading-snug">
                氢能全生命周期碳足迹量化
                <br />
                与低碳减排效能评估平台
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                基于标准方法学，为氢能产业提供全链条碳排放核算与减排效能评估服务。
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="/logo-csei.png"
                  alt="CSEI Logo"
                  className="h-10 rounded bg-white/90 p-1"
                />
                <img
                  src="/logo.png"
                  alt="Center Logo"
                  className="h-10 rounded bg-white/90 p-1"
                />
              </div>
            </div>

            {/* Col 2: 计算模块 */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wider">
                计算模块
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <Link
                    to="/production"
                    className="text-sm text-white/60 hover:text-white no-underline transition-colors"
                  >
                    氢气制取
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refueling"
                    className="text-sm text-white/60 hover:text-white no-underline transition-colors"
                  >
                    氢气加注
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vehicle"
                    className="text-sm text-white/60 hover:text-white no-underline transition-colors"
                  >
                    用氢车辆
                  </Link>
                </li>
                <li>
                  <Link
                    to="/transport"
                    className="text-sm text-white/60 hover:text-white no-underline transition-colors"
                  >
                    氢气运输
                  </Link>
                </li>
                <li>
                  <Link
                    to="/standards"
                    className="text-sm text-white/60 hover:text-white no-underline transition-colors"
                  >
                    标准查询
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: 关于我们 */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wider">
                关于我们
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-white/60 hover:text-white no-underline transition-colors"
                  >
                    平台介绍
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news"
                    className="text-sm text-white/60 hover:text-white no-underline transition-colors"
                  >
                    新闻动态
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm text-white/60 hover:text-white no-underline transition-colors"
                  >
                    联系我们
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: 联系方式 */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wider">
                联系方式
              </h4>
              <div className="space-y-3 text-sm text-white/60">
                <p>浙江省嘉兴市嘉兴港区长三角（嘉兴）氢能产业园</p>
                <p>jiangyifan@yrhs.org.cn</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
            <span>
              &copy; {new Date().getFullYear()} 氢能全生命周期碳足迹量化与低碳减排效能评估平台
              版权所有
            </span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 no-underline mt-2 md:mt-0"
            >
              浙ICP备2026024561号-1
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
