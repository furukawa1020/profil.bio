'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  character: 'snowman' | 'frog' | 'fugu'
  content: string
  timestamp: Date
  emotion: string
  isTyping?: boolean
}

interface Article {
  id: string
  title: string
  topic: string
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  conversation: Message[]
}

const characters = {
  snowman: {
    name: '雪だるまチャン',
    emoji: '⛄',
    personality: '楽天的で好奇心旺盛',
    color: 'from-blue-400 to-cyan-300',
    textColor: 'text-blue-600'
  },
  frog: {
    name: '寂しガエル',
    emoji: '🐸',
    personality: '哲学的で内省的',
    color: 'from-green-400 to-emerald-300',
    textColor: 'text-green-600'
  },
  fugu: {
    name: 'フグちゃん',
    emoji: '🐡',
    personality: '感情的で表現豊か',
    color: 'from-orange-400 to-red-300',
    textColor: 'text-orange-600'
  }
}

export default function AIConversationArticle() {
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [isConversationActive, setIsConversationActive] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const topics = [
    { id: 'async', name: '非同期プログラミング', difficulty: 'intermediate' },
    { id: 'functional', name: '関数型プログラミング', difficulty: 'advanced' },
    { id: 'variables', name: '変数とデータ型', difficulty: 'beginner' },
    { id: 'oop', name: 'オブジェクト指向', difficulty: 'intermediate' },
    { id: 'ai-ethics', name: 'AI倫理', difficulty: 'advanced' },
    { id: 'debugging', name: 'デバッグ技法', difficulty: 'intermediate' }
  ]

  const languages = [
    { id: 'go', name: 'Go', icon: '🔵' },
    { id: 'rust', name: 'Rust', icon: '🦀' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', icon: '💛' },
    { id: 'haskell', name: 'Haskell', icon: '🟣' }
  ]

  // 記事コンテンツのサンプルデータ
  const generateConversation = (topic: string, language: string): Message[] => {
    const conversations: Record<string, Record<string, Message[]>> = {
      async: {
        go: [
          {
            id: '1',
            character: 'snowman',
            content: 'ねえねえ、Goの非同期処理って面白いよね！goroutineっていう仕組みがあるんだって✨',
            timestamp: new Date(),
            emotion: 'excited'
          },
          {
            id: '2',
            character: 'frog',
            content: 'そうですね...goroutineは軽量なスレッドのようなもので、数千、数万ものgoroutineを同時に実行できるんです...',
            timestamp: new Date(),
            emotion: 'thoughtful'
          },
          {
            id: '3',
            character: 'fugu',
            content: 'でもプク！channelっていうのがよくわからないプク〜！データのやり取りはどうするプク？',
            timestamp: new Date(),
            emotion: 'confused'
          },
          {
            id: '4',
            character: 'snowman',
            content: 'あ、それいい質問！channelはgoroutine同士が安全にデータをやり取りするための仕組みなんだ♪',
            timestamp: new Date(),
            emotion: 'helpful'
          },
          {
            id: '5',
            character: 'frog',
            content: '例えば、`ch := make(chan int)` でinteger型のchannelを作って、`ch <- 42` で送信、`value := <-ch` で受信します...',
            timestamp: new Date(),
            emotion: 'explaining'
          }
        ]
      },
      functional: {
        haskell: [
          {
            id: '1',
            character: 'frog',
            content: '関数型プログラミングの美しさについて語らせてください...Haskellでは全てが関数なんです...',
            timestamp: new Date(),
            emotion: 'passionate'
          },
          {
            id: '2',
            character: 'snowman',
            content: 'わあ！それって数学みたいでかっこいい！でも難しそう...😅',
            timestamp: new Date(),
            emotion: 'worried'
          },
          {
            id: '3',
            character: 'fugu',
            content: '純粋関数って何プク？副作用がないって聞いたことあるプク〜',
            timestamp: new Date(),
            emotion: 'curious'
          },
          {
            id: '4',
            character: 'frog',
            content: 'いい質問ですね...純粋関数は同じ入力に対して必ず同じ出力を返し、外部の状態を変更しない関数です...',
            timestamp: new Date(),
            emotion: 'teaching'
          }
        ]
      }
    }

    return conversations[topic]?.[language] || [
      {
        id: '1',
        character: 'snowman',
        content: `${language}の${topic}について話そう！`,
        timestamp: new Date(),
        emotion: 'excited'
      }
    ]
  }

  const startConversation = () => {
    if (!selectedTopic || !selectedLanguage) return

    setIsLoading(true)
    
    // 記事を生成
    const topic = topics.find(t => t.id === selectedTopic)
    const language = languages.find(l => l.id === selectedLanguage)
    
    const article: Article = {
      id: `${selectedTopic}-${selectedLanguage}-${Date.now()}`,
      title: `${language?.name}で学ぶ${topic?.name}`,
      topic: topic?.name || '',
      language: language?.name || '',
      difficulty: (topic?.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
      estimatedTime: '10-15分',
      conversation: []
    }

    setTimeout(() => {
      article.conversation = generateConversation(selectedTopic, selectedLanguage)
      setCurrentArticle(article)
      setIsLoading(false)
      setIsConversationActive(true)
      
      // メッセージを順次表示
      playConversation(article.conversation)
    }, 1500)
  }

  const playConversation = (messages: Message[]) => {
    setCurrentArticle(prev => 
      prev ? { ...prev, conversation: [] } : null
    )

    messages.forEach((message, index) => {
      setTimeout(() => {
        // タイピング効果
        setCurrentArticle(prev => {
          if (!prev) return null
          return {
            ...prev,
            conversation: [
              ...prev.conversation,
              { ...message, isTyping: true }
            ]
          }
        })

        // タイピング完了
        setTimeout(() => {
          setCurrentArticle(prev => {
            if (!prev) return null
            const updatedConversation = [...prev.conversation]
            updatedConversation[updatedConversation.length - 1] = {
              ...message,
              isTyping: false
            }
            return {
              ...prev,
              conversation: updatedConversation
            }
          })
        }, 1000 + message.content.length * 50)

      }, index * 3000)
    })
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentArticle?.conversation])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500'
      case 'intermediate': return 'bg-yellow-500'
      case 'advanced': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🤖 AI掛け合い記事
        </h1>
        <p className="text-gray-600 text-lg">
          AIキャラクターたちが楽しく技術を解説します
        </p>
      </div>

      {!isConversationActive && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-center">記事をカスタマイズ</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* トピック選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学びたいトピック
              </label>
              <div className="space-y-2">
                {topics.map(topic => (
                  <label key={topic.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="topic"
                      value={topic.id}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{topic.name}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 言語選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プログラミング言語
              </label>
              <div className="space-y-2">
                {languages.map(language => (
                  <label key={language.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="language"
                      value={language.id}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="text-purple-600"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{language.icon}</span>
                      <span className="font-medium">{language.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startConversation}
              disabled={!selectedTopic || !selectedLanguage || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-8 rounded-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>記事を生成中...</span>
                </div>
              ) : (
                '🚀 会話を開始する'
              )}
            </button>
          </div>
        </div>
      )}

      {/* キャラクター紹介 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-center">出演キャラクター</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(characters).map(([key, char]) => (
            <div key={key} className="text-center p-4 border rounded-lg">
              <div className="text-4xl mb-2">{char.emoji}</div>
              <div className="font-bold text-lg">{char.name}</div>
              <div className="text-sm text-gray-600">{char.personality}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 記事表示 */}
      {currentArticle && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* 記事ヘッダー */}
          <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold mb-2">{currentArticle.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-white ${getDifficultyColor(currentArticle.difficulty)}`}>
                {currentArticle.difficulty}
              </span>
              <span>📚 {currentArticle.language}</span>
              <span>⏱️ {currentArticle.estimatedTime}</span>
            </div>
          </div>

          {/* 会話エリア */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {currentArticle.conversation.map((message, index) => {
              const char = characters[message.character]
              return (
                <div key={message.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${char.color} flex items-center justify-center text-lg`}>
                    {char.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-medium ${char.textColor}`}>
                        {char.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      {message.isTyping ? (
                        <div className="flex items-center space-x-1">
                          <div className="animate-bounce">●</div>
                          <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</div>
                          <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</div>
                        </div>
                      ) : (
                        <p className="text-gray-800">{message.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={chatEndRef} />
          </div>

          {/* アクションボタン */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => {
                setIsConversationActive(false)
                setCurrentArticle(null)
                setSelectedTopic('')
                setSelectedLanguage('')
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              新しい記事を作成
            </button>
            <button
              onClick={() => playConversation(currentArticle.conversation)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              🔄 会話を再生
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
