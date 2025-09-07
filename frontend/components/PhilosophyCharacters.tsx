'use client'

import { useState, useEffect } from 'react'

interface PhilosophyCharactersProps {
  conviction: number
}

interface Character {
  id: string
  name: string
  emoji: string
  personality: string
  language: string
  baseComment: string
  reactions: {
    [key: number]: string
  }
  color: string
  bgGradient: string
}

export default function PhilosophyCharacters({ conviction }: PhilosophyCharactersProps) {
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const characters: Character[] = [
    {
      id: 'snowman',
      name: '雪だるまチャン',
      emoji: '⛄',
      personality: '楽天的な励まし役',
      language: 'Go',
      baseComment: '一緒に頑張ろうね〜♪',
      reactions: {
        0: 'まずは一歩ずつだよ〜！',
        20: 'いい調子だね！',
        40: 'どんどん成長してる〜♪',
        60: '素晴らしい思考力だね！',
        80: '哲学の達人になったね〜✨'
      },
      color: 'text-cyan-300',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'frog',
      name: '寂しガエル',
      emoji: '🐸',
      personality: '内省的な思想家',
      language: 'Rust',
      baseComment: '孤独の中にこそ真理がある...',
      reactions: {
        0: '迷いもまた学びの一部なり...',
        20: '少しずつ見えてきたか...',
        40: '思考が深まっているな...',
        60: 'なかなかの洞察力だ...',
        80: '君も賢者の域に達したか...'
      },
      color: 'text-green-300',
      bgGradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'fugu',
      name: 'フグちゃん',
      emoji: '🐡',
      personality: '感情豊かな表現者',
      language: 'JavaScript',
      baseComment: '感情爆発！でも愛があるプク〜',
      reactions: {
        0: 'まだまだプク〜頑張るプク！',
        20: '少し膨らんできたプク♪',
        40: 'いい感じに膨らんでるプク〜！',
        60: '完全体に近づいてるプク！',
        80: '最高に膨らんだプク〜〜〜✨'
      },
      color: 'text-orange-300',
      bgGradient: 'from-orange-500/20 to-red-500/20'
    }
  ]

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [conviction])

  const getCharacterMessage = (character: Character) => {
    if (conviction >= 80) return character.reactions[80]
    if (conviction >= 60) return character.reactions[60]
    if (conviction >= 40) return character.reactions[40]
    if (conviction >= 20) return character.reactions[20]
    return character.reactions[0]
  }

  const getCharacterMood = (character: Character) => {
    if (conviction >= 80) return "ecstatic"
    if (conviction >= 60) return "happy"
    if (conviction >= 40) return "content"
    if (conviction >= 20) return "neutral"
    return "sleepy"
  }

  const getAnimationClass = (character: Character) => {
    const mood = getCharacterMood(character)
    switch (mood) {
      case "ecstatic": return "animate-bounce"
      case "happy": return "animate-pulse"
      case "content": return "hover:scale-105"
      case "neutral": return "hover:scale-102"
      default: return "opacity-70"
    }
  }

  const handleCharacterClick = (characterId: string) => {
    setActiveCharacter(activeCharacter === characterId ? null : characterId)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6 text-center">
        <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
          🤖 AIキャラクターたち
        </span>
      </h3>

      <div className="space-y-4">
        {characters.map((character, index) => (
          <div
            key={character.id}
            className={`relative group cursor-pointer transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
            onClick={() => handleCharacterClick(character.id)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* キャラクターカード */}
            <div className={`bg-gradient-to-br ${character.bgGradient} backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl`}>
              <div className="flex items-center space-x-4">
                {/* キャラクターアバター */}
                <div className={`relative ${getAnimationClass(character)}`}>
                  <div className="text-4xl mb-1 relative">
                    {character.emoji}
                    {conviction >= 60 && (
                      <div className="absolute -top-1 -right-1 text-lg animate-spin">
                        ✨
                      </div>
                    )}
                  </div>
                  
                  {/* 言語バッジ */}
                  <div className="text-xs bg-black/30 px-2 py-1 rounded-full text-center font-mono border border-white/20">
                    {character.language}
                  </div>
                </div>

                {/* キャラクター情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-bold ${character.color} text-lg`}>
                      {character.name}
                    </h4>
                    {conviction >= 80 && (
                      <span className="text-yellow-400 animate-pulse">👑</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mb-2">
                    {character.personality}
                  </p>
                  
                  {/* ムードインジケーター */}
                  <div className="flex items-center space-x-1 mb-2">
                    <span className="text-xs text-gray-500">ムード:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i < Math.floor(conviction / 20) 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 展開アイコン */}
                <div className={`transition-transform duration-300 ${activeCharacter === character.id ? 'rotate-180' : ''}`}>
                  <span className="text-gray-400">▼</span>
                </div>
              </div>

              {/* 展開エリア */}
              {activeCharacter === character.id && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
                  <div className="bg-black/20 rounded-lg p-4 mb-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{character.emoji}</span>
                      <div className="flex-1">
                        <div className="speech-bubble bg-white/10 rounded-lg p-3 relative">
                          <p className="text-white text-sm leading-relaxed">
                            "{getCharacterMessage(character)}"
                          </p>
                          <div className="absolute -left-2 top-4 w-0 h-0 border-r-8 border-r-white/10 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 統計情報 */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/20 rounded p-2 text-center">
                      <div className="text-gray-400">対話回数</div>
                      <div className="text-white font-bold">{Math.floor(conviction / 10) + 1}</div>
                    </div>
                    <div className="bg-black/20 rounded p-2 text-center">
                      <div className="text-gray-400">感情レベル</div>
                      <div className={`font-bold ${character.color}`}>
                        {getCharacterMood(character)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ホバー時のオーラ効果 */}
            {conviction > 50 && (
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none bg-gradient-to-r ${character.bgGradient} blur-xl`} />
            )}
          </div>
        ))}
      </div>

      {/* 全体統計 */}
      <div className="mt-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
        <h4 className="text-white font-bold mb-3 text-center">
          🌟 チーム哲学レベル
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <div className="text-gray-400">総合力</div>
            <div className="text-2xl font-bold text-white">{conviction}</div>
          </div>
          <div>
            <div className="text-gray-400">調和度</div>
            <div className="text-2xl font-bold text-green-400">
              {Math.floor((conviction + 30) / 10)}
            </div>
          </div>
          <div>
            <div className="text-gray-400">成長性</div>
            <div className="text-2xl font-bold text-blue-400">
              {Math.min(100, conviction + 20)}%
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
