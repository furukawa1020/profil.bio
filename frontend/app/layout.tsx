import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Polyglot Philosophy Playground',
  description: '技術と社会の再設計で、生きててよかったと思える未来を。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} breathing-background min-h-screen`}>
        <div className="relative z-10">
          {children}
        </div>
        {/* 呼吸する背景エフェクト */}
        <div className="fixed inset-0 z-0 breathing-background opacity-30"></div>
      </body>
    </html>
  )
}
