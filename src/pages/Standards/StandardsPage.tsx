import { useState, useMemo } from 'react';
import standardsData from '@/data/standards.json';
import PdfViewer from '@/components/PdfViewer';

const PAGE_SIZE = 20;

interface Standard {
  id: string;
  name: string;
  fileName: string;
  type: string;
  category: string[];
  url: string;
}

const CATEGORY_TREE = [
  {
    label: 'TSG法规',
    key: 'TSG法规',
    children: [],
  },
  {
    label: '国内标准',
    key: '国内标准',
    children: [
      {
        label: '国家标准',
        key: '国家标准',
        children: [
          { label: 'GB标准', key: 'GB' },
          { label: 'GJB标准', key: 'GJB' },
        ],
      },
      {
        label: '行业标准',
        key: '行业标准',
        children: [
          { label: 'AQ安全行业标准', key: 'AQ安全行业标准' },
          { label: 'CCS中国船级社', key: 'CCS中国船级社' },
          { label: 'HG化工行业标准', key: 'HG化工行业标准' },
          { label: 'JB机械行业标准', key: 'JB机械行业标准' },
          { label: 'JC建材行业标准', key: 'JC建材行业标准' },
          { label: 'JJG计量检定行业标准', key: 'JJG计量检定行业标准' },
          { label: 'JT交通行业标准', key: 'JT交通行业标准行业标准' },
          { label: 'NB能源行业标准', key: 'NB能源行业标准' },
          { label: 'QB轻工业行业标准', key: 'QB轻工业行业标准' },
          { label: 'QC汽车行业标准', key: 'QC汽车行业标准' },
          { label: 'SH石油化工行业标准', key: 'SH石油化工行业标准' },
          { label: 'SJ电子行业标准', key: 'SJ电子行业标准' },
          { label: 'SY石油天然气行业标准', key: 'SY石油天然气行业标准' },
          { label: 'TB铁道行业标准', key: 'TB铁道行业标准' },
          { label: 'YB冶金行业标准', key: 'YB冶金行业标准' },
          { label: 'YS有色金属行业标准', key: 'YS有色金属行业标准' },
        ],
      },
    ],
  },
  {
    label: '国际标准',
    key: '国外标准',
    children: [
      {
        label: '国际',
        key: '国际',
        children: [
          { label: 'ISO国际标准', key: 'ISO国际标准' },
          { label: 'IMDG国际危险货物海运规则', key: 'IMDG国际危险货物海运规则' },
          { label: 'TIR国际公路运输协定', key: 'TIR国际公路运输协定' },
          { label: 'UIC国际铁道联盟', key: 'UIC国际铁道联盟' },
          { label: 'UN-16联合国危险货物建议书', key: 'UN-16联合国危险货物建议书' },
        ],
      },
      {
        label: '欧洲',
        key: '欧洲',
        children: [
          { label: 'ADR国际危险货物公路运输欧洲协定', key: 'ADR国际危险货物公路运输欧洲协定' },
          { label: 'AQIS澳大利亚标准', key: 'AQIS澳大利亚标准' },
          { label: 'BS英国标准', key: 'BS英国标准' },
          { label: 'DIN德国标准', key: 'DIN德国标准' },
          { label: 'EC欧盟承压设备指令', key: 'EC欧盟承压设备指令' },
          { label: 'EN欧盟标准', key: 'EN欧盟标准' },
          { label: 'GL德国船级社', key: 'GL德国船级社' },
          { label: 'RID危险货物国际铁路运输规范', key: 'RID危险货物国际铁路运输规范' },
        ],
      },
      {
        label: '美国',
        key: '美国',
        children: [
          { label: 'ABS美国船级社', key: 'ABS美国船级社' },
          { label: 'ANSI美国国家标准协会', key: 'ANSI美国国家标准协会' },
          { label: 'API美国石油学会', key: 'API美国石油学会' },
          { label: 'ASCE美国土木工程师协会', key: 'ASCE美国土木工程师协会' },
          { label: 'ASME美国机械工程师协会', key: 'ASME美国机械工程师协会' },
          { label: 'ASNT美国无损检测社团', key: 'ASNT美国无损检测社团' },
          { label: 'ASTM美国材料与试验协会', key: 'ASTM美国材料与试验协会' },
          { label: 'AS美国标准', key: 'AS美国标准' },
          { label: 'AWS美国焊接协会', key: 'AWS美国焊接协会' },
          { label: 'CGA美国压缩燃气协会', key: 'CGA美国压缩燃气协会' },
          { label: 'DOT美国交通法', key: 'DOT美国交通法' },
          { label: 'MSS美国阀门和配件工业制造商标准化协会', key: 'MSS美国阀门和配件工业制造商标准化协会' },
          { label: 'NFPA美国消防协会', key: 'NFPA美国消防协会' },
          { label: 'SSPC美国防护涂料协会', key: 'SSPC美国防护涂料协会' },
          { label: 'TEMA美国列管式换热器制造商协会', key: 'TEMA美国列管式换热器制造商协会' },
        ],
      },
      {
        label: '日本',
        key: '日本',
        children: [
          { label: 'JIS日本工业标准', key: 'JIS日本工业标准' },
        ],
      },
    ],
  },
];

type CategoryNode = { label: string; key: string; children?: CategoryNode[] };

function matchesCategory(standard: Standard, path: string[]): boolean {
  for (let i = 0; i < path.length; i++) {
    if (!standard.category[i] || standard.category[i] !== path[i]) return false;
  }
  return true;
}

function CategorySidebar({
  nodes,
  path,
  selected,
  onSelect,
  depth = 0,
}: {
  nodes: CategoryNode[];
  path: string[];
  selected: string[];
  onSelect: (path: string[]) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    nodes.forEach((n) => {
      if (n.children && n.children.length > 0) init[n.key] = true;
    });
    return init;
  });

  return (
    <ul className={`list-none p-0 m-0 ${depth > 0 ? 'ml-4' : ''}`}>
      {nodes.map((node) => {
        const currentPath = [...path, node.key];
        const isSelected =
          selected.length === currentPath.length &&
          selected.every((v, i) => v === currentPath[i]);
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expanded[node.key];

        return (
          <li key={node.key}>
            <div className="flex items-center">
              {hasChildren && (
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [node.key]: !prev[node.key],
                    }))
                  }
                  className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer border-none bg-transparent p-0 shrink-0"
                >
                  <svg
                    className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 4l8 6-8 6V4z" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onSelect(currentPath)}
                className={`text-left text-sm py-1.5 px-2 rounded-md cursor-pointer border-none bg-transparent flex-1 transition-colors ${
                  isSelected
                    ? 'text-[#1565A0] font-semibold bg-[#1565A0]/10'
                    : 'text-gray-700 hover:text-[#1565A0] hover:bg-gray-100'
                } ${!hasChildren ? 'ml-5' : ''}`}
              >
                {node.label}
              </button>
            </div>
            {hasChildren && isExpanded && (
              <CategorySidebar
                nodes={node.children!}
                path={currentPath}
                selected={selected}
                onSelect={onSelect}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function StandardsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<Standard | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const filtered = useMemo(() => {
    let results = standardsData as Standard[];

    if (selectedCategory.length > 0) {
      results = results.filter((s) => matchesCategory(s, selectedCategory));
    }

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      results = results.filter(
        (s) =>
          s.id.toLowerCase().includes(keyword) ||
          s.name.toLowerCase().includes(keyword) ||
          s.fileName.toLowerCase().includes(keyword),
      );
    }

    return results;
  }, [search, selectedCategory]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategorySelect = (path: string[]) => {
    setSelectedCategory((prev) =>
      prev.length === path.length && prev.every((v, i) => v === path[i])
        ? []
        : path,
    );
    setPage(1);
  };

  const categoryLabel = selectedCategory.length > 0
    ? selectedCategory[selectedCategory.length - 1]
    : '全部标准';

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#0D2137] via-[#1565A0] to-[#2B7CB8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">标准查询</h1>
          <p className="text-white/70 text-lg">
            查询相关国家标准与行业标准
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h3 className="text-sm font-semibold text-[#1A2E44] mb-3">
                标准分类
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory([]);
                  setPage(1);
                }}
                className={`w-full text-left text-sm py-1.5 px-2 rounded-md cursor-pointer border-none bg-transparent mb-2 transition-colors ${
                  selectedCategory.length === 0
                    ? 'text-[#1565A0] font-semibold bg-[#1565A0]/10'
                    : 'text-gray-700 hover:text-[#1565A0] hover:bg-gray-100'
                }`}
              >
                全部标准
              </button>
              <CategorySidebar
                nodes={CATEGORY_TREE}
                path={[]}
                selected={selectedCategory}
                onSelect={handleCategorySelect}
              />
            </div>
          </aside>

          {/* Mobile category toggle */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#1565A0] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer border-none"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile sidebar overlay */}
          {showSidebar && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setShowSidebar(false)}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-sm font-semibold text-[#1A2E44] mb-3">
                  标准分类
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategory([]);
                    setPage(1);
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left text-sm py-1.5 px-2 rounded-md cursor-pointer border-none bg-transparent mb-2 transition-colors ${
                    selectedCategory.length === 0
                      ? 'text-[#1565A0] font-semibold bg-[#1565A0]/10'
                      : 'text-gray-700 hover:text-[#1565A0] hover:bg-gray-100'
                  }`}
                >
                  全部标准
                </button>
                <CategorySidebar
                  nodes={CATEGORY_TREE}
                  path={[]}
                  selected={selectedCategory}
                  onSelect={(path) => {
                    handleCategorySelect(path);
                    setShowSidebar(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-xl">
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
              <div className="flex items-center gap-3 mt-3">
                <p className="text-sm text-gray-500">
                  {categoryLabel} · 共 {filtered.length} 条标准
                </p>
              </div>
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
                      <span className="text-sm text-[#1A2E44] group-hover:text-[#1565A0] transition-colors flex-1">
                        {standard.name}
                      </span>
                      <span className="hidden sm:inline text-xs text-gray-400 shrink-0">
                        {standard.type.toUpperCase()} · 点击预览
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
        </div>
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
                <h3 className="font-bold text-[#1A2E44] truncate">
                  {preview.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {preview.id} · {preview.type.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer border-none bg-transparent shrink-0"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 bg-gray-100 min-h-0">
              {preview.type === 'pdf' ? (
                <PdfViewer url={preview.url} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                  <p className="text-lg">该文件为 {preview.type.toUpperCase()} 格式</p>
                  <a
                    href={preview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1565A0] text-white px-6 py-2.5 rounded-lg text-sm font-medium no-underline hover:bg-[#124f82] transition-colors"
                  >
                    下载查看
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
