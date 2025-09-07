'use client'

import { useState, useEffect } from 'react'

interface ConvictionMeterProps {
  conviction: number
  onChange: (value: number) => void
}

export default function ConvictionMeter({ conviction, onChange }: ConvictionMeterProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [conviction])

  const getLevel = () => {
    if (conviction <= 20) return "探索者"
    if (conviction <= 40) return "学習者"  
    if (conviction <= 60) return "思考者"
    if (conviction <= 80) return "哲学者"
    return "賢者"
  }

  const getEmoji = () => {
    if (conviction <= 20) return "🧭"
    if (conviction <= 40) return "📚"
    if (conviction <= 60) return "💭"
    if (conviction <= 80) return "🧠"
    return "✨"
  }

  const getDescription = () => {
    if (conviction <= 20) return "未知の世界を歩み始める"
    if (conviction <= 40) return "知識を積み重ねている"
    if (conviction <= 60) return "深く考察を重ねている"
    if (conviction <= 80) return "真理に近づいている"
    return "究極の洞察を得た"
  }

  const getGradientClass = () => {
    if (conviction <= 20) return "from-gray-500 to-blue-500"
    if (conviction <= 40) return "from-blue-500 to-green-500"
    if (conviction <= 60) return "from-green-500 to-yellow-500"
    if (conviction <= 80) return "from-yellow-500 to-orange-500"
    return "from-orange-500 to-red-500"
  }

  const getGlowColor = () => {
    if (conviction <= 20) return "#3B82F6"
    if (conviction <= 40) return "#10B981"
    if (conviction <= 60) return "#F59E0B"
    if (conviction <= 80) return "#F97316"
    return "#EF4444"
  }

  const getBgGlow = () => {
    if (conviction > 80) return "shadow-red-500/50"
    if (conviction > 60) return "shadow-orange-500/50"
    if (conviction > 40) return "shadow-yellow-500/50"
    if (conviction > 20) return "shadow-green-500/50"
    return "shadow-blue-500/50"
  }

  return (
    <div className="relative">
      <h3 className="text-xl font-bold text-white mb-6 text-center">
        <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          ⚡ 確信度メーター
        </span>
      </h3>
      
      {/* メインスライダーエリア */}
      <div className="mb-6">
        <div className="relative group">
          {/* 背景トラック */}
          <div className="w-full h-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-full shadow-inner border border-gray-700">
            {/* 進行バー */}
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${getGradientClass()} relative overflow-hidden ${isAnimating ? 'animate-pulse' : ''}`}
              style={{ 
                width: `${conviction}%`,
                boxShadow: `0 0 30px ${getGlowColor()}60, 0 0 60px ${getGlowColor()}30, inset 0 1px 0 rgba(255,255,255,0.3)`
              }}
            >
              {/* 進行バー内のフロー効果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
          
          {/* 隠されたスライダー */}
          <input
            type="range"
            min="0"
            max="100"
            value={conviction}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute top-0 w-full h-4 opacity-0 cursor-pointer z-10"
          />
          
          {/* カスタムハンドル */}
          <div 
            className={`absolute top-1/2 w-7 h-7 bg-white rounded-full shadow-xl border-3 border-gray-200 transform -translate-y-1/2 transition-all duration-300 hover:scale-125 cursor-pointer z-20 ${getBgGlow()}`}
            style={{ 
              left: `calc(${conviction}% - 14px)`,
              boxShadow: `0 0 20px ${getGlowColor()}80, 0 6px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
            }}
          >
            <div className={`w-full h-full rounded-full bg-gradient-to-r ${getGradientClass()} opacity-90 flex items-center justify-center text-white text-xs font-bold`}>
              {getEmoji()}
            </div>
          </div>
        </div>
        
        {/* 数値とラベル */}
        <div className="flex justify-between text-xs text-gray-400 mt-3 px-2">
          <span className="flex flex-col items-center">
            <span>🌫️</span>
            <span>迷い</span>
          </span>
          <span className="text-white font-bold text-lg bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
            {conviction}%
          </span>
          <span className="flex flex-col items-center">
            <span>🌟</span>
            <span>確信</span>
          </span>
        </div>
      </div>

      {/* レベル表示カード */}
      <div className={`bg-gradient-to-br from-black/40 to-black/20 rounded-xl p-5 backdrop-blur-sm border border-white/10 shadow-2xl ${getBgGlow()}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-300 font-medium">現在のレベル</span>
          <span className="text-3xl animate-bounce" style={{ animationDuration: '2s' }}>
            {getEmoji()}
          </span>
        </div>
        
        <div className={`text-2xl font-bold bg-gradient-to-r ${getGradientClass()} bg-clip-text text-transparent mb-2`}>
          {getLevel()}
        </div>
        
        <div className="text-sm text-gray-400 italic mb-4">
          {getDescription()}
        </div>

        {/* ステータスバー */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>思考の深度</span>
            <span>{Math.floor(conviction / 10)}/10</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${getGradientClass()} transition-all duration-500`}
              style={{ width: `${conviction}%` }}
            />
          </div>
        </div>
      </div>

      {/* 宇宙への影響インジケーター */}
      <div className="mt-5 text-center">
        <div className="text-xs text-gray-400 mb-2 font-medium">🌌 宇宙への影響度</div>
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const isActive = i < Math.floor(conviction / 20)
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-r ${getGradientClass()} animate-pulse shadow-lg` 
                    : 'bg-gray-600 opacity-30'
                }`}
                style={{ 
                  boxShadow: isActive 
                    ? `0 0 12px ${getGlowColor()}80` 
                    : 'none',
                  animationDelay: `${i * 100}ms`
                }}
              />
            )
          })}
        </div>
        
        {conviction >= 80 && (
          <div className="mt-3 text-xs text-yellow-400 font-bold animate-pulse">
            ✨ 宇宙が共鳴しています ✨
          </div>
        )}
      </div>

      {/* 高レベル時のオーラ効果 */}
      {conviction > 70 && (
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${getGlowColor()}40 0%, transparent 70%)`,
            filter: 'blur(10px)'
          }}
        />
      )}
    </div>
  )
}
