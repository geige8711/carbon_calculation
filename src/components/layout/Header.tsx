import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const calcSubModules = [
  { path: '/production', label: '氢气制取' },
  { path: '/refueling', label: '氢气加注' },
  { path: '/transport', label: '氢气运输' },
  { path: '/vehicle', label: '用氢车辆' },
];

export default function Header() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCalcOpen, setMobileCalcOpen] = useState(false);

  const isCalcActive = ['/production', '/refueling', '/transport', '/vehicle'].some((p) =>
    location.pathname.startsWith(p),
  );
  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium no-underline transition-colors rounded-md ${
      active ? 'bg-[#1565A0] text-white' : 'text-[#1A2E44] hover:bg-[#1565A0]/10'
    }`;

  const closeAll = () => {
    setMobileMenuOpen(false);
    setMobileCalcOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main header */}
      <div className="bg-white border-b-[3px] border-[#1565A0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
          {/* Left: logos + title */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 no-underline min-w-0" onClick={closeAll}>
            <img src="/logo-csei.png" alt="CSEI" className="h-8 sm:h-[44px] w-auto shrink-0" />
            <div className="w-px h-6 sm:h-8 bg-gray-300 shrink-0" />
            <img src="/logo.png" alt="Center" className="h-8 sm:h-[44px] w-auto shrink-0" />
            <div className="ml-1 sm:ml-2 min-w-0 hidden sm:block">
              <div className="text-[#1A2E44] font-bold text-sm lg:text-base leading-tight truncate">
                氢能全生命周期碳足迹量化与低碳减排效能评估平台
              </div>
              <div className="text-[#1565A0] text-[10px] lg:text-xs leading-tight mt-0.5 truncate hidden lg:block">
                Hydrogen Life-Cycle Carbon Footprint Quantification &amp; Low-Carbon Emission Reduction Platform
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            <Link to="/" className={navLinkClass(isActive('/'))}>首页</Link>
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className={`${navLinkClass(isCalcActive)} cursor-pointer border-none`}>
                碳排放计算 <span className="ml-1 text-xs">&#9662;</span>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {calcSubModules.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-4 py-2 text-sm no-underline transition-colors ${
                        isActive(item.path) ? 'bg-[#1565A0]/10 text-[#1565A0] font-medium' : 'text-[#1A2E44] hover:bg-[#1565A0]/5'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/news" className={navLinkClass(isActive('/news'))}>新闻动态</Link>
            <Link to="/standards" className={navLinkClass(isActive('/standards'))}>标准查询</Link>
            <Link to="/about" className={navLinkClass(isActive('/about'))}>关于我们</Link>
            <Link to="/contact" className={navLinkClass(isActive('/contact'))}>联系我们</Link>
            <div className="flex items-center gap-2 ml-4 text-sm shrink-0">
              <span className="cursor-pointer text-[#1A2E44] hover:text-[#1565A0]">登录</span>
              <span className="text-gray-300">|</span>
              <span className="cursor-pointer text-[#1A2E44] hover:text-[#1565A0]">注册</span>
            </div>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-[#1A2E44] cursor-pointer border-none bg-transparent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white pb-3">
            <div className="max-w-7xl mx-auto px-4 space-y-1 pt-2">
              {/* Show platform name on mobile */}
              <div className="text-[#1A2E44] font-bold text-sm py-2 sm:hidden">
                氢能碳足迹量化与减排评估平台
              </div>
              <Link to="/" onClick={closeAll} className={`block ${navLinkClass(isActive('/'))}`}>首页</Link>
              <div>
                <button
                  onClick={() => setMobileCalcOpen(!mobileCalcOpen)}
                  className={`w-full text-left ${navLinkClass(isCalcActive)} cursor-pointer border-none`}
                >
                  碳排放计算 <span className="ml-1 text-xs">{mobileCalcOpen ? '▴' : '▾'}</span>
                </button>
                {mobileCalcOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {calcSubModules.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeAll}
                        className={`block px-4 py-2 text-sm rounded-md no-underline ${
                          isActive(item.path) ? 'bg-[#1565A0]/10 text-[#1565A0] font-medium' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/news" onClick={closeAll} className={`block ${navLinkClass(isActive('/news'))}`}>新闻动态</Link>
              <Link to="/standards" onClick={closeAll} className={`block ${navLinkClass(isActive('/standards'))}`}>标准查询</Link>
              <Link to="/about" onClick={closeAll} className={`block ${navLinkClass(isActive('/about'))}`}>关于我们</Link>
              <Link to="/contact" onClick={closeAll} className={`block ${navLinkClass(isActive('/contact'))}`}>联系我们</Link>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-sm">
                <span className="cursor-pointer text-[#1A2E44]">登录</span>
                <span className="text-gray-300">|</span>
                <span className="cursor-pointer text-[#1A2E44]">注册</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
