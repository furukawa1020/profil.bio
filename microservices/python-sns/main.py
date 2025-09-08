from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional
import uuid
import json
import asyncio
import os
from collections import defaultdict

# Database setup - 環境変数から取得、ローカル開発用のデフォルト値も設定
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/philosophy_sns")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    display_name = Column(String)
    bio = Column(Text)
    avatar_url = Column(String)
    philosophy_level = Column(Integer, default=1)
    conviction_points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    posts = relationship("Post", back_populates="author")
    likes = relationship("Like", back_populates="user")
    comments = relationship("Comment", back_populates="author")

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text)
    title = Column(String)
    category = Column(String)  # philosophy, technology, life, humor
    author_id = Column(String, ForeignKey("users.id"))
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    conviction_meter = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    author = relationship("User", back_populates="posts")
    likes = relationship("Like", back_populates="post")
    comments = relationship("Comment", back_populates="post")

class Like(Base):
    __tablename__ = "likes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    post_id = Column(String, ForeignKey("posts.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text)
    author_id = Column(String, ForeignKey("users.id"))
    post_id = Column(String, ForeignKey("posts.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    author = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    type = Column(String)  # like, comment, conviction, level_up
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic models
class UserCreate(BaseModel):
    username: str
    display_name: str
    bio: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    username: str
    display_name: str
    bio: Optional[str]
    avatar_url: Optional[str]
    philosophy_level: int
    conviction_points: int
    created_at: datetime

class PostCreate(BaseModel):
    title: str
    content: str
    category: str

class PostResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    author: UserResponse
    likes_count: int
    comments_count: int
    conviction_meter: int
    created_at: datetime

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: str
    content: str
    author: UserResponse
    created_at: datetime

# FastAPI app
app = FastAPI(title="Philosophy SNS", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# WebSocket connections manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: dict = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.user_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket, user_id: str):
        self.active_connections.remove(websocket)
        if user_id in self.user_connections:
            del self.user_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.user_connections:
            websocket = self.user_connections[user_id]
            await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# Routes
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "philosophy-sns",
        "version": "1.0.0"
    }

@app.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    db_user = User(
        username=user.username,
        display_name=user.display_name,
        bio=user.bio,
        avatar_url=f"https://api.dicebear.com/7.x/personas/svg?seed={user.username}"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/feed", response_model=List[PostResponse])
async def get_feed(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    return posts

@app.post("/posts", response_model=PostResponse)
async def create_post(post: PostCreate, author_id: str, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(User).filter(User.id == author_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_post = Post(
        title=post.title,
        content=post.content,
        category=post.category,
        author_id=author_id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # Broadcast new post
    await manager.broadcast(json.dumps({
        "type": "new_post",
        "post_id": db_post.id,
        "author": user.display_name,
        "title": post.title
    }))
    
    return db_post

@app.post("/posts/{post_id}/like")
async def like_post(post_id: str, user_id: str, db: Session = Depends(get_db)):
    # Check if already liked
    existing_like = db.query(Like).filter(
        Like.post_id == post_id, 
        Like.user_id == user_id
    ).first()
    
    if existing_like:
        # Unlike
        db.delete(existing_like)
        db.query(Post).filter(Post.id == post_id).update(
            {"likes_count": Post.likes_count - 1}
        )
        action = "unliked"
    else:
        # Like
        new_like = Like(post_id=post_id, user_id=user_id)
        db.add(new_like)
        db.query(Post).filter(Post.id == post_id).update(
            {"likes_count": Post.likes_count + 1}
        )
        action = "liked"
    
    db.commit()
    
    return {"message": f"Post {action} successfully"}

@app.post("/posts/{post_id}/conviction")
async def add_conviction(post_id: str, user_id: str, db: Session = Depends(get_db)):
    # Increment conviction meter
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post.conviction_meter += 1
    
    # Award points to user and author
    user = db.query(User).filter(User.id == user_id).first()
    author = db.query(User).filter(User.id == post.author_id).first()
    
    if user:
        user.conviction_points += 1
    if author:
        author.conviction_points += 2
        
        # Check for level up
        new_level = author.conviction_points // 10 + 1
        if new_level > author.philosophy_level:
            author.philosophy_level = new_level
            
            # Create notification
            notification = Notification(
                user_id=author.id,
                title="🎉 レベルアップ！",
                message=f"哲学レベル {new_level} に到達しました！",
                type="level_up"
            )
            db.add(notification)
            
            # Send real-time notification
            await manager.send_personal_message(
                json.dumps({
                    "type": "level_up",
                    "new_level": new_level,
                    "message": f"哲学レベル {new_level} に到達！"
                }),
                author.id
            )
    
    db.commit()
    
    # Broadcast conviction update
    await manager.broadcast(json.dumps({
        "type": "conviction_update",
        "post_id": post_id,
        "new_count": post.conviction_meter
    }))
    
    return {
        "message": "Conviction added successfully",
        "new_conviction_count": post.conviction_meter
    }

@app.post("/posts/{post_id}/comments", response_model=CommentResponse)
async def create_comment(
    post_id: str, 
    comment: CommentCreate, 
    author_id: str, 
    db: Session = Depends(get_db)
):
    # Verify post exists
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_comment = Comment(
        content=comment.content,
        author_id=author_id,
        post_id=post_id
    )
    db.add(db_comment)
    
    # Update comment count
    post.comments_count += 1
    
    db.commit()
    db.refresh(db_comment)
    
    return db_comment

@app.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(post_id: str, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).all()
    return comments

@app.get("/users/{user_id}/notifications")
async def get_notifications(user_id: str, db: Session = Depends(get_db)):
    notifications = db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).limit(50).all()
    
    return notifications

@app.get("/trending")
async def get_trending_topics(db: Session = Depends(get_db)):
    # Get most liked posts in last 24 hours
    yesterday = datetime.utcnow() - timedelta(days=1)
    trending_posts = db.query(Post).filter(
        Post.created_at >= yesterday
    ).order_by(Post.likes_count.desc()).limit(10).all()
    
    # Extract trending categories
    categories = defaultdict(int)
    for post in trending_posts:
        categories[post.category] += 1
    
    return {
        "trending_posts": trending_posts,
        "trending_categories": dict(categories)
    }

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming WebSocket messages
            message_data = json.loads(data)
            
            if message_data.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

if __name__ == "__main__":
    import uvicorn
    Base.metadata.create_all(bind=engine)
    uvicorn.run(app, host="0.0.0.0", port=3002)
