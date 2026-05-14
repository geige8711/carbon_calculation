// 从 OSS 动态加载新闻列表；失败时回退到内置 NEWS_ARTICLES 静态数据。
import type { NewsArticle } from './newsArticles';
import { NEWS_ARTICLES } from './newsArticles';

// OSS 预签名 URL（到 2036-04-21 过期，与 standards 文件一致的签名机制）
// 签名授权任意 GET，内容动态：FC 每周日改写 articles.json，浏览器始终拿到最新版
const ARTICLES_URL =
  'https://yrhsl.oss-cn-shanghai.aliyuncs.com/news%2Farticles.json?Expires=2092341618&OSSAccessKeyId=LTAI5tF6wSBmj8bC79j4SwZB&Signature=PqtfjJ0NpjIRJzTIK%2FtSDKuLEOU%3D';

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
