-- PostgreSQL スキーマ設定
-- 哲学プラットフォーム用データベース

-- データベース作成
CREATE DATABASE polyglot_philosophy;

-- 使用開始
\c polyglot_philosophy;

-- ユーザー管理テーブル
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    conviction_level INTEGER DEFAULT 0,
    philosophy_points INTEGER DEFAULT 0,
    favorite_language VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 投稿管理テーブル
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    content TEXT NOT NULL,
    post_type VARCHAR(20) DEFAULT 'text', -- text, image, code, philosophy
    language VARCHAR(20),
    conviction_level INTEGER,
    tags TEXT[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT true
);

-- コメント管理テーブル
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    conviction_level INTEGER,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- いいね管理テーブル
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL, -- post, comment
    target_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

-- AI会話履歴テーブル
CREATE TABLE ai_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    character_id VARCHAR(20) NOT NULL, -- snowman, frog, fugu
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    conviction_level INTEGER,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 哲学記事テーブル
CREATE TABLE philosophy_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    topic VARCHAR(100),
    language VARCHAR(20),
    difficulty VARCHAR(20), -- beginner, intermediate, advanced
    estimated_time VARCHAR(20),
    conversation_data JSONB, -- AI会話データ
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT true
);

-- 言語統計テーブル
CREATE TABLE language_stats (
    id SERIAL PRIMARY KEY,
    language VARCHAR(20) NOT NULL,
    total_posts INTEGER DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    avg_conviction DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 宇宙惑星データテーブル
CREATE TABLE universe_planets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    language VARCHAR(20) NOT NULL,
    position_x DECIMAL(10,2),
    position_y DECIMAL(10,2), 
    position_z DECIMAL(10,2),
    article_count INTEGER DEFAULT 0,
    conviction_level DECIMAL(5,2) DEFAULT 0,
    color VARCHAR(7), -- hex color
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IoTデバイス履歴テーブル
CREATE TABLE iot_interactions (
    id SERIAL PRIMARY KEY,
    device_type VARCHAR(20), -- fugu, frog, snowman
    interaction_type VARCHAR(50), -- explosion, contemplation, encouragement
    user_id INTEGER REFERENCES users(id),
    conviction_level INTEGER,
    sensor_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_language ON posts(language);
CREATE INDEX idx_posts_conviction ON posts(conviction_level);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

CREATE INDEX idx_likes_user_target ON likes(user_id, target_type, target_id);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_character ON ai_conversations(character_id);
CREATE INDEX idx_ai_conversations_session ON ai_conversations(session_id);

CREATE INDEX idx_philosophy_articles_language ON philosophy_articles(language);
CREATE INDEX idx_philosophy_articles_difficulty ON philosophy_articles(difficulty);

-- 初期データの挿入
INSERT INTO universe_planets (name, language, position_x, position_y, position_z, color) VALUES
('Go Planet', 'Go', 80, 0, 0, '#00ADD8'),
('Rust World', 'Rust', -80, 50, 0, '#DE3F24'),
('Python Sphere', 'Python', 0, -80, 60, '#3776AB'),
('JavaScript Galaxy', 'JavaScript', -60, 0, -80, '#F7DF1E'),
('Haskell Haven', 'Haskell', 60, 80, 40, '#5D4F85'),
('Philosophy Core', 'Philosophy', 0, 0, 0, '#9C27B0');

INSERT INTO language_stats (language, total_posts, total_users, avg_conviction) VALUES
('Go', 0, 0, 0),
('Rust', 0, 0, 0),
('Python', 0, 0, 0),
('JavaScript', 0, 0, 0),
('Haskell', 0, 0, 0),
('Philosophy', 0, 0, 0);

-- サンプル哲学記事
INSERT INTO philosophy_articles (title, topic, language, difficulty, estimated_time, conversation_data) VALUES
('Goの並行性と哲学', '非同期プログラミング', 'Go', 'intermediate', '10-15分', '{"messages": []}'),
('Rustの所有権モデルと存在論', 'メモリ管理', 'Rust', 'advanced', '15-20分', '{"messages": []}'),
('Pythonの禅と東洋哲学', 'プログラミング哲学', 'Python', 'beginner', '5-10分', '{"messages": []}'),
('JavaScriptの非同期と時間哲学', '非同期プログラミング', 'JavaScript', 'intermediate', '10-15分', '{"messages": []}'),
('Haskellの純粋性と倫理学', '関数型プログラミング', 'Haskell', 'advanced', '20-25分', '{"messages": []}');

-- ビュー作成（統計用）
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.conviction_level,
    u.philosophy_points,
    COUNT(p.id) as post_count,
    AVG(p.conviction_level) as avg_post_conviction,
    u.created_at
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.username, u.conviction_level, u.philosophy_points, u.created_at;

CREATE VIEW popular_posts AS
SELECT 
    p.*,
    u.username,
    u.display_name
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.is_published = true
ORDER BY p.likes_count DESC, p.created_at DESC;

-- 関数: 確信度レベル更新
CREATE OR REPLACE FUNCTION update_conviction_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- ユーザーの平均確信度を更新
    UPDATE users 
    SET conviction_level = (
        SELECT COALESCE(AVG(conviction_level), 0)
        FROM posts 
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    
    -- 言語統計を更新
    UPDATE language_stats
    SET 
        total_posts = (SELECT COUNT(*) FROM posts WHERE language = NEW.language),
        avg_conviction = (SELECT COALESCE(AVG(conviction_level), 0) FROM posts WHERE language = NEW.language)
    WHERE language = NEW.language;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガー設定
CREATE TRIGGER conviction_update_trigger
    AFTER INSERT OR UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_conviction_stats();
