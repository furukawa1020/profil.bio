'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// カスタムSVGアイコンコンポーネント
const ChatIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RobotIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="2" r="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="15.5" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="15.5" r="1.5" fill="currentColor"/>
  </svg>
);

const SendIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12L22 2L13 21L11 13L2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  character?: string;
  emotion?: string;
  timestamp: Date;
}

interface AICharacter {
  id: string;
  name: string;
  emoji: string;
  description: string;
  specialty: string;
}

const characters: AICharacter[] = [
  {
    id: 'socrates',
    name: 'ソクラテス',
    emoji: '🧙‍♂️',
    description: '古代ギリシャの哲学者',
    specialty: '質問による探求'
  },
  {
    id: 'aristotle',
    name: 'アリストテレス',
    emoji: '📚',
    description: '論理学の父',
    specialty: '論理的思考'
  },
  {
    id: 'confucius',
    name: '孔子',
    emoji: '🎋',
    description: '中国の思想家',
    specialty: '道徳と礼'
  },
  {
    id: 'buddha',
    name: 'ブッダ',
    emoji: '🧘‍♂️',
    description: '仏教の開祖',
    specialty: '悟りと慈悲'
  },
  {
    id: 'nietzsche',
    name: 'ニーチェ',
    emoji: '⚡',
    description: 'ドイツの哲学者',
    specialty: '価値の転換'
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('socrates');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [characterDetails, setCharacterDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 初期メッセージ
    setMessages([
      {
        id: 1,
        text: `こんにちは！私は${characters.find(c => c.id === selectedCharacter)?.name}です。哲学について一緒に考えてみませんか？`,
        sender: 'ai',
        character: selectedCharacter,
        timestamp: new Date()
      }
    ]);
  }, [selectedCharacter]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-e46a.up.railway.app';
      const response = await fetch(`${apiUrl}/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText.trim(),
          character: selectedCharacter
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: チャットAPIエラー`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.response || 'すみません、今はお話しできません...',
        sender: 'ai',
        character: data.character || selectedCharacter,
        emotion: data.emotion,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('AIとの通信に失敗しました。しばらくしてから再度お試しください。');
      
      // フォールバック応答
      const fallbackMessage: Message = {
        id: Date.now() + 1,
        text: 'すみません、今は少し調子が悪いようです...しばらくしてから再度お試しください。🤖',
        sender: 'ai',
        character: selectedCharacter,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fetchCharacterDetails = async () => {
    try {
      setDetailsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-e46a.up.railway.app';
      const response = await fetch(`${apiUrl}/api/v1/ai/personalities`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCharacterDetails(data);
      } else {
        throw new Error('キャラクター詳細の取得に失敗しました');
      }
    } catch (err) {
      console.error('Character details error:', err);
      setError('キャラクター情報の取得に失敗しました');
    } finally {
      setDetailsLoading(false);
    }
  };

  const selectedChar = characters.find(c => c.id === selectedCharacter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                ← ホームに戻る
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <ChatIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">AI哲学チャット</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* キャラクター選択 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">対話する哲学者を選択</h2>
            <button
              onClick={fetchCharacterDetails}
              disabled={detailsLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-3 py-1 rounded-lg transition-colors flex items-center space-x-1 text-sm"
            >
              {detailsLoading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <UserIcon className="w-3 h-3" />
              )}
              <span>{detailsLoading ? '取得中...' : '詳細情報'}</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {characters.map((character) => (
              <button
                key={character.id}
                onClick={() => setSelectedCharacter(character.id)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedCharacter === character.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-1">{character.emoji}</div>
                <div className="text-sm font-medium text-gray-900">{character.name}</div>
                <div className="text-xs text-gray-600">{character.specialty}</div>
              </button>
            ))}
          </div>
          {selectedChar && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">{selectedChar.name}</span>: {selectedChar.description}
              </p>
            </div>
          )}
          {characterDetails && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-sm font-semibold text-indigo-800 mb-2">🎭 AI キャラクター詳細</h3>
              <p className="text-sm text-indigo-700 mb-2">
                <strong>メッセージ:</strong> {characterDetails.message}
              </p>
              {characterDetails.personalities && (
                <div className="space-y-1">
                  <p className="text-xs text-indigo-600 font-medium">利用可能なキャラクター:</p>
                  {characterDetails.personalities.slice(0, 3).map((personality: string, index: number) => (
                    <div key={index} className="text-xs text-indigo-600 bg-white/50 p-1 rounded">
                      {personality}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* チャットエリア */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* メッセージエリア */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <UserIcon className="w-4 h-4" />
                    ) : (
                      <span className="text-sm">
                        {characters.find(c => c.id === message.character)?.emoji || '🤖'}
                      </span>
                    )}
                  </div>
                  <div className={`rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <RobotIcon className="w-4 h-4 text-gray-600 animate-pulse" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="border-t border-gray-200 p-4">
            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex space-x-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`${selectedChar?.name}と哲学について話してみましょう...`}
                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enterで送信、Shift+Enterで改行
            </p>
          </div>
        </div>

        {/* 使い方ガイド */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 使い方ガイド</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-purple-800 mb-2">💬 対話のコツ</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>具体的な質問をしてみましょう</li>
                <li>哲学的なテーマについて聞いてみてください</li>
                <li>人生の悩みを相談してみましょう</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-800 mb-2">🎭 キャラクターの特徴</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>ソクラテス: 質問で思考を深める</li>
                <li>アリストテレス: 論理的に分析</li>
                <li>孔子: 道徳的な観点で助言</li>
                <li>ブッダ: 悟りの視点で導く</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
