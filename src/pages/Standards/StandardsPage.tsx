import { useState, useMemo } from 'react';
import standardsData from '@/data/standards.json';
import PdfViewer from '@/components/PdfViewer';

const PAGE_SIZE = 20;

interface Standard {
  id: string;
  name: string;
  fileName: string;
  type: string;
  url: string;
}

export default function StandardsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<Standard | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return standardsData as Standard[];
    const keyword = search.trim().toLowerCase();
    return (standardsData as Standard[]).filter(
      (s) =>
        s.id.toLowerCase().includes(keyword) ||
        s.name.toLowerCase().includes(keyword) ||
        s.fileName.toLowerCase().includes(keyword),
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#0D2137] via-[#1565A0] to-[#2B7CB8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">标准查询</h1>
          <p className="text-white/70 text-lg">
            查询氢能相关国家标准与行业标准
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="输入标准编号或名称关键词搜索..."
              className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 focus:border-[#1565A0] focus:ring-2 focus:ring-[#1565A0]/20 outline-none text-sm"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            共 {filtered.length} 条标准
          </p>
        </div>

        {/* Standards List */}
        {paged.length > 0 ? (
          <div className="space-y-3">
            {paged.map((standard, idx) => (
              <div
                key={`${standard.fileName}-${idx}`}
                onClick={() => setPreview(standard)}
                className="bg-white rounded-lg shadow-sm border border-gray-100 px-5 py-4 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="inline-block bg-[#1565A0]/10 text-[#1565A0] text-xs font-medium px-3 py-1 rounded-full shrink-0">
                    {standard.id}
                  </span>
                  <span className="text-sm text-[#1A2E44] group-hover:text-[#1565A0] transition-colors">
                    {standard.name}
                  </span>
                  <span className="hidden sm:inline text-xs text-gray-400 ml-auto shrink-0">
                    点击预览
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            未找到匹配的标准
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
            >
              上一页
            </button>
            <span className="text-sm text-gray-600 px-4">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg text-sm border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
            >
              下一页
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div className="min-w-0">
                <h3 className="font-bold text-[#1A2E44] truncate">{preview.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{preview.id} · {preview.type.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer border-none bg-transparent shrink-0"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 bg-gray-100 min-h-0">
              <PdfViewer url={preview.url} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
