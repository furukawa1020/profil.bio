'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// カスタムSVGアイコンコンポーネント
const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArticleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ThoughtIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 9H16M8 13H14M6 1H18C19.1046 1 20 1.89543 20 3V17C20 18.1046 19.1046 19 18 19H7L3 23V3C3 1.89543 3.89543 1 5 1H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeedIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 11C4 11 5 10 8 10S12 11 12 11 13 10 16 10 20 11 20 11V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 11V4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ContactIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HomeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = "" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    {
      href: '/',
      label: 'ホーム',
      icon: <HomeIcon className="w-5 h-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    },
    {
      href: '/articles',
      label: '記事',
      icon: <ArticleIcon className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      href: '/thoughts',
      label: '私の考え',
      icon: <ThoughtIcon className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      href: '/feed',
      label: 'フィード',
      icon: <FeedIcon className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      href: '/profile',
      label: 'プロフィール',
      icon: <ProfileIcon className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    },
    {
      href: '/contact',
      label: '連絡先',
      icon: <ContactIcon className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100'
    }
  ];

  const isActivePage = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* トップヘッダー - デスクトップ用 */}
      <header className={`hidden lg:block sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      } ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">furukawa1020</h1>
                </div>
              </Link>
            </div>
            
            <nav className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isActivePage(item.href)
                      ? `${item.bgColor} ${item.color} ring-2 ring-offset-1 ring-current`
                      : `${item.bgColor} ${item.color}`
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* モバイルヘッダー */}
      <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">furukawa1020</h1>
                <p className="text-xs text-gray-600">思考と記録の場</p>
              </div>
            </Link>
            
            <button 
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <CloseIcon className="w-6 h-6 text-gray-700" />
              ) : (
                <MenuIcon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* モバイルスライドメニュー */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isMenuOpen ? 'visible' : 'invisible'
      }`}>
        {/* オーバーレイ */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* サイドメニュー */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">メニュー</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CloseIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] transform ${
                    isActivePage(item.href)
                      ? `${item.bgColor} ${item.color} ring-2 ring-offset-1 ring-current`
                      : `${item.bgColor} ${item.color}`
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">furukawa1020</h3>
                <p className="text-sm text-gray-600 mb-4">フルスタックエンジニア</p>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  <ContactIcon className="w-4 h-4" />
                  <span>お問い合わせ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ボトムナビゲーション - モバイル用 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 z-40">
        <nav className="flex items-center justify-around py-2">
          <Link 
            href="/" 
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              isActivePage('/') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <HomeIcon className={`w-5 h-5 ${isActivePage('/') ? 'text-gray-900' : 'text-gray-600'}`} />
            <span className={`text-xs font-medium ${isActivePage('/') ? 'text-gray-900' : 'text-gray-600'}`}>ホーム</span>
          </Link>
          <Link 
            href="/articles" 
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              isActivePage('/articles') ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            <ArticleIcon className={`w-5 h-5 ${isActivePage('/articles') ? 'text-blue-700' : 'text-blue-600'}`} />
            <span className={`text-xs font-medium ${isActivePage('/articles') ? 'text-blue-700' : 'text-blue-600'}`}>記事</span>
          </Link>
          <Link 
            href="/feed" 
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              isActivePage('/feed') ? 'bg-green-100' : 'hover:bg-gray-100'
            }`}
          >
            <FeedIcon className={`w-5 h-5 ${isActivePage('/feed') ? 'text-green-700' : 'text-green-600'}`} />
            <span className={`text-xs font-medium ${isActivePage('/feed') ? 'text-green-700' : 'text-green-600'}`}>フィード</span>
          </Link>
          <Link 
            href="/profile" 
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              isActivePage('/profile') ? 'bg-orange-100' : 'hover:bg-gray-100'
            }`}
          >
            <ProfileIcon className={`w-5 h-5 ${isActivePage('/profile') ? 'text-orange-700' : 'text-orange-600'}`} />
            <span className={`text-xs font-medium ${isActivePage('/profile') ? 'text-orange-700' : 'text-orange-600'}`}>プロフィール</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
