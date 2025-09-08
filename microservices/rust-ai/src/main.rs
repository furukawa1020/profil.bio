use warp::Filter;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;
use chrono::{DateTime, Utc};

mod ai_engine;
mod character_ai;
mod nlp;

use ai_engine::AIEngine;
use character_ai::{Character, CharacterPersonality};

#[derive(Debug, Serialize, Deserialize)]
struct ChatRequest {
    character: String,
    message: String,
    context: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChatResponse {
    character: String,
    response: String,
    emotion: String,
    confidence: f32,
    timestamp: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
struct PhilosophyAnalysis {
    id: String,
    text: String,
    themes: Vec<String>,
    sentiment: String,
    complexity: f32,
    recommendations: Vec<String>,
}

#[tokio::main]
async fn main() {
    println!("🦀 Philosophy AI Server starting...");

    // Initialize AI engine
    let ai_engine = AIEngine::new();
    let ai_filter = warp::any().map(move || ai_engine.clone());

    // CORS
    let cors = warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["content-type"])
        .allow_methods(vec!["GET", "POST", "OPTIONS"]);

    // Health check
    let health = warp::path("health")
        .and(warp::get())
        .map(|| {
            warp::reply::json(&serde_json::json!({
                "status": "healthy",
                "service": "philosophy-ai",
                "version": "0.1.0"
            }))
        });

    // Character chat endpoint
    let chat = warp::path("chat")
        .and(warp::post())
        .and(warp::body::json())
        .and(ai_filter.clone())
        .and_then(handle_chat);

    // Philosophy analysis
    let analyze = warp::path("analyze")
        .and(warp::post())
        .and(warp::body::json())
        .and(ai_filter.clone())
        .and_then(handle_analysis);

    // Character personalities
    let personalities = warp::path("personalities")
        .and(warp::get())
        .and(ai_filter.clone())
        .and_then(get_personalities);

    // Wisdom generation
    let wisdom = warp::path("wisdom")
        .and(warp::get())
        .and(warp::query())
        .and(ai_filter.clone())
        .and_then(generate_wisdom);

    let routes = health
        .or(chat)
        .or(analyze)
        .or(personalities)
        .or(wisdom)
        .with(cors);

    // Get port from environment variable
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "3001".to_string())
        .parse()
        .unwrap_or(3001);

    println!("🚀 AI Server running on http://0.0.0.0:{}", port);
    warp::serve(routes)
        .run(([0, 0, 0, 0], port))
        .await;
}

async fn handle_chat(request: ChatRequest, ai_engine: AIEngine) -> Result<impl warp::Reply, warp::Rejection> {
    println!("Chat request: {:?}", request);
    
    let response = ai_engine.chat_with_character(&request.character, &request.message, request.context.as_deref()).await;
    
    Ok(warp::reply::json(&response))
}

async fn handle_analysis(request: serde_json::Value, ai_engine: AIEngine) -> Result<impl warp::Reply, warp::Rejection> {
    let text = request["text"].as_str().unwrap_or("");
    let analysis = ai_engine.analyze_philosophy(text).await;
    
    Ok(warp::reply::json(&analysis))
}

async fn get_personalities(ai_engine: AIEngine) -> Result<impl warp::Reply, warp::Rejection> {
    let personalities = ai_engine.get_character_personalities().await;
    Ok(warp::reply::json(&personalities))
}

async fn generate_wisdom(params: HashMap<String, String>, ai_engine: AIEngine) -> Result<impl warp::Reply, warp::Rejection> {
    let theme = params.get("theme").unwrap_or(&"life".to_string()).clone();
    let wisdom = ai_engine.generate_wisdom(&theme).await;
    
    Ok(warp::reply::json(&serde_json::json!({
        "theme": theme,
        "wisdom": wisdom,
        "timestamp": Utc::now()
    })))
}
