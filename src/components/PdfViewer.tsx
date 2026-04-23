import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      setLoading(true);
      setError('');
      try {
        const doc = await pdfjsLib.getDocument({ url, withCredentials: false }).promise;
        if (cancelled) return;
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
    return () => { cancelled = true; };
  }, [url]);

  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current) return;
    let cancelled = false;

    const renderPage = async () => {
      const page = await pdfDocRef.current!.getPage(currentPage);
      if (cancelled) return;

      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: ctx, viewport, canvas: canvas }).promise;
    };

    renderPage();
    return () => { cancelled = true; };
  }, [currentPage, scale, numPages]);

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

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-center gap-3 px-4 py-2 bg-gray-200 border-b border-gray-300 shrink-0 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded bg-white border border-gray-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <span className="text-gray-600">
          {currentPage} / {numPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          disabled={currentPage >= numPages}
          className="px-3 py-1 rounded bg-white border border-gray-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          下一页
        </button>
        <span className="text-gray-300 mx-1">|</span>
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
          className="px-2 py-1 rounded bg-white border border-gray-300 cursor-pointer"
        >
          −
        </button>
        <span className="text-gray-600 w-14 text-center">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale((s) => Math.min(3, s + 0.2))}
          className="px-2 py-1 rounded bg-white border border-gray-300 cursor-pointer"
        >
          +
        </button>
      </div>
      {/* Canvas */}
      <div ref={containerRef} className="flex-1 overflow-auto bg-gray-300 flex justify-center p-4" onContextMenu={(e) => e.preventDefault()}>
        <canvas ref={canvasRef} className="shadow-lg" />
      </div>
    </div>
  );
}
