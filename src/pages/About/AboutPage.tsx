export default function AboutPage() {
  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#0D2137] via-[#1565A0] to-[#2B7CB8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">关于我们</h1>
          <p className="text-white/70 text-lg">
            专业、权威、科学的氢能碳足迹量化平台
          </p>
        </div>
      </section>

      {/* 平台介绍 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-[#1A2E44] text-center mb-3">
          平台介绍
        </h2>
        <p className="text-gray-500 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
          氢能全生命周期碳足迹量化与低碳减排效能评估平台，依据GB/T等国家标准方法学，
          构建覆盖氢气制取、氢气加注、用氢车辆全链条的碳排放核算体系，
          为氢能产业的低碳化发展提供科学量化工具与决策支撑。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              emoji: '🔗',
              title: '全链条覆盖',
              desc: '涵盖氢气制取、加注、车辆使用全生命周期，构建完整的碳排放核算链。',
            },
            {
              emoji: '📋',
              title: '标准方法学',
              desc: '参考GB/T 32151、GB/T 33760、ISCC EU 205及PAS 2050等国家及国际标准，形成标准碳排放计算方法，确保计算方法的科学性和合规性。',
            },
            {
              emoji: '🏛️',
              title: '专业权威',
              desc: '由中国特检院与长三角氢安全研究中心联合支撑，保障数据与模型的专业性。',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="font-bold text-[#1A2E44] mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 支撑单位 */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1A2E44] text-center mb-10">
            支撑单位
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CSEI */}
            <div className="border border-gray-100 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-5">
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
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                始建于1979年，国家市场监督管理总局直属事业单位，承担特种设备安全与节能领域的技术检验、
                科学研究和标准制定工作，是我国特种设备安全技术的权威机构。
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1565A0]">1353</div>
                  <div className="text-xs text-gray-400 mt-1">员工</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1565A0]">400+</div>
                  <div className="text-xs text-gray-400 mt-1">科研项目</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1565A0]">9</div>
                  <div className="text-xs text-gray-400 mt-1">国家科技奖</div>
                </div>
              </div>
            </div>

            {/* H2 Safety Center */}
            <div className="border border-gray-100 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-5">
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
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                由中国特种设备检测研究院、嘉兴港区管委会和同济大学共同发起组建的新型研发机构，
                围绕制氢、储氢、运氢、用氢等重点领域开展检验检测、安全评估与标准研制工作。
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2D8C3C]">600+</div>
                  <div className="text-xs text-gray-400 mt-1">气瓶试验</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2D8C3C]">30+</div>
                  <div className="text-xs text-gray-400 mt-1">测试装备</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2D8C3C]">1亿+</div>
                  <div className="text-xs text-gray-400 mt-1">科研经费</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
