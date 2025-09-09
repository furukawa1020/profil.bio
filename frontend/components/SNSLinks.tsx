'use client'

import Link from 'next/link'
import { useState } from 'react'

// SVGアイコンコンポーネント
const GitHubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const TwitterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
)

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const LinkedInIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const MailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const ExternalLinkIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

interface SNSLinksProps {
  variant?: 'compact' | 'full'
}

export default function SNSLinks({ variant = 'full' }: SNSLinksProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  // 主要SNSリンク（ポートフォリオ用）
  const socialLinks = [
    {
      id: 'github',
      name: 'GitHub',
      url: 'https://github.com/furukawa1020',
      icon: <GitHubIcon />,
      color: 'bg-gray-900 hover:bg-gray-800',
      textColor: 'text-white'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      url: 'https://twitter.com/furukawa1020',
      icon: <TwitterIcon />,
      color: 'bg-black hover:bg-gray-800',
      textColor: 'text-white'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://instagram.com/furukawa1020',
      icon: <InstagramIcon />,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      textColor: 'text-white'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: 'https://facebook.com/furukawa1020',
      icon: <FacebookIcon />,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/furukawa1020',
      icon: <LinkedInIcon />,
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-white'
    }
  ]

  const internalLinks = [
    {
      id: 'articles',
      name: '記事',
      url: '/articles',
      icon: '📚',
      color: 'bg-green-500 hover:bg-green-600',
      description: '技術記事とブログ投稿'
    },
    {
      id: 'thoughts',
      name: '思考',
      url: '/thoughts',
      icon: '💭',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      description: 'アイデアと洞察の記録'
    },
    {
      id: 'feed',
      name: 'フィード',
      url: '/feed',
      icon: '�',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'ソーシャルフィード'
    },
    {
      id: 'profile',
      name: 'プロフィール',
      url: '/profile',
      icon: '�',
      color: 'bg-purple-500 hover:bg-purple-600',
      description: '詳細プロフィール'
    }
  ]

  // コンパクト版（トップページ用）
  if (variant === 'compact') {
    return (
      <div className="flex flex-col space-y-4">
        {/* 主要SNSリンク */}
        <div className="flex justify-center space-x-4">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center justify-center w-12 h-12 rounded-full
                ${link.color} ${link.textColor}
                transform transition-all duration-200 hover:scale-110
                shadow-lg hover:shadow-xl
              `}
              title={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* サイト内リンク */}
        <div className="grid grid-cols-2 gap-2">
          {internalLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className={`
                flex items-center justify-center space-x-2 p-3 rounded-lg
                ${link.color} text-white text-sm font-medium
                transition-all duration-200 hover:scale-105
              `}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* お問い合わせボタン */}
        <Link
          href="/contact"
          className="flex items-center justify-center space-x-2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
        >
          <MailIcon className="w-5 h-5" />
          <span>お問い合わせ</span>
        </Link>
      </div>
    )
  }

  // フル版（詳細ページ用）
  return (
    <div className="space-y-6">
      {/* 主要SNSリンク（目立つ位置に） */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Connect with me</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                group flex flex-col items-center justify-center p-4 rounded-xl
                ${link.color} ${link.textColor}
                transform transition-all duration-200 hover:scale-105
                shadow-lg hover:shadow-xl
              `}
              onMouseEnter={() => setHoveredLink(link.id)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <div className="mb-2 group-hover:scale-110 transition-transform duration-200">
                {link.icon}
              </div>
              <span className="text-xs font-medium text-center">{link.name}</span>
              {hoveredLink === link.id && (
                <ExternalLinkIcon className="w-3 h-3 mt-1 opacity-75" />
              )}
            </a>
          ))}
        </div>
      </div>

      {/* サイト内ページ */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">サイト内ページ</h3>
        <div className="grid grid-cols-2 gap-3">
          {internalLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className="group"
              onMouseEnter={() => setHoveredLink(link.id)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <div className={`
                flex items-center space-x-3 p-3 rounded-lg border border-gray-200 
                hover:border-gray-300 transition-all duration-200 bg-white
                ${hoveredLink === link.id ? 'shadow-md transform scale-105' : 'hover:shadow-sm'}
              `}>
                <div className={`
                  w-10 h-10 rounded-lg ${link.color} flex items-center justify-center
                  text-white text-lg group-hover:scale-110 transition-transform duration-200
                `}>
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{link.name}</div>
                  <div className="text-xs text-gray-500 truncate">{link.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* お問い合わせボタン */}
      <div className="pt-4 border-t border-gray-200">
        <Link
          href="/contact"
          className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <MailIcon className="w-5 h-5" />
          <span>お問い合わせ</span>
        </Link>
      </div>
    </div>
  )
}
