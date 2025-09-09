'use client'

import { useState, useEffect } from 'react'

interface CreativityMeterProps {
  creativity: number
  onChange: (value: number) => void
}

export default function CreativityMeter({ creativity, onChange }: CreativityMeterProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [creativity])

  const getLevel = () => {
    if (creativity <= 20) return "初心者"
    if (creativity <= 40) return "学習者"  
    if (creativity <= 60) return "開発者"
    if (creativity <= 80) return "クリエイター"
    return "イノベーター"
  }

  const getEmoji = () => {
    if (creativity <= 20) return "🌱"
    if (creativity <= 40) return "📚"
    if (creativity <= 60) return "💻"
    if (creativity <= 80) return "🎨"
    return "🚀"
  }

  const getColor = () => {
    if (creativity <= 20) return "from-gray-400 to-gray-600"
    if (creativity <= 40) return "from-blue-400 to-blue-600"
    if (creativity <= 60) return "from-green-400 to-green-600"
    if (creativity <= 80) return "from-purple-400 to-purple-600"
    return "from-yellow-400 to-yellow-600"
  }

  const getGlow = () => {
    if (creativity <= 20) return "shadow-gray-500/20"
    if (creativity <= 40) return "shadow-blue-500/30"
    if (creativity <= 60) return "shadow-green-500/30"
    if (creativity <= 80) return "shadow-purple-500/30"
    return "shadow-yellow-500/40"
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          {getEmoji()} クリエイティビティ
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{creativity}%</div>
          <div className="text-sm text-gray-300">{getLevel()}</div>
        </div>
      </div>

      {/* メインメーター */}
      <div className="relative mb-6">
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-500 ease-out ${
              isAnimating ? `shadow-lg ${getGlow()}` : ''
            }`}
            style={{ width: `${creativity}%` }}
          />
        </div>
        
        {/* パーセンテージ表示 */}
        <div 
          className="absolute top-0 h-4 flex items-center text-xs font-bold text-white"
          style={{ left: `${Math.max(creativity - 10, 0)}%` }}
        >
          {creativity > 10 && `${creativity}%`}
        </div>
      </div>

      {/* スライダー */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={creativity}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, 
              rgb(156, 163, 175) 0%, 
              rgb(59, 130, 246) 25%, 
              rgb(34, 197, 94) 50%, 
              rgb(147, 51, 234) 75%, 
              rgb(251, 191, 36) 100%)`
          }}
        />
        <div 
          className={`absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-200 ${
            isAnimating ? 'scale-110' : ''
          }`}
          style={{ left: `calc(${creativity}% - 12px)` }}
        />
      </div>

      {/* レベル説明 */}
      <div className="mt-4 grid grid-cols-5 gap-1 text-xs">
        <div className={`text-center p-1 rounded ${creativity <= 20 ? 'bg-gray-600 text-white' : 'text-gray-400'}`}>
          🌱 初心者
        </div>
        <div className={`text-center p-1 rounded ${creativity > 20 && creativity <= 40 ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
          📚 学習者
        </div>
        <div className={`text-center p-1 rounded ${creativity > 40 && creativity <= 60 ? 'bg-green-600 text-white' : 'text-gray-400'}`}>
          💻 開発者
        </div>
        <div className={`text-center p-1 rounded ${creativity > 60 && creativity <= 80 ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>
          🎨 クリエイター
        </div>
        <div className={`text-center p-1 rounded ${creativity > 80 ? 'bg-yellow-600 text-white' : 'text-gray-400'}`}>
          🚀 イノベーター
        </div>
      </div>

      {/* インタラクティブなヒント */}
      <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
        <div className="text-sm text-gray-300">
          💡 <strong>ヒント:</strong> スライダーを動かして、あなたの創造性レベルを設定してください！
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}
