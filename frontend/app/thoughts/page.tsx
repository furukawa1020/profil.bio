export default function Thoughts() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="text-blue-600">← 戻る</a>
            <div>
              <h1 className="text-xl font-bold text-gray-900">私の考え</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-600">日々の思考や気づきを短い形で記録しています。</p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-800 mb-2">技術的な課題に取り組む時は、まず問題を小さく分解することが大切だと感じています。</p>
            <span className="text-sm text-gray-500">2024年1月3日</span>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-800 mb-2">ユーザーの立場で物事を考えることで、より良いソリューションが見えてきます。</p>
            <span className="text-sm text-gray-500">2024年1月2日</span>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-gray-800 mb-2">継続的な学習と実践のバランスを保つことが成長の鍵だと思います。</p>
            <span className="text-sm text-gray-500">2024年1月1日</span>
          </div>

          <div className="text-center py-8">
            <p className="text-gray-500">思考は日々更新されます</p>
          </div>
        </div>
      </main>
    </div>
  )
}
