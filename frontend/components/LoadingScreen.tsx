'use client'

import { useState, useEffect } from 'react'

interface LoadingScreenProps {
  isLoading: boolean
  onComplete?: () => void
}

export default function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('哲学的思考を初期化中...')
  const [snowmanPosition, setSnowmanPosition] = useState(0)

  const loadingMessages = [
    '哲学的思考を初期化中...',
    'AIキャラクターを目覚めさせています...',
    '宇宙の謎を解読中...',
    '多言語エンジンを起動中...',
    'SNS機能を統合中...',
    '確信度メーターを調整中...',
    '雪だるまチャンが準備しています...',
    '寂しガエルが瞑想中...',
    'フグちゃんが膨らんでいます...',
    '哲学の世界へようこそ！'
  ]

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1
        
        // メッセージ更新
        const messageIndex = Math.floor((newProgress / 100) * loadingMessages.length)
        if (messageIndex < loadingMessages.length) {
          setMessage(loadingMessages[messageIndex])
        }

        // 雪だるまの位置更新（波状の動き）
        setSnowmanPosition(newProgress * 3 + Math.sin(newProgress * 0.1) * 20)

        // 完了時のコールバック
        if (newProgress >= 100) {
          setTimeout(() => {
            onComplete?.()
          }, 1000)
          return 100
        }

        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isLoading, onComplete])

  if (!isLoading && progress >= 100) return null

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      {/* 背景の雪の効果 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center text-white max-w-md mx-auto px-4">
        {/* ロゴエリア */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Polyglot Philosophy
          </h1>
          <p className="text-lg text-gray-300">Playground</p>
        </div>

        {/* 雪だるまローディングアニメーション */}
        <div className="relative mb-8 h-24">
          <div className="absolute inset-0 flex items-center">
            {/* 雪だるまの軌跡 */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
          </div>
          
          {/* 転がる雪だるま */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-75 ease-linear"
            style={{ 
              left: `${Math.min(snowmanPosition, 100)}%`,
              transform: `translateX(-50%) translateY(-50%) rotate(${snowmanPosition * 3.6}deg)`
            }}
          >
            <div className="relative">
              {/* 雪だるまの体 */}
              <div className="flex flex-col items-center">
                {/* 頭 */}
                <div className="w-8 h-8 bg-white rounded-full mb-1 flex items-center justify-center text-xs border-2 border-gray-200">
                  ⛄
                </div>
                {/* 体 */}
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                  <div className="w-1 h-1 bg-black rounded-full mx-1"></div>
                  <div className="w-1 h-1 bg-black rounded-full mx-1"></div>
                  <div className="w-1 h-1 bg-black rounded-full mx-1"></div>
                </div>
              </div>
              
              {/* 雪だるまの影 */}
              <div 
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-black/20 rounded-full blur-sm"
                style={{ opacity: 0.3 }}
              ></div>
            </div>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="mb-6">
          <div className="w-full bg-gray-700/50 rounded-full h-3 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* プログレスバーの光る効果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-300">
            {progress}%
          </div>
        </div>

        {/* ローディングメッセージ */}
        <div className="mb-6">
          <p className="text-lg text-white/90 animate-pulse">{message}</p>
        </div>

        {/* 哲学的な引用 */}
        <div className="text-sm text-gray-400 italic">
          {progress < 30 && '"思考することは存在することである" - デカルト'}
          {progress >= 30 && progress < 60 && '"無知の知" - ソクラテス'}
          {progress >= 60 && progress < 90 && '"猫も杓子もプログラミング" - 現代の格言'}
          {progress >= 90 && '"コードは詩であり、バグは哲学である" - 匿名の開発者'}
        </div>

        {/* キャラクター予告 */}
        {progress > 70 && (
          <div className="mt-6 animate-fade-in">
            <div className="flex justify-center space-x-6 text-2xl">
              <div className="animate-bounce" style={{ animationDelay: '0s' }}>⛄</div>
              <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐸</div>
              <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>🐡</div>
            </div>
            <p className="text-xs text-gray-400 mt-2">AIキャラクターたちがあなたを待っています</p>
          </div>
        )}
      </div>

      {/* CSS アニメーション */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
