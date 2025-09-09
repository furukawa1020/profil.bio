'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, User, MapPin, Calendar, Github, Mail, ExternalLink } from 'lucide-react'

interface Profile {
  id: string
  username: string
  display_name: string
  bio: string
  avatar_url: string
  philosophy_level: number
  conviction_points: number
  created_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SNS_SERVICE_URL}/api/profile/current`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('プロフィールの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⛄</div>
          <p className="text-gray-600">プロフィールを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Link>
        </div>

        {/* プロフィールカード */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* カバー画像 */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          {/* プロフィール情報 */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              {/* アバター */}
              <div className="relative -mt-16 mb-4 md:mb-0">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="プロフィール画像" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              </div>

              {/* 基本情報 */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {profile?.display_name || 'ユーザー名'}
                </h1>
                <p className="text-gray-600 mb-4">
                  @{profile?.username || 'username'}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {profile?.bio || 'プログラマー、思考家、技術愛好者。新しいアイデアと革新的なソリューションを追求しています。'}
                </p>

                {/* メタ情報 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>日本</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>参加日: {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2024'}年</span>
                  </div>
                </div>

                {/* ソーシャルリンク */}
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://github.com/furukawa1020" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                  <Link 
                    href="/contact"
                    className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    <span>お問い合わせ</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 統計情報 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {profile?.philosophy_level || 42}
            </div>
            <div className="text-gray-600">思考レベル</div>
            <div className="text-sm text-gray-500 mt-1">継続的な学習と成長</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {profile?.conviction_points || 1337}
            </div>
            <div className="text-gray-600">確信ポイント</div>
            <div className="text-sm text-gray-500 mt-1">アイデアへの自信度</div>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
            <div className="text-gray-600">可能性</div>
            <div className="text-sm text-gray-500 mt-1">限界を超えた思考</div>
          </div>
        </motion.div>

        {/* スキル・興味 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 mt-8 shadow-md"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">スキル・興味</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Go', 'Rust',
              '機械学習', 'Web開発', 'UI/UX', '問題解決', '創造的思考', 'システム設計'
            ].map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
