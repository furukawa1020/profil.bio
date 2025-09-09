export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="text-blue-600">← 戻る</a>
            <div>
              <h1 className="text-xl font-bold text-gray-900">連絡先</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">お気軽にご連絡ください</h2>
            <p className="text-gray-700 mb-4">
              ご質問、ご意見、お仕事のご相談など、お気軽にお声がけください。
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">GitHub</h3>
              <a href="https://github.com/furukawa1020" className="text-blue-600">
                github.com/furukawa1020
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Twitter</h3>
              <a href="https://twitter.com/furukawa1020" className="text-blue-600">
                @furukawa1020
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">メール</h3>
              <p className="text-gray-600">DM等でお気軽にご連絡ください</p>
            </div>
          </div>

          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              返信には数日お時間をいただく場合があります
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
