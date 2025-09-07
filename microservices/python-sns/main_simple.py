"""
シンプルなPython SNSサービス - SQLite版
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import os
import uvicorn
from datetime import datetime

app = FastAPI(title="Polyglot Philosophy SNS Service", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベース初期化
def init_db():
    conn = sqlite3.connect('sns.db')
    cursor = conn.cursor()
    
    # ユーザーテーブル
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            display_name TEXT NOT NULL,
            bio TEXT,
            avatar_url TEXT,
            conviction_score INTEGER DEFAULT 0,
            philosophy_level TEXT DEFAULT 'beginner',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 投稿テーブル
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            type TEXT DEFAULT 'text',
            conviction_level INTEGER DEFAULT 0,
            philosophy_tag TEXT,
            likes_count INTEGER DEFAULT 0,
            shares_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # いいねテーブル
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            post_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            UNIQUE(user_id, post_id)
        )
    ''')
    
    # デフォルトユーザーを作成
    cursor.execute('''
        INSERT OR IGNORE INTO users (username, email, display_name, bio, conviction_score, philosophy_level)
        VALUES 
        ('snowman_chan', 'snowman@philosophy.com', '雪だるまチャン', '雪の中で哲学を考える可愛い雪だるま', 85, 'master'),
        ('lonely_frog', 'frog@philosophy.com', '寂しガエル', '池で一人物思いにふける哲学的なカエル', 70, 'advanced'),
        ('pufferfish', 'puffer@philosophy.com', 'フグちゃん', '膨らんで考える深海の哲学者', 90, 'master'),
        ('philosopher_user', 'user@example.com', '哲学初心者', '哲学の世界に足を踏み入れた好奇心旺盛なユーザー', 30, 'beginner')
    ''')
    
    # デフォルト投稿を作成
    cursor.execute('''
        INSERT OR IGNORE INTO posts (user_id, content, type, conviction_level, philosophy_tag)
        VALUES 
        (1, '雪が溶けるとき、それは本当に消えているのでしょうか？それとも新しい形になっているだけなのでしょうか？ ❄️', 'philosophical', 80, 'metaphysics'),
        (2, '一人でいることと、孤独であることは違います。池の静寂の中で、私は宇宙と対話しています 🐸', 'wisdom', 75, 'existentialism'),
        (3, '怒りという感情も、実は深い愛から生まれるのかもしれません。膨らむのは、心が大きくなっている証拠です 🐡', 'emotional', 85, 'psychology'),
        (4, '哲学って難しそうだけど、日常の小さな疑問から始まるんですね！今日は空の青さについて考えてました 🌌', 'beginner', 40, 'everyday_philosophy')
    ''')
    
    conn.commit()
    conn.close()

# Pydanticモデル
class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    display_name: str
    bio: Optional[str] = ""
    avatar_url: Optional[str] = ""
    conviction_score: int = 0
    philosophy_level: str = "beginner"

class Post(BaseModel):
    id: Optional[int] = None
    user_id: int
    content: str
    type: str = "text"
    conviction_level: int = 0
    philosophy_tag: Optional[str] = ""
    likes_count: int = 0
    shares_count: int = 0
    created_at: Optional[str] = None

class PostCreate(BaseModel):
    content: str
    type: str = "text"
    conviction_level: int = 0
    philosophy_tag: Optional[str] = ""

# エンドポイント
@app.get("/")
async def root():
    return {"message": "Polyglot Philosophy SNS Service is running!", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "sns"}

@app.get("/users", response_model=List[User])
async def get_users():
    conn = sqlite3.connect('sns.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    conn.close()
    
    return [
        User(
            id=user[0],
            username=user[1],
            email=user[2],
            display_name=user[3],
            bio=user[4] or "",
            avatar_url=user[5] or "",
            conviction_score=user[6],
            philosophy_level=user[7]
        ) for user in users
    ]

@app.get("/posts", response_model=List[dict])
async def get_posts():
    conn = sqlite3.connect('sns.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT p.*, u.username, u.display_name, u.avatar_url 
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        ORDER BY p.created_at DESC
    ''')
    posts = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": post[0],
            "user_id": post[1],
            "content": post[2],
            "type": post[3],
            "conviction_level": post[4],
            "philosophy_tag": post[5],
            "likes_count": post[6],
            "shares_count": post[7],
            "created_at": post[8],
            "username": post[9],
            "display_name": post[10],
            "avatar_url": post[11]
        } for post in posts
    ]

@app.post("/posts", response_model=dict)
async def create_post(post: PostCreate, user_id: int = 1):
    conn = sqlite3.connect('sns.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO posts (user_id, content, type, conviction_level, philosophy_tag)
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, post.content, post.type, post.conviction_level, post.philosophy_tag))
    
    post_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {"id": post_id, "message": "投稿が作成されました"}

@app.post("/posts/{post_id}/like")
async def like_post(post_id: int, user_id: int = 1):
    conn = sqlite3.connect('sns.db')
    cursor = conn.cursor()
    
    # いいねの重複チェック
    cursor.execute("SELECT id FROM likes WHERE user_id = ? AND post_id = ?", (user_id, post_id))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="既にいいねしています")
    
    # いいねを追加
    cursor.execute("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", (user_id, post_id))
    
    # いいね数を更新
    cursor.execute("UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?", (post_id,))
    
    conn.commit()
    conn.close()
    
    return {"message": "いいねしました"}

@app.get("/stats")
async def get_stats():
    conn = sqlite3.connect('sns.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM users")
    users_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM posts")
    posts_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM likes")
    likes_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT AVG(conviction_score) FROM users")
    avg_conviction = cursor.fetchone()[0] or 0
    
    conn.close()
    
    return {
        "users_count": users_count,
        "posts_count": posts_count,
        "likes_count": likes_count,
        "average_conviction": round(avg_conviction, 2),
        "philosophy_engagement": "高い" if avg_conviction > 60 else "普通"
    }

if __name__ == "__main__":
    # データベース初期化
    init_db()
    print("🌟 Polyglot Philosophy SNS Service starting...")
    print("📊 Database initialized with sample data")
    print("🔗 Available at: http://localhost:8001")
    
    # サーバー起動
    uvicorn.run(app, host="0.0.0.0", port=8001)
