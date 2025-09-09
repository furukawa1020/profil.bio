'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

// カスタムSVGアイコンコンポーネント
const ArticleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TagIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 12.9949 20.8709 12.745 20.8709C12.4951 20.8709 12.2557 20.766 12.07 20.58L2.29 10.8C2.19896 10.7094 2.12759 10.6008 2.08 10.48L0.32 4.91C0.285164 4.80579 0.275938 4.69459 0.292813 4.58551C0.309687 4.47643 0.35218 4.37278 0.416666 4.28284C0.481152 4.1929 0.565707 4.11928 0.664013 4.06785C0.762319 4.01641 0.871362 3.98854 0.982 3.98654H1.09L6.68 2.22654C6.80004 2.17896 6.90858 2.10759 6.999 2.01654L16.779 2.22654C17.0266 2.22654 17.2642 2.32477 17.4398 2.50031C17.6154 2.67584 17.7136 2.91344 17.7136 3.16104C17.7136 3.40864 17.6154 3.64624 17.4398 3.82177L20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10.5" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5", filled = false }: { className?: string, filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39469C21.7563 5.72726 21.351 5.12087 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  language: string;
  conviction_count: number;
  created_at: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-e46a.up.railway.app';
      const response = await fetch(`${apiUrl}/api/v1/articles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // 記事がない場合
          setArticles([]);
          return;
        }
        throw new Error(`HTTP ${response.status}: 記事の取得に失敗しました`);
      }
      
      const data = await response.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('記事の読み込みに失敗しました。しばらくしてから再度お試しください。');
      
      // デモ用記事データ（バックエンドが利用できない場合）
      setArticles([
        {
          id: 1,
          title: "Next.jsとGoを使ったフルスタック開発",
          content: "モダンなWebアプリケーション開発において、Next.jsをフロントエンド、Goをバックエンドに使用することで、高性能で保守性の高いシステムを構築できます。この記事では、実際のプロジェクトを通じて得られた知見を共有します...",
          author: "畠山龍次",
          language: "日本語",
          conviction_count: 15,
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          title: "Rustで学ぶシステムプログラミング",
          content: "Rustは安全性とパフォーマンスを両立できる現代的なシステムプログラミング言語です。メモリ安全性を保証しながら、ゼロコスト抽象化を実現する仕組みについて解説します...",
          author: "畠山龍次",
          language: "日本語",
          conviction_count: 23,
          created_at: "2024-01-10T14:30:00Z"
        },
        {
          id: 3,
          title: "技術と社会の未来について考える",
          content: "AI技術の急速な発展により、我々の社会は大きな変革期を迎えています。技術者として、社会に対してどのような責任を持つべきか、そして技術をどう活用していくべきかについて考察します...",
          author: "畠山龍次",
          language: "日本語",
          conviction_count: 31,
          created_at: "2024-01-05T09:15:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConviction = async (articleId: number) => {
    try {
      // 楽観的更新
      const wasLiked = likedArticles.has(articleId);
      const newLikedArticles = new Set(likedArticles);
      
      if (wasLiked) {
        newLikedArticles.delete(articleId);
      } else {
        newLikedArticles.add(articleId);
      }
      
      setLikedArticles(newLikedArticles);
      
      // 記事の納得数を更新
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, conviction_count: article.conviction_count + (wasLiked ? -1 : 1) }
          : article
      ));

      // バックエンドに送信
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-e46a.up.railway.app';
      const response = await fetch(`${apiUrl}/api/v1/conviction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_id: articleId.toString() }),
      });
      
      if (!response.ok) {
        // 失敗した場合は元に戻す
        setLikedArticles(likedArticles);
        setArticles(prev => prev.map(article => 
          article.id === articleId 
            ? { ...article, conviction_count: article.conviction_count + (wasLiked ? 1 : -1) }
            : article
        ));
        console.error('納得の送信に失敗しました');
      }
    } catch (err) {
      console.error('納得の送信エラー:', err);
      // エラーの場合も元に戻す
      setLikedArticles(likedArticles);
      fetchArticles(); // 最新データを再取得
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '日付不明';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <div className="text-lg text-gray-600">記事を読み込み中...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ArticleIcon className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">記事・考察</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            技術、社会、そして未来について考えたことを書いています
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-600">{error}</p>
            </div>
            <button 
              onClick={fetchArticles}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              再試行
            </button>
          </div>
        )}

        {/* 記事一覧 */}
        <div className="space-y-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {article.content.substring(0, 200)}
                      {article.content.length > 200 && '...'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <TagIcon className="w-4 h-4" />
                        <span>{article.language}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span>by {article.author}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleConviction(article.id)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          likedArticles.has(article.id)
                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                            : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <HeartIcon className="w-4 h-4" filled={likedArticles.has(article.id)} />
                        <span>納得 {article.conviction_count}</span>
                      </button>

                      {/* シェアボタン */}
                      <ShareButtons
                        url={`/articles/${article.id}`}
                        title={article.title}
                        description={article.content.substring(0, 100)}
                        className="ml-auto"
                      />
                      
                      <Link
                        href={`/articles/${article.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <span>続きを読む</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-12">
              <ArticleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">記事がまだありません</h3>
              <p className="text-gray-600">近日中に記事を公開予定です</p>
            </div>
          )}
        </div>

        {/* ナビゲーション */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <span>← ホームに戻る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
