'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function SNSLinks() {
  const [hoveredLink, setHoveredLink] = useState(null)

  const internalLinks = [
    {
      id: 'feed',
      name: '哲学フィード',
      url: '/feed',
      icon: '�',
      color: 'bg-blue-500',
      characterComment: '雪だるまチャン: みんなの哲学的な投稿を見てみよう！☃️'
    },
    {
      id: 'profile',
      name: 'プロファイル',
      url: '/profile',
      icon: '�',
      color: 'bg-purple-500',
      characterComment: 'フグちゃん: 自分の哲学レベルをチェックだっぺ！🐡'
    },
    {
      id: 'conviction',
      name: '納得メーター',
      url: '/conviction',
      icon: '�',
      color: 'bg-yellow-500',
      characterComment: '寂しガエル: 納得度で世界を変えよう...🐸'
    },
    {
      id: 'universe',
      name: '3D宇宙マップ',
      url: '/universe',
      icon: '🌌',
      color: 'bg-indigo-500',
      characterComment: '雪だるまチャン: 宇宙空間で哲学を探索しよう！☃️'
    },
    {
      id: 'contact',
      name: 'お問い合わせ',
      url: '/contact',
      icon: '📧',
      color: 'bg-red-500',
      characterComment: 'フグちゃん: 質問があったら気軽にどうぞ！🐡💥'
    }
  ]

  const externalSocialLinks = [
    {
      id: 'github',
      name: 'GitHub',
      url: 'https://github.com/furukawa1020',
      icon: '🐱',
      description: '技術的な作品とコード'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      url: 'https://x.com/HATAKE55555',
      icon: '🐦',
      description: '日々の思考と発信'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/ko102012/',
      icon: '📸',
      description: '視覚的なクリエイティブ'
    }
  ]

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-6">
        🌐 哲学的つながり 🌐
      </h2>
      <p className="text-gray-300 mb-8">
        内部SNS機能で深いつながりを、外部リンクで幅広い交流を
      </p>

      {/* 内部SNS機能 */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-wisdom-gold mb-4">
          🏛️ Philosophy Playground 内部機能
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {internalLinks.map((link) => (
            <motion.div
              key={link.id}
              className="relative"
              onMouseEnter={() => setHoveredLink(link.id)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <motion.a
                href={link.url}
                className={`
                  block p-4 rounded-lg ${link.color}
                  text-white font-bold text-center
                  hover:shadow-2xl transition-all duration-300
                  transform hover:scale-110
                `}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{link.icon}</div>
                <div className="text-sm">{link.name}</div>
              </motion.a>

              {/* キャラクターコメント */}
              {hoveredLink === link.id && (
                <motion.div
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-20"
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                >
                  <div className="bg-black/90 text-white p-3 rounded-lg text-xs max-w-xs whitespace-nowrap">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/90"></div>
                    </div>
                    {link.characterComment}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 外部ソーシャルリンク */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-connection-pink mb-4">
          🔗 外部ソーシャルリンク
        </h3>
        <div className="flex justify-center space-x-6">
          {externalSocialLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-2">{link.icon}</div>
              <div className="text-sm font-bold text-white">{link.name}</div>
              <div className="text-xs text-gray-400">{link.description}</div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* 内部シェア機能 */}
      <motion.div
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">
          📤 哲学的な思考をシェア
        </h3>
        <div className="flex justify-center space-x-4">
          <motion.button
            onClick={() => {
              // 内部SNSに投稿
              window.location.href = '/create-post'
            }}
            className="bg-philosophy-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏛️ 哲学フィードに投稿
          </motion.button>
          
          <motion.button
            onClick={() => {
              // 納得メーターを増加
              fetch('/api/v1/conviction', { method: 'POST' })
                .then(() => alert('納得度を追加しました！'))
            }}
            className="bg-wisdom-gold hover:bg-yellow-600 text-black px-6 py-3 rounded-lg transition-colors font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            � 納得メーターを増加
          </motion.button>
        </div>
        
        <p className="text-xs text-gray-400 mt-4">
          フグちゃん: 内部SNSでつながって、一緒に哲学しようっぺ！🐡💥
        </p>
      </motion.div>

      {/* リアルタイム統計 */}
      <motion.div
        className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h4 className="text-lg font-bold text-white mb-2">📊 リアルタイム統計</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-2xl">👥</div>
            <div className="text-white font-bold">アクティブユーザー</div>
            <div className="text-gray-400">42人</div>
          </div>
          <div>
            <div className="text-2xl">📝</div>
            <div className="text-white font-bold">今日の投稿</div>
            <div className="text-gray-400">18件</div>
          </div>
          <div>
            <div className="text-2xl">💡</div>
            <div className="text-white font-bold">総納得度</div>
            <div className="text-gray-400">1,337</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
