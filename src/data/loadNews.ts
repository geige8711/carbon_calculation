// 从 OSS 动态加载新闻列表；失败时回退到内置 NEWS_ARTICLES 静态数据。
import type { NewsArticle } from './newsArticles';
import { NEWS_ARTICLES } from './newsArticles';

const ARTICLES_URL =
  'https://yrhsl.oss-cn-shanghai.aliyuncs.com/news/articles.json';

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const r = await fetch(ARTICLES_URL, { cache: 'default' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('OSS articles.json 为空或格式不对');
    }
    return data as NewsArticle[];
  } catch (e) {
    // 静默回退：浏览器控制台留 warn，UI 用静态数据
    console.warn('[loadNews] 拉取 OSS 失败，回退到内置数据:', e);
    return NEWS_ARTICLES;
  }
}
