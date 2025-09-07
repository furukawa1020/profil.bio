'use client'

import { useState, useEffect } from 'react'
import ConvictionMeter from '@/components/ConvictionMeter'
import PhilosophyCharacters from '@/components/PhilosophyCharacters'
import SNSLinks from '@/components/SNSLinks'
import UniverseVisualization from '@/components/UniverseVisualization'
import LoadingScreen from '@/components/LoadingScreen'
import AIConversationArticle from '@/components/AIConversationArticle'

export default function Home() {
  const [conviction, setConviction] = useState(75)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'universe' | 'ai-article' | 'philosophy'>('universe')

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const convictionMessages = [
    { min: 0, max: 20, message: "迷いの森をさまよう...", color: "from-gray-600 to-gray-800" },
    { min: 21, max: 40, message: "少しずつ道が見えてきた", color: "from-blue-600 to-blue-800" },
    { min: 41, max: 60, message: "確信が芽生えてきている", color: "from-green-600 to-green-800" },
    { min: 61, max: 80, message: "強い信念を持っている", color: "from-purple-600 to-purple-800" },
    { min: 81, max: 100, message: "絶対的な確信に満ちている", color: "from-gold-600 to-gold-800" }
  ]

  const getCurrentMessage = () => {
    return convictionMessages.find(msg => conviction >= msg.min && conviction <= msg.max)
  }

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} onComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景の宇宙可視化 */}
      {currentView === 'universe' && (
        <div className="absolute inset-0">
          <UniverseVisualization />
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="relative z-10 min-h-screen">
        {/* ナビゲーションヘッダー */}
        <header className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="flex justify-between items-center">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
              <h1 className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Polyglot Philosophy
                </span>
                <br />
                <span className="text-lg text-gray-300">Playground</span>
              </h1>
            </div>

            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentView('universe')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'universe' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-black/20 text-white/80 hover:bg-black/30'
                }`}
              >
                🌌 宇宙
              </button>
              <button
                onClick={() => setCurrentView('ai-article')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'ai-article' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-black/20 text-white/80 hover:bg-black/30'
                }`}
              >
                🤖 AI記事
              </button>
              <button
                onClick={() => setCurrentView('philosophy')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'philosophy' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-black/20 text-white/80 hover:bg-black/30'
                }`}
              >
                📚 哲学
              </button>
            </nav>
          </div>
        </header>

        {/* メインコンテンツエリア */}
        <main className="pt-24">
          {currentView === 'universe' && (
            <div className="flex flex-col lg:flex-row min-h-screen">
              {/* 左サイドバー - 確信度とキャラクター */}
              <div className="lg:w-80 p-6 space-y-6">
                {/* 確信度メーター */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <ConvictionMeter 
                    conviction={conviction} 
                    onChange={setConviction} 
                  />
                  <div className="mt-4 text-center">
                    <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getCurrentMessage()?.color} text-white text-sm font-medium`}>
                      {getCurrentMessage()?.message}
                    </div>
                  </div>
                </div>

                {/* AIキャラクター */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <PhilosophyCharacters conviction={conviction} />
                </div>
              </div>

              {/* 中央エリア - ウェルカムメッセージ */}
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-2xl">
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <h2 className="text-4xl font-bold text-white mb-6">
                      ようこそ、哲学の宇宙へ
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                      技術と哲学が融合した多言語プラットフォームで、
                      新しい思考の旅を始めましょう。
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl mb-2">🚀</div>
                        <h3 className="font-bold text-white mb-2">多言語統合</h3>
                        <p className="text-gray-300 text-sm">
                          Go、Rust、Python、JavaScriptなど複数の言語で構築された統合プラットフォーム
                        </p>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl mb-2">🤖</div>
                        <h3 className="font-bold text-white mb-2">内部AI</h3>
                        <p className="text-gray-300 text-sm">
                          独自開発のAIキャラクターたちが楽しく技術を解説
                        </p>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl mb-2">🌐</div>
                        <h3 className="font-bold text-white mb-2">内部SNS</h3>
                        <p className="text-gray-300 text-sm">
                          独自のソーシャル機能で思考を共有し議論を深める
                        </p>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl mb-2">🎮</div>
                        <h3 className="font-bold text-white mb-2">IoT連携</h3>
                        <p className="text-gray-300 text-sm">
                          物理デバイスと連動したインタラクティブな体験
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      惑星をクリックして探索を始めてください
                    </div>
                  </div>
                </div>
              </div>

              {/* 右サイドバー - SNSリンク */}
              <div className="lg:w-80 p-6">
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <SNSLinks />
                </div>
              </div>
            </div>
          )}

          {currentView === 'ai-article' && (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
              <AIConversationArticle />
            </div>
          )}

          {currentView === 'philosophy' && (
            <div className="min-h-screen flex items-center justify-center p-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 max-w-4xl border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  🧠 哲学セクション
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-3">💭 存在論</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      存在するとは何か？この根源的な問いをプログラミングの視点から探求します。
                    </p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
                      探求する
                    </button>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-3">🤖 AI倫理</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      人工知能の発展と共に考えるべき倫理的課題について議論します。
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                      議論する
                    </button>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-3">🌌 技術哲学</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      技術が人間社会に与える影響を哲学的に考察します。
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                      考察する
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-400 italic">
                    "The unexamined life is not worth living" - Socrates
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* フローティングアクションボタン */}
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setConviction(Math.floor(Math.random() * 100))}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-lg transform transition-all duration-200 hover:scale-110"
            title="ランダム確信度"
          >
            🎲
          </button>
        </div>
      </div>
    </div>
  )
}
