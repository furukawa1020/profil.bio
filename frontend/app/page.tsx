'use client'

import { useState } from 'react'
import SNSLinks from '@/components/SNSLinks'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* モバイルファーストヘッダー */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">furukawa1020</h1>
              <p className="text-sm text-gray-600">思考と記録の場</p>
            </div>
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* ナビゲーション */}
          <nav className={`mt-4 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="/articles" className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">記事</a>
              <a href="/thoughts" className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">私の考え</a>
              <a href="/feed" className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">フィード</a>
              <a href="/profile" className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">プロフィール</a>
              <a href="/contact" className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">連絡先</a>
            </div>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* 自己紹介セクション */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">自己紹介</h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              こんにちは、furukawa1020です。<br />
              ここは私の考えや記事を共有する個人サイトです。<br />
              技術、日常の気づき、思考の記録を残しています。
            </p>
          </div>
        </section>

        {/* 最新記事セクション */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最新記事</h2>
          <div className="space-y-4">
            <article className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">記事タイトル例</h3>
              <p className="text-sm text-gray-600 mb-3">記事の概要がここに表示されます...</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>2024.01.01</span>
                <a href="/articles/1" className="text-blue-600">続きを読む</a>
              </div>
            </article>
            
            <article className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">もう一つの記事</h3>
              <p className="text-sm text-gray-600 mb-3">こちらも記事の概要です...</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>2024.01.02</span>
                <a href="/articles/2" className="text-blue-600">続きを読む</a>
              </div>
            </article>
          </div>
          
          <div className="mt-4 text-center">
            <a href="/articles" className="text-blue-600 text-sm">すべての記事を見る →</a>
          </div>
        </section>

        {/* 最近の考えセクション */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近の考え</h2>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">今日考えたことをここに短く書きます。思考の断片を記録する場所です。</p>
              <span className="text-xs text-gray-500 mt-2 block">2024.01.03</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">別の日に考えたことです。日々の気づきを積み重ねていきます。</p>
              <span className="text-xs text-gray-500 mt-2 block">2024.01.02</span>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a href="/thoughts" className="text-blue-600 text-sm">すべての考えを見る →</a>
          </div>
        </section>

        {/* SNSリンクセクション */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SNS・連絡先</h2>
          <SNSLinks />
        </section>
      </main>
    </div>
  )
}
