'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// カスタムSVGアイコンコンポーネント
const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C19.0516 4.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const GithubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 19C4 20.5 4 16.5 2 16M22 16V22L18 20L14 22V16L18 14L22 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 22V18.13C16.0375 17.6532 15.9731 17.1738 15.811 16.7238C15.6489 16.2738 15.3929 15.8634 15.06 15.52C18.2 15.17 21.5 13.98 21.5 8.52C21.4997 7.12383 20.9627 5.7812 20 4.77C20.4559 3.54851 20.4236 2.19835 19.91 0.999999C19.91 0.999999 18.73 0.649999 16 2.48C13.708 1.85882 11.292 1.85882 9 2.48C6.27 0.649999 5.09 0.999999 5.09 0.999999C4.57638 2.19835 4.54414 3.54851 5 4.77C4.03013 5.7887 3.49252 7.14346 3.5 8.55C3.5 13.97 6.8 15.16 9.94 15.55C9.611 15.89 9.35726 16.2954 9.19531 16.7399C9.03335 17.1844 8.96681 17.6581 9 18.13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExternalLinkIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LinkedinIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95718 14.8821 3.284C14.0247 3.61083 13.2884 4.19445 12.773 4.95371C12.2575 5.71297 11.9877 6.61435 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39624C5.36074 6.60667 4.01032 5.43666 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CodeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowLeftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  philosophy_level: number;
  conviction_points: number;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const snsUrl = process.env.NEXT_PUBLIC_SNS_SERVICE_URL || 'https://profilbio-production.up.railway.app';
      const response = await fetch(`${snsUrl}/api/profile/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setProfile(null);
          return;
        }
        throw new Error(`HTTP ${response.status}: プロフィールの取得に失敗しました`);
      }
      
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('プロフィールの読み込みに失敗しました。');
      
      // デモ用プロフィールデータ
      setProfile({
        id: "1",
        username: "furukawa1020",
        display_name: "畠山龍次",
        bio: "フルスタックエンジニア。Next.js、Go、Rust、Pythonを使った統合プラットフォーム開発に取り組んでいます。技術と社会の再設計を通じて、より良い未来の創造を目指しています。",
        avatar_url: "",
        philosophy_level: 42,
        conviction_points: 1337,
        created_at: "2023-01-01T00:00:00Z"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-lg text-gray-600">プロフィールを読み込み中...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // デフォルトプロフィール情報
  const defaultProfile = profile || {
    id: "1",
    username: "furukawa1020",
    display_name: "畠山龍次",
    bio: "フルスタックエンジニア。Next.js、Go、Rust、Pythonを使った統合プラットフォーム開発に取り組んでいます。技術と社会の再設計を通じて、より良い未来の創造を目指しています。",
    avatar_url: "",
    philosophy_level: 42,
    conviction_points: 1337,
    created_at: "2023-01-01T00:00:00Z"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            ホームに戻る
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-600">{error}</p>
            </div>
            <button 
              onClick={fetchProfile}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              再試行
            </button>
          </div>
        )}

        {/* プロフィールカード */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* カバー画像 */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          {/* プロフィール情報 */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              {/* アバター */}
              <div className="relative -mt-16 mb-4 md:mb-0">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  {defaultProfile.avatar_url ? (
                    <img 
                      src={defaultProfile.avatar_url} 
                      alt="プロフィール画像" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              </div>

              {/* プロフィール詳細 */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {defaultProfile.display_name}
                    </h1>
                    <p className="text-gray-600">@{defaultProfile.username}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{defaultProfile.conviction_points}</div>
                      <div className="text-sm text-gray-600">納得ポイント</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{defaultProfile.philosophy_level}</div>
                      <div className="text-sm text-gray-600">レベル</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  {defaultProfile.bio}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>参加日: {formatDate(defaultProfile.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>日本</span>
                  </div>
                </div>

                {/* ソーシャルリンク */}
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://github.com/furukawa1020" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                    <ExternalLinkIcon className="w-3 h-3" />
                  </a>
                  
                  <a 
                    href="mailto:contact@example.com" 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <MailIcon className="w-4 h-4" />
                    <span>メール</span>
                  </a>
                  
                  <a 
                    href="https://linkedin.com/in/example" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                    <ExternalLinkIcon className="w-3 h-3" />
                  </a>
                  
                  <a 
                    href="https://twitter.com/example" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200"
                  >
                    <TwitterIcon className="w-4 h-4" />
                    <span>Twitter</span>
                    <ExternalLinkIcon className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 技術スタック */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <CodeIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">技術スタック</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">フロントエンド</h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Three.js'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">バックエンド</h3>
              <div className="flex flex-wrap gap-2">
                {['Go', 'Python', 'Rust', 'Node.js', 'PostgreSQL'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">インフラ・ツール</h3>
              <div className="flex flex-wrap gap-2">
                {['Docker', 'Railway', 'Vercel', 'Git', 'VS Code'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 実績・統計 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-gray-600">公開プロジェクト</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">42</div>
            <div className="text-gray-600">投稿記事</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1337</div>
            <div className="text-gray-600">総納得数</div>
          </div>
        </div>

        {/* 最近の活動 */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">最近の活動</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CodeIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">新しい記事を投稿しました</p>
                <p className="text-gray-600 text-sm">「Next.jsとGoを使ったフルスタック開発」</p>
                <p className="text-gray-500 text-xs mt-1">2日前</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <GithubIcon className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">新しいリポジトリを作成しました</p>
                <p className="text-gray-600 text-sm">profil-bio - マルチ言語統合プラットフォーム</p>
                <p className="text-gray-500 text-xs mt-1">5日前</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">プロフィールを更新しました</p>
                <p className="text-gray-600 text-sm">技術スタックと経歴を最新版に更新</p>
                <p className="text-gray-500 text-xs mt-1">1週間前</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
