'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ShareButtons from '@/components/ShareButtons'

// カスタムSVGアイコンコンポーネント
const BrainIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2a10 10 0 0 0-7.07 17.07L12 12l7.07 7.07A10 10 0 0 0 12 2z"/>
    <path d="M9.5 9.5L12 12l2.5-2.5"/>
  </svg>
)

const LightbulbIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21h6"/>
    <path d="M12 3a6 6 0 0 1 6 6c0 3-2 4-3 6h-6c-1-2-3-3-3-6a6 6 0 0 1 6-6z"/>
  </svg>
)

const BookIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)

const ClockIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
)

const TagIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

const StarIcon = ({ className = "w-6 h-6", filled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
)

const FireIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
)

const TrendingUpIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

interface Thought {
  id: string
  title: string
  content: string
  category: string
  timestamp: string
  impact: number
  tags: string[]
  readTime: number
}

interface ThoughtCategory {
  id: string
  name: string
  color: string
  icon: React.ReactNode
  count: number
}

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [simulationLoading, setSimulationLoading] = useState(false)
  const [wisdomData, setWisdomData] = useState<any>(null)
  const [wisdomLoading, setWisdomLoading] = useState(false)

  const categories: ThoughtCategory[] = [
    { id: 'all', name: 'すべて', color: 'text-gray-600', icon: <BookIcon className="w-4 h-4" />, count: 0 },
    { id: 'tech', name: '技術洞察', color: 'text-blue-600', icon: <BrainIcon className="w-4 h-4" />, count: 0 },
    { id: 'innovation', name: 'イノベーション', color: 'text-purple-600', icon: <LightbulbIcon className="w-4 h-4" />, count: 0 },
    { id: 'strategy', name: '戦略思考', color: 'text-green-600', icon: <TrendingUpIcon className="w-4 h-4" />, count: 0 },
    { id: 'creative', name: 'クリエイティブ', color: 'text-orange-600', icon: <FireIcon className="w-4 h-4" />, count: 0 }
  ]

  // デモデータ
  const demoThoughts: Thought[] = [
    {
      id: '1',
      title: 'マイクロサービスアーキテクチャの進化',
      content: '現代のソフトウェア開発において、マイクロサービスは単なるアーキテクチャパターンを超えて、組織の思考フレームワークそのものを変革している。各サービスが独立して進化できるということは、チームもまた独立して価値を創造できるということを意味する。',
      category: 'tech',
      timestamp: '2024-01-15T10:30:00Z',
      impact: 92,
      tags: ['アーキテクチャ', '組織論', 'DevOps'],
      readTime: 5
    },
    {
      id: '2',
      title: 'AIとヒューマンクリエイティビティの共生',
      content: 'AIが創造的プロセスに参加することで、人間の創造性はなくなるのではなく、むしろ新たな次元に押し上げられる。AIは単なるツールではなく、創造的パートナーとして機能し、人間の想像力を拡張する役割を果たしている。',
      category: 'innovation',
      timestamp: '2024-01-14T15:45:00Z',
      impact: 87,
      tags: ['AI', 'クリエイティビティ', '未来'],
      readTime: 4
    },
    {
      id: '3',
      title: 'デジタル変革における文化的側面',
      content: 'DXの成功は技術的な実装よりも、組織文化の変革にかかっている。技術は手段であり、真の変革は人々の働き方、考え方、価値観の変化によってもたらされる。',
      category: 'strategy',
      timestamp: '2024-01-13T09:20:00Z',
      impact: 94,
      tags: ['DX', '文化変革', 'リーダーシップ'],
      readTime: 6
    },
    {
      id: '4',
      title: 'コードは詩である',
      content: 'プログラミングは単なる問題解決ツールではない。優雅なコードは詩のように美しく、読む人の心に響く。機能性と美しさを両立させることこそが、真のソフトウェア職人技と言える。',
      category: 'creative',
      timestamp: '2024-01-12T14:10:00Z',
      impact: 89,
      tags: ['プログラミング', '美学', '職人技'],
      readTime: 3
    },
    {
      id: '5',
      title: 'オープンソースエコシステムの未来',
      content: 'オープンソースは単なるソフトウェア開発手法を超えて、知識共有の新しいパラダイムを創造している。この協働モデルは、ソフトウェア業界だけでなく、あらゆる知識労働に革命をもたらす可能性を秘めている。',
      category: 'tech',
      timestamp: '2024-01-11T11:30:00Z',
      impact: 91,
      tags: ['オープンソース', '協働', '知識共有'],
      readTime: 7
    }
  ]

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_GATEWAY_URL

        if (apiUrl) {
          const response = await fetch(`${apiUrl}/api/v1/thoughts`)
          if (response.ok) {
            const data = await response.json()
            setThoughts(data)
          } else {
            // バックエンドが利用できない場合はデモデータを使用
            setThoughts(demoThoughts)
          }
        } else {
          setThoughts(demoThoughts)
        }
      } catch (err) {
        console.error('思考データの取得に失敗:', err)
        setThoughts(demoThoughts)
      } finally {
        setLoading(false)
      }
    }

    fetchThoughts()
  }, [])

  const filteredThoughts = selectedCategory === 'all' 
    ? thoughts 
    : thoughts.filter(thought => thought.category === selectedCategory)

  const getImpactColor = (impact: number) => {
    if (impact >= 90) return 'text-red-500'
    if (impact >= 80) return 'text-orange-500'
    if (impact >= 70) return 'text-yellow-500'
    return 'text-green-500'
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0]
  }

  // 哲学シミュレーション機能
  const runPhilosophySimulation = async () => {
    try {
      setSimulationLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-e46a.up.railway.app'
      const response = await fetch(`${apiUrl}/api/v1/philosophy/simulate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setSimulationResult(data)
      } else {
        throw new Error('シミュレーションに失敗しました')
      }
    } catch (err) {
      console.error('Philosophy simulation error:', err)
      setError('哲学シミュレーションの実行に失敗しました')
    } finally {
      setSimulationLoading(false)
    }
  }

  const generateWisdom = async () => {
    try {
      setWisdomLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-e46a.up.railway.app'
      const response = await fetch(`${apiUrl}/api/v1/ai/wisdom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setWisdomData(data)
      } else {
        throw new Error('洞察の生成に失敗しました')
      }
    } catch (err) {
      console.error('Wisdom generation error:', err)
      setError('AI洞察の生成に失敗しました')
    } finally {
      setWisdomLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BrainIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">思考を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BrainIcon className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Profil.bio</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/articles" className="text-gray-600 hover:text-blue-600 transition-colors">記事</Link>
              <Link href="/thoughts" className="text-blue-600 font-medium">思考</Link>
              <Link href="/feed" className="text-gray-600 hover:text-blue-600 transition-colors">フィード</Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">プロフィール</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">連絡</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ページヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            深層思考
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            技術、イノベーション、戦略に関する洞察と考察
          </p>
        </div>

        {/* 哲学シミュレーション */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">🧠 並列哲学思考シミュレーション</h2>
              <p className="text-sm text-gray-600">5つの異なる哲学的アプローチを同時実行</p>
            </div>
            <button
              onClick={runPhilosophySimulation}
              disabled={simulationLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              {simulationLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <BrainIcon className="w-4 h-4" />
              )}
              <span>{simulationLoading ? '実行中...' : 'シミュレーション実行'}</span>
            </button>
          </div>
          
          {simulationResult && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800 mb-2">
                <strong>結果:</strong> {simulationResult.message}
              </p>
              <p className="text-xs text-purple-600">
                使用ゴルーチン: {simulationResult.goroutines_used} | 
                並列思考数: {simulationResult.parallel_thoughts?.length || 0}
              </p>
              {simulationResult.parallel_thoughts && (
                <div className="mt-3 grid gap-2">
                  {simulationResult.parallel_thoughts.slice(0, 3).map((thought: string, index: number) => (
                    <div key={index} className="text-xs text-purple-700 bg-white/50 p-2 rounded">
                      {thought}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI洞察生成 */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">💡 AI洞察ジェネレーター</h2>
              <p className="text-sm text-gray-600">人工知能による深層思考パターンの分析と洞察</p>
            </div>
            <button
              onClick={generateWisdom}
              disabled={wisdomLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              {wisdomLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LightbulbIcon className="w-4 h-4" />
              )}
              <span>{wisdomLoading ? '生成中...' : '洞察を生成'}</span>
            </button>
          </div>
          
          {wisdomData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                <strong>洞察:</strong> {wisdomData.message}
              </p>
              {wisdomData.type && (
                <p className="text-xs text-blue-600">
                  洞察タイプ: {wisdomData.type}
                </p>
              )}
              {wisdomData.context && (
                <div className="mt-2 text-xs text-blue-700 bg-white/50 p-2 rounded">
                  {wisdomData.context}
                </div>
              )}
            </div>
          )}
        </div>

        {/* カテゴリーフィルター */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {category.icon}
              <span className="font-medium">{category.name}</span>
              <span className="text-xs opacity-75">
                ({category.id === 'all' ? thoughts.length : thoughts.filter(t => t.category === category.id).length})
              </span>
            </button>
          ))}
        </div>

        {/* 思考グリッド */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredThoughts.map((thought) => {
            const categoryInfo = getCategoryInfo(thought.category)
            return (
              <article
                key={thought.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200"
              >
                {/* 思考メタ情報 */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center space-x-1 ${categoryInfo.color}`}>
                    {categoryInfo.icon}
                    <span className="text-sm font-medium">{categoryInfo.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <ClockIcon className="w-4 h-4" />
                    <span>{thought.readTime}分</span>
                  </div>
                </div>

                {/* タイトル */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {thought.title}
                </h2>

                {/* 内容プレビュー */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {thought.content}
                </p>

                {/* タグ */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {thought.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      <TagIcon className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {/* インパクトと日付 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <FireIcon className={`w-4 h-4 ${getImpactColor(thought.impact)}`} />
                      <span className={`text-sm font-medium ${getImpactColor(thought.impact)}`}>
                        {thought.impact}%
                      </span>
                    </div>
                    <span className="text-gray-400">影響度</span>
                  </div>
                  <time className="text-sm text-gray-500">
                    {formatDate(thought.timestamp)}
                  </time>
                </div>

                {/* 続きを読むボタンとシェア */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      詳細を読む →
                    </button>
                    
                    {/* シェアボタン */}
                    <ShareButtons
                      url={`/thoughts/${thought.id}`}
                      title={thought.title}
                      description={thought.content.substring(0, 100)}
                      className="ml-auto"
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* 思考がない場合のメッセージ */}
        {filteredThoughts.length === 0 && (
          <div className="text-center py-12">
            <BrainIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              このカテゴリーには思考がありません
            </h3>
            <p className="text-gray-500">
              他のカテゴリーを探索してみてください
            </p>
          </div>
        )}

        {/* 統計情報 */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            思考統計
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {thoughts.length}
              </div>
              <div className="text-gray-600">総思考数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {thoughts.reduce((sum, thought) => sum + thought.readTime, 0)}
              </div>
              <div className="text-gray-600">総読了時間(分)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(thoughts.reduce((sum, thought) => sum + thought.impact, 0) / thoughts.length) || 0}
              </div>
              <div className="text-gray-600">平均影響度</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {new Set(thoughts.flatMap(thought => thought.tags)).size}
              </div>
              <div className="text-gray-600">ユニークタグ</div>
            </div>
          </div>
        </div>

        {/* フッターCTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              新しい思考を共有しませんか？
            </h3>
            <p className="text-blue-100 mb-6">
              あなたの洞察が次のイノベーションを生み出すかもしれません
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <LightbulbIcon className="w-5 h-5" />
              <span>アイデアを共有</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
