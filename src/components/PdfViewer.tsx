import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  url: string;
  onMinimize?: () => void;
}

type RenderTask = ReturnType<pdfjsLib.PDFPageProxy['render']>;

export default function PdfViewer({ url, onMinimize }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState('1');
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRenderTaskRef = useRef<RenderTask | null>(null);
  const wheelLockRef = useRef<number>(0);
  const pendingScrollRef = useRef<'top' | 'bottom' | null>(null);

  useEffect(() => {
    let cancelled = false;
    let loadedDoc: pdfjsLib.PDFDocumentProxy | null = null;

    const loadPdf = async () => {
      setLoading(true);
      setError('');
      try {
        const doc = await pdfjsLib.getDocument({
          url,
          withCredentials: false,
          cMapUrl: '/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: '/standard_fonts/',
        }).promise;
        if (cancelled) {
          doc.destroy().catch(() => {});
          return;
        }
        loadedDoc = doc;
        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError(`加载失败: ${e instanceof Error ? e.message : '未知错误'}`);
        setLoading(false);
      }
    };

    loadPdf();
    return () => {
      cancelled = true;
      if (loadedDoc) {
        loadedDoc.destroy().catch(() => {});
        if (pdfDocRef.current === loadedDoc) pdfDocRef.current = null;
      }
    };
  }, [url]);

  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current) return;
    let cancelled = false;

    const renderPage = async () => {
      // Cancel any in-flight render before starting a new one
      if (currentRenderTaskRef.current) {
        try {
          currentRenderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        currentRenderTaskRef.current = null;
      }

      let pageProxy: pdfjsLib.PDFPageProxy | null = null;
      try {
        pageProxy = await pdfDocRef.current!.getPage(currentPage);
        if (cancelled) return;

        const viewport = pageProxy.getViewport({ scale });
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const task = pageProxy.render({ canvasContext: ctx, viewport, canvas });
        currentRenderTaskRef.current = task;
        await task.promise;
        if (currentRenderTaskRef.current === task) {
          currentRenderTaskRef.current = null;
        }
        // 滚轮翻页后把新页面滚到合适位置：向下翻 → 顶部；向上翻 → 底部
        const scrollContainer = containerRef.current;
        if (scrollContainer && pendingScrollRef.current) {
          if (pendingScrollRef.current === 'top') {
            scrollContainer.scrollTop = 0;
          } else {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
          pendingScrollRef.current = null;
        }
      } catch (e) {
        // pdfjs throws RenderingCancelledException when cancel() is called — silent
        const name = (e as { name?: string })?.name;
        if (name !== 'RenderingCancelledException') {
          console.warn('PDF render error:', e);
        }
      } finally {
        // 释放当前页面解析数据（字体、图像缓存）；下次切回会重新解析
        if (pageProxy) {
          try { pageProxy.cleanup(); } catch { /* ignore */ }
        }
      }
    };

    renderPage();
    return () => {
      cancelled = true;
      if (currentRenderTaskRef.current) {
        try {
          currentRenderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [currentPage, scale, numPages]);

  // Esc to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    // Prevent body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreen]);

  // 输入框与当前页同步
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const jumpToInputPage = () => {
    const n = parseInt(pageInput, 10);
    if (Number.isNaN(n) || numPages === 0) {
      setPageInput(String(currentPage));
      return;
    }
    const clamped = Math.min(numPages, Math.max(1, n));
    if (clamped !== currentPage) setCurrentPage(clamped);
    else setPageInput(String(currentPage));
  };

  // 滚轮翻页：到达页面顶/底边缘后继续滚动则切换页面
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (numPages <= 1) return;
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const atTop = scrollTop <= 0;
    const now = Date.now();
    if (now - wheelLockRef.current < 450) return;

    if (e.deltaY > 0 && atBottom && currentPage < numPages) {
      wheelLockRef.current = now;
      pendingScrollRef.current = 'top';
      setCurrentPage((p) => Math.min(numPages, p + 1));
    } else if (e.deltaY < 0 && atTop && currentPage > 1) {
      wheelLockRef.current = now;
      pendingScrollRef.current = 'bottom';
      setCurrentPage((p) => Math.max(1, p - 1));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <svg className="animate-spin w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        正在加载文档...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p className="text-lg font-medium mb-1">文档加载失败</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const toolbarButtonClass = 'px-3 py-1 rounded bg-white border border-gray-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-50';

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[100] bg-white flex flex-col h-screen w-screen'
          : 'flex flex-col h-full'
      }
      role={isFullscreen ? 'dialog' : undefined}
      aria-modal={isFullscreen || undefined}
      aria-label={isFullscreen ? 'PDF 全屏查看' : undefined}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-center gap-3 px-4 py-2 bg-gray-200 border-b border-gray-300 shrink-0 text-sm flex-wrap">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className={toolbarButtonClass}
        >
          上一页
        </button>
        <span className="text-gray-600 inline-flex items-center gap-1">
          <input
            type="text"
            inputMode="numeric"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                jumpToInputPage();
                (e.target as HTMLInputElement).blur();
              }
            }}
            onBlur={jumpToInputPage}
            onFocus={(e) => e.target.select()}
            className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 text-sm bg-white focus:ring-1 focus:ring-[#1565A0] focus:border-[#1565A0] outline-none tabular-nums"
            aria-label="跳转页码"
            title="输入页码后按回车跳转"
          />
          <span>/ {numPages}</span>
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          disabled={currentPage >= numPages}
          className={toolbarButtonClass}
        >
          下一页
        </button>
        <span className="text-gray-300 mx-1">|</span>
        <button
          onClick={() => setScale((s) => Math.max(0.5, +(s - 0.2).toFixed(2)))}
          disabled={scale <= 0.5}
          className={toolbarButtonClass}
          aria-label="缩小"
        >
          −
        </button>
        <span className="text-gray-600 w-14 text-center tabular-nums">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale((s) => Math.min(3, +(s + 0.2).toFixed(2)))}
          disabled={scale >= 3}
          className={toolbarButtonClass}
          aria-label="放大"
        >
          +
        </button>
        <button
          onClick={() => setScale(1.2)}
          className={toolbarButtonClass}
          aria-label="重置缩放"
          title="重置缩放"
        >
          重置
        </button>
        <span className="text-gray-300 mx-1">|</span>
        {isFullscreen ? (
          <button
            onClick={() => setIsFullscreen(false)}
            className={toolbarButtonClass}
            aria-label="退出全屏"
            title="退出全屏 (Esc)"
          >
            退出全屏
          </button>
        ) : (
          <button
            onClick={() => setIsFullscreen(true)}
            className={toolbarButtonClass}
            aria-label="全屏"
            title="全屏"
          >
            全屏
          </button>
        )}
        {onMinimize && (
          <button
            onClick={() => {
              if (isFullscreen) setIsFullscreen(false);
              onMinimize();
            }}
            className={toolbarButtonClass}
            aria-label="最小化"
            title="最小化"
          >
            最小化
          </button>
        )}
      </div>
      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-300 p-4 text-center"
        onContextMenu={(e) => e.preventDefault()}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="shadow-lg inline-block" />
      </div>
    </div>
  );
}
