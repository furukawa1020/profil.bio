'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

// カスタムSVGアイコンコンポーネント
const FeedIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MessageIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5", filled = false }: { className?: string, filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39469C21.7563 5.72726 21.351 5.12087 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShareIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 6L12 2L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendingIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  author_id: string;
  likes_count: number;
  comments_count: number;
  conviction_meter: number;
  created_at: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const snsUrl = process.env.NEXT_PUBLIC_SNS_SERVICE_URL || 'https://profilbio-production.up.railway.app';
      const response = await fetch(`${snsUrl}/api/v1/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setPosts([]);
          return;
        }
        throw new Error(`HTTP ${response.status}: 投稿の取得に失敗しました`);
      }
      
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('投稿の読み込みに失敗しました。しばらくしてから再度お試しください。');
      
      // デモ用投稿データ
      setPosts([
        {
          id: 1,
          title: "新しいプロジェクトが始動",
          content: "今日から新しいフルスタックプロジェクトの開発を開始しました。Next.js、Go、Rust、Pythonを使った統合プラットフォームです。技術的な挑戦が多くありますが、とても楽しみです！",
          category: "技術",
          author_id: "畠山龍次",
          likes_count: 12,
          comments_count: 3,
          conviction_meter: 85,
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          title: "AI時代のエンジニアリング",
          content: "AI技術の進歩により、エンジニアの役割も変わってきています。単にコードを書くだけでなく、AIとの協働や新しい価値創造が重要になってきました。",
          category: "考察",
          author_id: "畠山龍次",
          likes_count: 18,
          comments_count: 7,
          conviction_meter: 92,
          created_at: "2024-01-14T14:30:00Z"
        },
        {
          id: 3,
          title: "今日の学び",
          content: "Rustの所有権システムについて深く学びました。最初は難しく感じましたが、理解すると非常に美しい設計だと感じます。メモリ安全性とパフォーマンスを両立する仕組みは本当によく考えられています。",
          category: "学習",
          author_id: "畠山龍次",
          likes_count: 9,
          comments_count: 2,
          conviction_meter: 78,
          created_at: "2024-01-13T09:15:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      // 楽観的更新
      const wasLiked = likedPosts.has(postId);
      const newLikedPosts = new Set(likedPosts);
      
      if (wasLiked) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      
      setLikedPosts(newLikedPosts);
      
      // 投稿のいいね数を更新
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: post.likes_count + (wasLiked ? -1 : 1) }
          : post
      ));

      // バックエンドに送信
      const snsUrl = process.env.NEXT_PUBLIC_SNS_SERVICE_URL || 'https://profilbio-production.up.railway.app';
      const response = await fetch(`${snsUrl}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // 失敗した場合は元に戻す
        setLikedPosts(likedPosts);
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, likes_count: post.likes_count + (wasLiked ? 1 : -1) }
            : post
        ));
        console.error('いいねの送信に失敗しました');
      }
    } catch (err) {
      console.error('いいねの送信エラー:', err);
      setLikedPosts(likedPosts);
      fetchPosts();
    }
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(posts.map(post => post.category)))];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '日付不明';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'all': return 'すべて';
      case '技術': return '技術';
      case '考察': return '考察';
      case '学習': return '学習';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-lg text-gray-600">フィードを読み込み中...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FeedIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">フィード</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            日々の学びと考えを共有する場所
          </p>
        </div>

        {/* カテゴリフィルター */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">カテゴリで絞り込み</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-600">{error}</p>
            </div>
            <button 
              onClick={fetchPosts}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              再試行
            </button>
          </div>
        )}

        {/* 投稿一覧 */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col gap-4">
                  {/* ヘッダー情報 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {post.author_id.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{post.author_id}</p>
                        <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      post.category === '技術' ? 'bg-green-100 text-green-800' :
                      post.category === '考察' ? 'bg-purple-100 text-purple-800' :
                      post.category === '学習' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.category}
                    </span>
                  </div>

                  {/* 投稿内容 */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{post.content}</p>
                  </div>

                  {/* 納得メーター */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">納得度</span>
                      <span className="text-sm font-semibold text-gray-900">{post.conviction_meter}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${post.conviction_meter}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          likedPosts.has(post.id)
                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                            : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <HeartIcon className="w-4 h-4" filled={likedPosts.has(post.id)} />
                        <span>{post.likes_count}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        <MessageIcon className="w-4 h-4" />
                        <span>{post.comments_count}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* シェアボタン */}
                      <ShareButtons
                        url={`/feed/post/${post.id}`}
                        title={post.title}
                        description={post.content.substring(0, 100)}
                        className="flex items-center gap-1"
                      />

                      <div className="flex items-center gap-1 text-purple-600 ml-2">
                        <TrendingIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">トレンド</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FeedIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">投稿がまだありません</h3>
              <p className="text-gray-600">近日中に投稿を追加予定です</p>
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
