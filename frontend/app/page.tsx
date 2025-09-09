'use client';

import { useState } from 'react';
import Link from 'next/link';
import SNSLinks from '@/components/SNSLinks';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* モバイルファーストヘッダー */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* プロフィール画像プレースホルダー */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">furukawa1020</h1>
                <p className="text-xs text-gray-600">Developer & Creator</p>
              </div>
            </div>
            
            {/* デスクトップナビゲーション */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/articles" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                記事
              </Link>
              <Link href="/thoughts" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                思考
              </Link>
              <Link href="/feed" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                フィード
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                AIチャット
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                プロフィール
              </Link>
              <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                お問い合わせ
              </Link>
            </nav>

            {/* モバイルメニューボタン */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* モバイルナビゲーション */}
          {isMenuOpen && (
            <nav className="mt-4 pb-4 md:hidden border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <Link 
                  href="/articles" 
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📚 記事
                </Link>
                <Link 
                  href="/thoughts" 
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💭 思考
                </Link>
                <Link 
                  href="/feed" 
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📱 フィード
                </Link>
                <Link 
                  href="/chat" 
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🤖 AIチャット
                </Link>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  👤 プロフィール
                </Link>
                <Link 
                  href="/contact" 
                  className="block px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-center font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📧 お問い合わせ
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="px-4 py-6 max-w-4xl mx-auto">
        {/* ヒーローセクション */}
        <section className="text-center mb-8">
          <div className="mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-white font-bold text-3xl md:text-4xl">F</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome to my Portfolio
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              フルスタックエンジニアとして、技術とデザインを融合した
              <br className="hidden md:block" />
              創造的なソリューションを提供します
            </p>
          </div>

          {/* SNSリンク（コンパクト版） */}
          <div className="mb-8">
            <SNSLinks variant="compact" />
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 最新記事セクション */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">最新記事</h2>
              <Link href="/articles" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
                すべて見る →
              </Link>
            </div>
            <div className="space-y-4">
              <article className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">Next.jsとGoを使ったフルスタック開発</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">モダンなWebアプリケーション開発において、Next.jsをフロントエンド、Goをバックエンドに使用することで効率的な開発が可能になります...</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>2024.01.15</span>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">技術</span>
                    <Link href="/articles" className="text-blue-600 hover:text-blue-800 transition-colors">続きを読む</Link>
                  </div>
                </div>
              </article>
              
              <article className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">Rustで学ぶシステムプログラミング</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Rustは安全性とパフォーマンスを両立できる現代的なシステムプログラミング言語です。メモリ安全性とゼロコスト抽象化により...</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>2024.01.10</span>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Rust</span>
                    <Link href="/articles" className="text-blue-600 hover:text-blue-800 transition-colors">続きを読む</Link>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* AIチャット案内セクション */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">AI哲学者と対話</h2>
              <Link href="/chat" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
                チャットを始める →
              </Link>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🧙‍♂️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">ソクラテス</h3>
                    <p className="text-sm text-gray-600">質問による探求で思考を深める</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">「無知の知」で有名な古代ギリシャの哲学者と対話してみませんか？</p>
                <Link href="/chat" className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors text-sm font-medium">
                  対話を始める
                </Link>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🧘‍♂️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">ブッダ</h3>
                    <p className="text-sm text-gray-600">悟りの視点で人生を導く</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">仏教の開祖から、苦悩の解決と心の平安について学びましょう。</p>
                <Link href="/chat" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
                  対話を始める
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* 最近の思考セクション（下に移動） */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">最近の思考</h2>
            <Link href="/thoughts" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
              すべて見る →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-700 mb-2">AI技術の進歩により、エンジニアの役割も変わってきています。単にコードを書くだけでなく、AIとの協働や新しい価値創造が重要になってきました。</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>2024.01.14</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">AI</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-xl p-4 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-700 mb-2">技術と社会の再設計を通じて、より良い未来を創造していきたいと考えています。一人ひとりが「生きててよかった」と思える世界を目指して。</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>2024.01.12</span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">思考</span>
              </div>
            </div>
          </div>
        </section>

        {/* 追加セクション */}
        <section className="mt-12 text-center">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">一緒に何かを作りませんか？</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              新しいプロジェクトのアイデアがある方、技術的な相談をしたい方、
              <br className="hidden md:block" />
              または単純に技術について話したい方、お気軽にご連絡ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>📧</span>
                <span>お問い合わせ</span>
              </Link>
              <Link 
                href="/chat" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>🤖</span>
                <span>AI哲学者と対話</span>
              </Link>
              <Link 
                href="/profile" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>👤</span>
                <span>詳細プロフィール</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
