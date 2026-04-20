import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const calcSubModules = [
  { path: '/production', label: '氢气制取' },
  { path: '/refueling', label: '氢气加注' },
  { path: '/vehicle', label: '用氢车辆' },
];

export default function Header() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isCalcActive = ['/production', '/refueling', '/vehicle'].some((p) =>
    location.pathname.startsWith(p),
  );

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium no-underline transition-colors rounded-md ${
      active
        ? 'bg-[#1565A0] text-white'
        : 'text-[#1A2E44] hover:bg-[#1565A0]/10'
    }`;

  return (
    <header>
      {/* Top bar */}
      <div className="bg-[#0D2137] text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-sm">
          <span className="opacity-90">
            国家市场监管重点实验室（氢能储运装备安全）
          </span>
          <div className="flex items-center gap-2 opacity-90">
            <span className="cursor-pointer hover:opacity-100">登录</span>
            <span>|</span>
            <span className="cursor-pointer hover:opacity-100">注册</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b-[3px] border-[#1565A0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: logos + title */}
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img
              src="./logo-csei.png"
              alt="CSEI Logo"
              className="h-[44px] w-auto"
            />
            <div className="w-px h-8 bg-gray-300" />
            <img
              src="./logo.png"
              alt="Center Logo"
              className="h-[44px] w-auto"
            />
            <div className="ml-2">
              <div className="text-[#1A2E44] font-bold text-base leading-tight">
                氢能全生命周期碳足迹量化与低碳减排效能评估平台
              </div>
              <div className="text-[#1565A0] text-xs leading-tight mt-0.5">
                Hydrogen Life-Cycle Carbon Footprint Quantification &amp; Low-Carbon Emission Reduction Platform
              </div>
            </div>
          </Link>

          {/* Right: nav */}
          <nav className="flex items-center gap-1">
            <Link to="/" className={navLinkClass(isActive('/'))}>
              首页
            </Link>

            {/* 碳排放计算 with dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`${navLinkClass(isCalcActive)} cursor-pointer border-none`}
              >
                碳排放计算
                <span className="ml-1 text-xs">&#9662;</span>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-0 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {calcSubModules.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-4 py-2 text-sm no-underline transition-colors ${
                        isActive(item.path)
                          ? 'bg-[#1565A0]/10 text-[#1565A0] font-medium'
                          : 'text-[#1A2E44] hover:bg-[#1565A0]/5'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/news" className={navLinkClass(isActive('/news'))}>
              新闻动态
            </Link>
            <Link to="/about" className={navLinkClass(isActive('/about'))}>
              关于我们
            </Link>
            <Link to="/contact" className={navLinkClass(isActive('/contact'))}>
              联系我们
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
