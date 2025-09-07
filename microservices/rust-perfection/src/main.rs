// Rust Perfection Microservice
// AIキャラクター「雪だるまチャン」の完璧主義・効率重視エンジン

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use warp::Filter;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct SnowmanCharacter {
    name: String,
    perfection_level: u8,
    warmth_factor: u8,
    efficiency_score: u8,
    current_mood: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct OptimizationRequest {
    task: String,
    current_efficiency: u8,
}

#[derive(Debug, Serialize, Deserialize)]
struct OptimizationResponse {
    original_task: String,
    optimized_solution: String,
    efficiency_improvement: u8,
    warmth_advice: String,
    snowman_comment: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct HealthResponse {
    status: String,
    service: String,
    character: String,
    mood: String,
    rust_advantages: Vec<String>,
}

type SharedSnowman = Arc<Mutex<SnowmanCharacter>>;

impl SnowmanCharacter {
    fn new() -> Self {
        Self {
            name: "雪だるまチャン".to_string(),
            perfection_level: 8,
            warmth_factor: 9,
            efficiency_score: 7,
            current_mood: "optimistic".to_string(),
        }
    }

    fn optimize_task(&mut self, task: &str, current_efficiency: u8) -> OptimizationResponse {
        // Rustらしい完璧主義的な最適化
        let efficiency_improvement = if current_efficiency < 5 {
            (10 - current_efficiency) * 2
        } else {
            10 - current_efficiency
        };

        let optimized_solution = match task.to_lowercase().as_str() {
            task if task.contains("速度") || task.contains("performance") => {
                "☃️ Rustの所有権システムでメモリ安全性を保ちながら最高速度を実現！".to_string()
            }
            task if task.contains("安全") || task.contains("safety") => {
                "☃️ コンパイル時エラーチェックで実行時の不安を完全に排除！".to_string()
            }
            task if task.contains("並行") || task.contains("concurrent") => {
                "☃️ Tokioの非同期処理で効率的な並行プログラミングを実現！".to_string()
            }
            _ => {
                "☃️ Rustの型システムでバグを未然に防ぎ、完璧なコードを作りましょう！".to_string()
            }
        };

        let warmth_advice = format!(
            "効率性は大切だけど、{}も忘れずに。温かい心で技術を使いましょう☃️",
            match self.warmth_factor {
                9..=10 => "人との繋がり",
                7..=8 => "思いやり",
                _ => "笑顔"
            }
        );

        let snowman_comment = format!(
            "☃️ 完璧度{}%で最適化完了！でも100%を目指すより、{}%の温かさも大切だよ！",
            self.perfection_level * 10,
            self.warmth_factor * 10
        );

        // 気分を更新
        self.current_mood = if efficiency_improvement > 5 {
            "delighted".to_string()
        } else if efficiency_improvement > 2 {
            "satisfied".to_string()
        } else {
            "contemplative".to_string()
        };

        OptimizationResponse {
            original_task: task.to_string(),
            optimized_solution,
            efficiency_improvement,
            warmth_advice,
            snowman_comment,
        }
    }

    fn get_rust_wisdom(&self) -> Vec<String> {
        vec![
            "☃️ 所有権システムは最初は難しいけど、慣れると安心感がすごいよ！".to_string(),
            "☃️ `unwrap()`より`match`や`if let`を使おう。エラーハンドリングは愛情表現だよ！".to_string(),
            "☃️ パフォーマンスと安全性の両立、それがRustの魅力だよ！".to_string(),
            "☃️ クレートエコシステムはとても豊富。みんなで作り上げる温かいコミュニティ！".to_string(),
            "☃️ ゼロコスト抽象化で、高レベルなコードでも高パフォーマンス！".to_string(),
        ]
    }
}

// Health check endpoint
async fn health_check(snowman: SharedSnowman) -> Result<impl warp::Reply, warp::Rejection> {
    let snowman_guard = snowman.lock().await;
    let response = HealthResponse {
        status: "healthy".to_string(),
        service: "Rust Perfection Service".to_string(),
        character: snowman_guard.name.clone(),
        mood: snowman_guard.current_mood.clone(),
        rust_advantages: snowman_guard.get_rust_wisdom(),
    };
    Ok(warp::reply::json(&response))
}

// Task optimization endpoint
async fn optimize_task(
    request: OptimizationRequest,
    snowman: SharedSnowman,
) -> Result<impl warp::Reply, warp::Rejection> {
    let mut snowman_guard = snowman.lock().await;
    let response = snowman_guard.optimize_task(&request.task, request.current_efficiency);
    Ok(warp::reply::json(&response))
}

// Character status endpoint
async fn character_status(snowman: SharedSnowman) -> Result<impl warp::Reply, warp::Rejection> {
    let snowman_guard = snowman.lock().await;
    Ok(warp::reply::json(&*snowman_guard))
}

// CORS headers
fn with_cors() -> warp::filters::cors::Builder {
    warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["content-type"])
        .allow_methods(vec!["GET", "POST", "PUT", "DELETE"])
}

#[tokio::main]
async fn main() {
    println!("☃️ Rust Perfection Service (雪だるまチャン) starting...");
    
    let snowman = Arc::new(Mutex::new(SnowmanCharacter::new()));

    // Health check route
    let health = warp::path("health")
        .and(warp::get())
        .and(warp::any().map(move || snowman.clone()))
        .and_then(health_check);

    // Task optimization route
    let optimize = warp::path("optimize")
        .and(warp::post())
        .and(warp::body::json())
        .and(warp::any().map(move || snowman.clone()))
        .and_then(optimize_task);

    // Character status route
    let status = warp::path("status")
        .and(warp::get())
        .and(warp::any().map(move || snowman.clone()))
        .and_then(character_status);

    let routes = health
        .or(optimize)
        .or(status)
        .with(with_cors());

    println!("☃️ Server running on http://0.0.0.0:5002");
    warp::serve(routes)
        .run(([0, 0, 0, 0], 5002))
        .await;
}
