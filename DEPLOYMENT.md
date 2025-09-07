# 🚀 Deployment Guide - Polyglot Philosophy Playground

## 📋 デプロイメント戦略

### 🌟 推奨構成
- **フロントエンド**: Vercel (Next.js最適化)
- **バックエンド**: Railway/Render (Docker対応)
- **データベース**: PostgreSQL (Supabase/Railway)

## 🎯 1. Vercel フロントエンドデプロイ

### 事前準備
```bash
# GitHubにリポジトリをプッシュ
git remote add origin https://github.com/furukawa1020/polyglot-philosophy-playground.git
git push -u origin master
```

### Vercelデプロイ手順
1. **Vercel.com** にアクセス
2. **Import Git Repository** を選択
3. GitHubアカウント連携
4. `polyglot-philosophy-playground` リポジトリを選択
5. 設定:
   ```
   Framework Preset: Next.js
   Root Directory: ./frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### 環境変数設定
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app
```

## 🐳 2. Railway バックエンドデプロイ

### Docker設定
```dockerfile
# Dockerfile.production
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

FROM golang:1.21-alpine AS backend
WORKDIR /app
COPY backend/ ./
RUN go mod tidy && go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=backend /app/main .
COPY --from=frontend /app/frontend/.next ./frontend/.next
EXPOSE 8080
CMD ["./main"]
```

### Railway.app デプロイ
1. **Railway.app** にアクセス
2. **Deploy from GitHub repo** を選択
3. リポジトリを選択
4. 環境変数設定:
   ```env
   DATABASE_URL=postgresql://...
   PORT=8080
   REDIS_URL=redis://...
   ```

## ☁️ 3. 代替デプロイ方法

### GitHub Pages (静的サイト)
```bash
npm run build
npm run export
# docs/ フォルダをGitHub Pagesで公開
```

### Netlify
```bash
# netlify.toml
[build]
  base = "frontend/"
  command = "npm run build"
  publish = ".next/"

[build.environment]
  NODE_VERSION = "18"
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🗄️ 4. データベース設定

### Supabase PostgreSQL
1. **Supabase.com** でプロジェクト作成
2. SQL Editorで `db/schema.sql` を実行
3. 接続文字列を取得

### Railway PostgreSQL
```bash
# Railway CLI
railway login
railway init
railway add postgresql
railway link [project-id]
```

## 🔧 5. 環境変数完全ガイド

### フロントエンド (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.polyglot-philosophy.com
NEXT_PUBLIC_WS_URL=wss://api.polyglot-philosophy.com
NEXT_PUBLIC_ENVIRONMENT=production
```

### バックエンド (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
PORT=8080
JWT_SECRET=your-secret-key
CORS_ORIGINS=https://polyglot-philosophy.vercel.app
```

## 🚀 6. ワンクリックデプロイ

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/furukawa1020/polyglot-philosophy-playground&project-name=polyglot-philosophy-playground)

### Deploy to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/...)

## 📊 7. デプロイ後チェックリスト

- [ ] フロントエンド動作確認
- [ ] API接続テスト
- [ ] データベース接続確認
- [ ] WebSocket通信テスト
- [ ] AIキャラクター応答確認
- [ ] 3D宇宙マップ表示確認
- [ ] SNSリンク動作確認

## 🔗 8. カスタムドメイン設定

### Vercel カスタムドメイン
1. Vercel Dashboard → Settings → Domains
2. ドメインを追加: `polyglot-philosophy.com`
3. DNS設定でCNAMEを追加

### Cloudflare設定 (推奨)
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
```

## 🛡️ 9. セキュリティ設定

### CORS設定
```go
// backend/main.go
c.AllowOrigins = []string{
    "https://polyglot-philosophy.vercel.app",
    "https://polyglot-philosophy.com",
}
```

### HTTPS強制
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  }
}
```

## 📈 10. モニタリング

### Vercel Analytics
```javascript
// _app.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

---

**🌟 デプロイ完了後のURL:**
- **メインサイト**: https://polyglot-philosophy.vercel.app
- **API**: https://api.polyglot-philosophy.com
- **ドキュメント**: https://docs.polyglot-philosophy.com

**技術と社会の再設計で、生きててよかったと思える未来を。** 🚀✨
