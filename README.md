# 🌟 Polyglot Philosophy Playground

**技術と社会の再設計で、生きててよかったと思える未来を。**  
*Re-designing technology and society for a future where people can truly say "I'm glad to be alive."*

## 🎯 プロジェクト概要

Polyglot Philosophy Playgroundは、多言語・多フレームワークを活用した哲学的なWebアプリケーションです。技術力・哲学・ユーモアを一体化し、人々が本当に感じられる体験を提供します。

## ✨ 特徴

### 🔑 Three Pillars
1. **ユーザーフレンドリーなデザイン** - 直感的で親しみやすいシステム
2. **共感とつながり** - 人々が本当に感じられるコミュニティ
3. **心に響くものづくり** - 効率偏重ではなく、感情に寄り添う創造

### 🎭 AIキャラクターズ
- **☃️ 雪だるまチャン** (Go/Rust担当) - ポジティブで効率重視
- **🐸 寂しガエル** (Python担当) - 哲学的で深い思考
- **🐡 フグちゃん** (JavaScript担当) - ユーモラスで爆発的

### 🌟 主要機能
- **納得メーター** - 「なるほど！」でサイト全体が光る
- **呼吸する背景** - 効率偏重の外の価値をUI化
- **3D宇宙マップ** - 言語=惑星、記事=衛星の世界観
- **並列思想シミュレーション** - 複数哲学をgoroutineで同時実行
- **SNS統合** - X, GitHub, Instagram, Facebook連携
- **WebXR対応** - VR空間での記事探索

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 14** - React フレームワーク
- **TailwindCSS** - ユーティリティファーストCSS
- **Three.js** - 3D可視化
- **Framer Motion** - アニメーション
- **WebXR** - VR/AR対応

### バックエンド (マイクロサービス構成)
- **Go** - メインAPI & 統合レイヤー
- **Python** - 哲学的思考エンジン (寂しガエル)
- **Rust** - 完璧主義エンジン (雪だるまチャン)
- **Node.js** - リアルタイム通信
- **PostgreSQL** - メインデータベース

### インフラ
- **Docker** - コンテナ化
- **Docker Compose** - ローカル開発環境
- **Vercel** - フロントエンド デプロイ
- **Render/GCP** - バックエンド デプロイ

## 🚀 クイックスタート

### 前提条件
- Node.js 18+
- Go 1.21+
- Python 3.11+
- Rust 1.70+
- Docker & Docker Compose

### 1. リポジトリのクローン
```bash
git clone https://github.com/furukawa1020/polyglot-philosophy-playground.git
cd polyglot-philosophy-playground
```

### 2. Docker Composeで全サービス起動
```bash
docker-compose up -d
```

### 3. アクセス
- **フロントエンド**: http://localhost:3000
- **メインAPI**: http://localhost:8080
- **Python Wisdom**: http://localhost:5001
- **Rust Perfection**: http://localhost:5002

## 🌐 Vercelデプロイ手順

### 1. 環境変数の設定
Vercelダッシュボードで以下の環境変数を設定:
```bash
NEXT_PUBLIC_API_URL=https://backend-production-e46a.up.railway.app
NEXT_PUBLIC_AI_SERVICE_URL=https://backend-production-e46a.up.railway.app
NEXT_PUBLIC_SNS_SERVICE_URL=https://backend-production-e46a.up.railway.app
NEXT_PUBLIC_ENV=production
```

### 2. デプロイ方法

#### GitHub連携 (推奨)
1. GitHubリポジトリをVercelに接続
2. `frontend`ディレクトリをルートとして指定
3. 自動デプロイが開始されます

#### Vercel CLI
```bash
npm i -g vercel
cd frontend
vercel --prod
```

### 3. バックエンド接続
- バックエンドはRailwayで稼働中: `https://backend-production-e46a.up.railway.app`
- フロントエンドは自動的にバックエンドAPIに接続します
- ヘルスチェック: `/health`

## 🔧 個別開発環境

### フロントエンド開発
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

### Go バックエンド開発
```bash
cd backend
go mod tidy
go run main.go
# http://localhost:8080
```

### Python マイクロサービス開発
```bash
cd microservices/python-wisdom
pip install -r requirements.txt
python app.py
# http://localhost:5001
```

### Rust マイクロサービス開発
```bash
cd microservices/rust-perfection
cargo run
# http://localhost:5002
```

## 📁 プロジェクト構造

```
polyglot-philosophy-playground/
├── frontend/                 # Next.js フロントエンド
│   ├── app/                 # App Router
│   ├── components/          # Reactコンポーネント
│   └── ...
├── backend/                 # Go メインAPI
│   ├── main.go             # サーバーエントリーポイント
│   └── ...
├── microservices/           # マイクロサービス群
│   ├── python-wisdom/       # Python 哲学エンジン
│   ├── rust-perfection/     # Rust 完璧主義エンジン
│   └── ...
├── db/                      # データベース関連
├── ai/                      # AI統合スクリプト
├── iot/                     # IoT デバイス制御
├── infra/                   # インフラ設定
└── docker-compose.yml       # 統合環境設定
```

## 🌐 SNS & 連絡先

- **X (Twitter)**: [@HATAKE55555](https://x.com/HATAKE55555)
- **GitHub**: [furukawa1020](https://github.com/furukawa1020)
- **Instagram**: [ko102012](https://www.instagram.com/ko102012/)
- **Facebook**: [Profile](https://www.facebook.com/share/1MfowvJDsJ/)
- **Email**: [f.kotaro.0530@gmail.com](mailto:f.kotaro.0530@gmail.com)

## 🎮 使い方

### 基本操作
1. **納得メーター** - 「なるほど！」ボタンをクリック
2. **AIキャラクター** - キャラクターをクリックして対話
3. **3D宇宙** - マウスで宇宙空間を探索
4. **記事投稿** - Markdown形式で哲学的な記事を投稿

### API エンドポイント

#### メインAPI (Go - Port 8080)
- `GET /health` - ヘルスチェック
- `GET /api/v1/articles` - 記事一覧取得
- `POST /api/v1/articles` - 記事作成
- `POST /api/v1/conviction` - 納得メーター更新
- `GET /api/v1/philosophy/simulate` - 並列哲学思考

#### Python Wisdom Service (Port 5001)
- `GET /health` - サービス状態
- `GET /wisdom/<topic>` - トピック別の知恵
- `POST /parallel-thinking` - 並列思考実行

#### Rust Perfection Service (Port 5002)
- `GET /health` - サービス状態
- `POST /optimize` - タスク最適化
- `GET /status` - キャラクター状態

## 🔮 今後の展開

### Phase 1 (Current)
- [x] 基本的なマイクロサービス構成
- [x] AIキャラクター統合
- [x] 3D可視化基盤
- [x] SNS連携

### Phase 2 (計画中)
- [ ] WebXR 完全対応
- [ ] IoT デバイス連携 (ESP32/M5Stack)
- [ ] AIツイン (自分の思想を学習したAI分身)
- [ ] 詳細な哲学バージョン管理

### Phase 3 (未来)
- [ ] 量子コンピューティング統合
- [ ] ブロックチェーン思想記録
- [ ] AR 空間での哲学対話

## 🤝 コントリビューション

プルリクエスト、イシュー報告、アイデア提案、大歓迎です！

### 開発の流れ
1. フォーク
2. フィーチャーブランチ作成
3. 変更をコミット
4. プルリクエスト作成

### コーディング規約
- **Go**: `gofmt` を使用
- **Rust**: `cargo fmt` を使用
- **Python**: `black` を使用
- **TypeScript**: `prettier` を使用

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🙏 謝辞

このプロジェクトは、効率偏重の社会に疑問を感じ、「生きててよかった」と思える未来を信じるすべての人々へ捧げます。

---

**「技術と社会の再設計で、生きててよかったと思える未来を。」**

*Made with ❤️, 🤖, and ☃️ by [furukawa1020](https://github.com/furukawa1020)*
