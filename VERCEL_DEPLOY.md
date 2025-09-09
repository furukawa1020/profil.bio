# Vercel デプロイ設定

## 🚀 Vercel 自動デプロイ設定

### 1. プロジェクト構成
```
root/
├── frontend/          # Next.js アプリケーション (Vercelでデプロイ)
├── backend/           # Go API ゲートウェイ (Railwayでデプロイ済み)
├── vercel.json        # ルートレベルのVercel設定
└── frontend/vercel.json # フロントエンド固有の設定
```

### 2. Vercel 環境変数設定
プロジェクト設定 > Environment Variables で以下を設定:

```bash
NEXT_PUBLIC_API_URL=https://backend-production-e46a.up.railway.app
NEXT_PUBLIC_AI_SERVICE_URL=https://backend-production-e46a.up.railway.app  
NEXT_PUBLIC_SNS_SERVICE_URL=https://backend-production-e46a.up.railway.app
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_SITE_NAME=Polyglot Philosophy Playground - furukawa1020
```

### 3. デプロイ設定
- **ルートディレクトリ**: `/frontend`
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `.next`
- **インストールコマンド**: `npm install`

### 4. API プロキシ設定
`vercel.json` でRailway APIへのプロキシを設定済み:
- `/api/v1/*` → `https://backend-production-e46a.up.railway.app/api/v1/*`

### 5. トラブルシューティング
自動デプロイが機能しない場合:
1. GitHub連携の確認
2. vercel.json ファイルの存在確認  
3. 環境変数の設定確認
4. ビルドログの確認

### 6. 手動デプロイ
```bash
cd frontend
npm run build
npx vercel --prod
```
