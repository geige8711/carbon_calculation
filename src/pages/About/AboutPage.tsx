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
        <p className="text-gray-500 text-center max-w-3xl mx-auto mb-4 leading-relaxed">
          氢能全生命周期碳足迹量化与低碳减排效能评估平台，由中国特种设备检测研究院与嘉兴市长三角氢安全研究中心联合打造，是面向氢能产业低碳化发展的数字评估工具。
        </p>
        <p className="text-gray-500 text-center max-w-3xl mx-auto mb-4 leading-relaxed">
          平台参考结合国家及国际标准碳排放计算方法，构建覆盖氢气制取、氢气运输、氢气加注、用氢车辆应用的全链条碳排放核算体系，可精准核算电解水制氢、天然气制氢、煤制氢等多元制氢工艺，以及管道运输、运氢车运输、加氢站运营等全环节的碳排放，同时通过燃料电池汽车与传统燃油汽车的对标分析，科学评估氢能车辆的碳减排效能与综合环境效益。
        </p>
        <p className="text-gray-500 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
          平台依托国家级科研机构的技术标准与数据优势，为氢能产业政策制定、技术路线选型、低碳项目落地、减排效能验证提供权威量化依据与专业决策支撑，助力氢能全产业链绿色低碳高质量发展。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              emoji: '🔗',
              title: '全链适配',
              desc: '覆盖氢能制、储、运、加、用全产业链，兼容多元制氢工艺与储运加场景，可满足不同技术路线、不同运营主体的差异化碳足迹核算与评估需求。',
            },
            {
              emoji: '📋',
              title: '遵循标准',
              desc: '参考GB/T 32151、GB/T 33760、ISCC EU 205及PAS 2050等国家及国际标准，形成标准化碳排放计算方法，确保计算过程的科学性与结果的合规性。',
            },
            {
              emoji: '🏛️',
              title: '权威支撑',
              desc: '依托中国特检院与长三角氢安全研究中心的科研力量，汇聚氢能领域权威技术与标准资源，保障平台数据来源与核算模型的专业性、权威性。',
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
                国家市场监督管理总局直属事业单位，深耕氢能储运装备安全领域，牵头建设全国首个氢能领域市场监管重点实验室，具备高压储氢装备全项检测与安全评定能力。
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1565A0]">400+</div>
                  <div className="text-xs text-gray-400 mt-1">科研项目</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1565A0]">2000+</div>
                  <div className="text-xs text-gray-400 mt-1">检验资质</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1565A0]">1000+</div>
                  <div className="text-xs text-gray-400 mt-1">标准制定</div>
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
                由中国特种设备检测研究院、嘉兴港区管委会和同济大学共同组建的新型研发机构，专注于氢能全链条检验检测、在线监测、标准研制、技术研究等领域的专业技术支撑机构。
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2D8C3C]">400+</div>
                  <div className="text-xs text-gray-400 mt-1">监测装备</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2D8C3C]">100+</div>
                  <div className="text-xs text-gray-400 mt-1">服务企业</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2D8C3C]">60%+</div>
                  <div className="text-xs text-gray-400 mt-1">硕博占比</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
