import { useState } from 'react';
import { NEWS_ARTICLES, NEWS_CATEGORIES } from '@/data/newsArticles';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const filteredArticles =
    activeCategory === '全部'
      ? NEWS_ARTICLES
      : NEWS_ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#0D2137] via-[#1565A0] to-[#2B7CB8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">新闻动态</h1>
          <p className="text-white/70 text-lg">
            了解氢能产业政策、科研进展与平台最新动态
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-[#1565A0] text-white border-[#1565A0]'
                  : 'bg-white text-[#1A2E44] border-gray-200 hover:border-[#1565A0] hover:text-[#1565A0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-5 bg-white rounded-xl shadow-sm hover:shadow-md p-4 no-underline transition-shadow"
            >
              <div className="flex-shrink-0 w-[160px] h-[120px] rounded-lg overflow-hidden bg-gradient-to-br from-[#1565A0] to-[#2B7CB8]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h3 className="text-sm font-bold text-[#1A2E44] mb-1.5 line-clamp-2 group-hover:text-[#1565A0] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                  {article.summary}
                </p>
                <span className="text-xs text-gray-400">{article.date}</span>
              </div>
            </a>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            暂无该分类下的新闻
          </div>
        )}
      </div>
    </div>
  );
}
