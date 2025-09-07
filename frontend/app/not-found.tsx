'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  const [explosionPhase, setExplosionPhase] = useState(0)
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    emoji: string
  }>>([])

  const fugu_messages = [
    "あっ！ページが見つからないプク〜！",
    "フグちゃんが怒って爆発しちゃったプク！",
    "404エラーで大爆発プク〜〜〜！",
    "ページが海の彼方に消えたプク...",
    "もう一度探してみるプク？"
  ]

  const generateParticles = () => {
    const newParticles = []
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 400
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 300

    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50
      const velocity = 2 + Math.random() * 4
      
      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: 10 + Math.random() * 20,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)],
        emoji: ['💥', '🌟', '✨', '💫', '🌈', '🎆'][Math.floor(Math.random() * 6)]
      })
    }
    
    setParticles(newParticles)
  }

  useEffect(() => {
    // 爆発アニメーションの開始
    const explosionTimer = setTimeout(() => {
      setExplosionPhase(1)
      generateParticles()
    }, 1000)

    return () => clearTimeout(explosionTimer)
  }, [])

  useEffect(() => {
    if (explosionPhase === 1) {
      // パーティクルアニメーション
      const animationInterval = setInterval(() => {
        setParticles(prev => 
          prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // 重力効果
            size: Math.max(particle.size - 0.3, 0) // 徐々に小さくなる
          })).filter(particle => particle.size > 0)
        )
      }, 16)

      // 爆発フェーズ2への移行
      const phaseTimer = setTimeout(() => {
        setExplosionPhase(2)
      }, 3000)

      return () => {
        clearInterval(animationInterval)
        clearTimeout(phaseTimer)
      }
    }
  }, [explosionPhase])

  const handleGoHome = () => {
    router.push('/')
  }

  const handleRandomPage = () => {
    const randomPages = ['/about', '/contact', '/blog', '/projects']
    const randomPage = randomPages[Math.floor(Math.random() * randomPages.length)]
    router.push(randomPage)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* 背景の波 */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-blue-600/30 to-transparent">
          <div className="absolute bottom-0 w-full h-16 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-blue-500/20 animate-pulse"></div>
        </div>
      </div>

      {/* パーティクルシステム */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none z-20"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: particle.size / 30,
            transform: `scale(${particle.size / 20})`
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-lg">
            {particle.emoji}
          </div>
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* メインフグキャラクター */}
        <div className="mb-8">
          {explosionPhase === 0 && (
            <div className="animate-bounce">
              <div className="text-8xl mb-4 animate-pulse">🐡</div>
              <div className="text-lg text-white/80">プク...プク...</div>
            </div>
          )}
          
          {explosionPhase === 1 && (
            <div className="relative">
              <div 
                className="text-8xl transform transition-all duration-300"
                style={{
                  transform: 'scale(2) rotate(360deg)',
                  filter: 'brightness(2) hue-rotate(90deg)'
                }}
              >
                🐡
              </div>
              <div className="absolute inset-0 animate-ping">
                <div className="w-32 h-32 bg-red-500/50 rounded-full"></div>
              </div>
            </div>
          )}
          
          {explosionPhase === 2 && (
            <div className="animate-fade-in">
              <div className="text-6xl mb-4">😵‍💫</div>
              <div className="text-lg text-white/80">爆発しちゃったプク...</div>
            </div>
          )}
        </div>

        {/* 404メッセージ */}
        <div className="mb-8 text-center">
          <h1 className="text-9xl font-bold text-white mb-4 animate-pulse">
            4<span className="text-red-400">💥</span>4
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">
            Page Not Found!
          </h2>
          
          {/* フグのセリフ */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto mb-6 border border-white/20">
            <div className="relative">
              <div className="absolute -top-3 -left-3 text-2xl">🐡</div>
              <div className="text-white text-lg font-medium pl-6">
                {explosionPhase === 0 && fugu_messages[0]}
                {explosionPhase === 1 && fugu_messages[2]}
                {explosionPhase === 2 && fugu_messages[4]}
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handleGoHome}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            🏠 ホームに戻る
          </button>
          
          <button
            onClick={handleRandomPage}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            🎲 ランダム探索
          </button>
        </div>

        {/* フグの豆知識 */}
        <div className="max-w-lg mx-auto">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 text-white/80 text-sm border border-white/10">
            <h3 className="font-bold mb-2">🐡 フグちゃんの豆知識</h3>
            <p>
              フグは危険を感じると体を膨らませる防御機能を持っています。
              でも404エラーには対応できないので爆発しちゃいました...プク
            </p>
          </div>
        </div>

        {/* 海中背景効果 */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                fontSize: `${12 + Math.random() * 8}px`,
                opacity: 0.3
              }}
            >
              {['🫧', '🐠', '🌊', '🪸', '🦑'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      </div>

      {/* CSS アニメーション */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
