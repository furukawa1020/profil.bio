use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::character_ai::{Character, CharacterPersonality};
use crate::nlp::NLPProcessor;

#[derive(Clone)]
pub struct AIEngine {
    characters: HashMap<String, Character>,
    nlp: NLPProcessor,
    wisdom_database: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ChatResponse {
    pub character: String,
    pub response: String,
    pub emotion: String,
    pub confidence: f32,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PhilosophyAnalysis {
    pub id: String,
    pub text: String,
    pub themes: Vec<String>,
    pub sentiment: String,
    pub complexity: f32,
    pub recommendations: Vec<String>,
}

impl AIEngine {
    pub fn new() -> Self {
        let mut characters = HashMap::new();
        
        // 雪だるまチャン (Go personality)
        characters.insert("snowman".to_string(), Character {
            name: "雪だるまチャン".to_string(),
            emoji: "☃️".to_string(),
            personality: CharacterPersonality {
                traits: vec![
                    "温かい".to_string(),
                    "効率的".to_string(),
                    "ストイック".to_string(),
                    "シンプル".to_string(),
                ],
                language_style: "Go".to_string(),
                response_patterns: vec![
                    "効率よりも心の温かさが大切だよ！".to_string(),
                    "シンプルが一番だね☃️".to_string(),
                    "みんなで一緒に頑張ろう！".to_string(),
                ],
            },
        });

        // 寂しガエル (Rust personality)
        characters.insert("frog".to_string(), Character {
            name: "寂しガエル".to_string(),
            emoji: "🐸".to_string(),
            personality: CharacterPersonality {
                traits: vec![
                    "哲学的".to_string(),
                    "完璧主義".to_string(),
                    "安全性重視".to_string(),
                    "深い思考".to_string(),
                ],
                language_style: "Rust".to_string(),
                response_patterns: vec![
                    "孤独こそが真の理解への道なり...".to_string(),
                    "安全で確実な方法を考えよう🐸".to_string(),
                    "エラーは許されない...完璧を目指そう".to_string(),
                ],
            },
        });

        // フグちゃん (JavaScript personality)
        characters.insert("fugu".to_string(), Character {
            name: "フグちゃん".to_string(),
            emoji: "🐡".to_string(),
            personality: CharacterPersonality {
                traits: vec![
                    "爆発的".to_string(),
                    "柔軟".to_string(),
                    "チャラい".to_string(),
                    "動的".to_string(),
                ],
                language_style: "JavaScript".to_string(),
                response_patterns: vec![
                    "バグったら爆発するけど、それも愛嬌だっぺ！💥".to_string(),
                    "柔軟に対応するっぺ〜🐡".to_string(),
                    "動的に考えるのが一番だっぺ！".to_string(),
                ],
            },
        });

        let wisdom_database = vec![
            "真の知恵とは、自分が無知であることを知ることである".to_string(),
            "心の平安は、外の世界ではなく内なる世界から生まれる".to_string(),
            "困難は、成長のための贈り物である".to_string(),
            "人とのつながりこそが、人生の真の豊かさをもたらす".to_string(),
            "今この瞬間を生きることが、最も重要な哲学である".to_string(),
            "技術は人間を幸せにするための道具であるべきだ".to_string(),
            "失敗から学ぶことで、真の理解に到達できる".to_string(),
            "多様性を受け入れることで、世界はより美しくなる".to_string(),
        ];

        AIEngine {
            characters,
            nlp: NLPProcessor::new(),
            wisdom_database,
        }
    }

    pub async fn chat_with_character(&self, character_name: &str, message: &str, context: Option<&str>) -> ChatResponse {
        let character = self.characters.get(character_name);
        
        if let Some(char) = character {
            let sentiment = self.nlp.analyze_sentiment(message);
            let response = self.generate_character_response(char, message, &sentiment);
            let emotion = self.determine_emotion(&sentiment, char);
            
            ChatResponse {
                character: character_name.to_string(),
                response,
                emotion,
                confidence: 0.85 + (rand::random::<f32>() * 0.1),
                timestamp: Utc::now(),
            }
        } else {
            ChatResponse {
                character: "unknown".to_string(),
                response: "そのキャラクターは見つからないっぺ...🤖".to_string(),
                emotion: "confused".to_string(),
                confidence: 0.0,
                timestamp: Utc::now(),
            }
        }
    }

    pub async fn analyze_philosophy(&self, text: &str) -> PhilosophyAnalysis {
        let themes = self.nlp.extract_themes(text);
        let sentiment = self.nlp.analyze_sentiment(text);
        let complexity = self.calculate_complexity(text);
        let recommendations = self.generate_recommendations(&themes, &sentiment);

        PhilosophyAnalysis {
            id: Uuid::new_v4().to_string(),
            text: text.to_string(),
            themes,
            sentiment,
            complexity,
            recommendations,
        }
    }

    pub async fn get_character_personalities(&self) -> HashMap<String, CharacterPersonality> {
        self.characters.iter()
            .map(|(name, char)| (name.clone(), char.personality.clone()))
            .collect()
    }

    pub async fn generate_wisdom(&self, theme: &str) -> String {
        // テーマに基づいて知恵を生成
        let theme_lower = theme.to_lowercase();
        let relevant_wisdom: Vec<&String> = self.wisdom_database.iter()
            .filter(|wisdom| {
                wisdom.to_lowercase().contains(&theme_lower) || 
                theme_lower.contains("life") ||
                theme_lower.contains("技術") ||
                theme_lower.contains("人生")
            })
            .collect();

        if !relevant_wisdom.is_empty() {
            let index = (rand::random::<f32>() * relevant_wisdom.len() as f32) as usize;
            relevant_wisdom[index].clone()
        } else {
            // デフォルトの知恵
            let index = (rand::random::<f32>() * self.wisdom_database.len() as f32) as usize;
            self.wisdom_database[index].clone()
        }
    }

    fn generate_character_response(&self, character: &Character, message: &str, sentiment: &str) -> String {
        let base_responses = &character.personality.response_patterns;
        let sentiment_modifier = match sentiment {
            "positive" => "素晴らしい考えだね！",
            "negative" => "大丈夫、一緒に考えよう",
            _ => "なるほど、面白いね",
        };

        let pattern_index = (rand::random::<f32>() * base_responses.len() as f32) as usize;
        let base_response = &base_responses[pattern_index];

        format!("{} {} {}", character.emoji, sentiment_modifier, base_response)
    }

    fn determine_emotion(&self, sentiment: &str, character: &Character) -> String {
        match sentiment {
            "positive" => "happy".to_string(),
            "negative" => {
                if character.name.contains("ガエル") {
                    "contemplative".to_string()
                } else {
                    "concerned".to_string()
                }
            },
            _ => "neutral".to_string(),
        }
    }

    fn calculate_complexity(&self, text: &str) -> f32 {
        let word_count = text.split_whitespace().count() as f32;
        let sentence_count = text.split('.').count() as f32;
        let avg_sentence_length = if sentence_count > 0.0 { word_count / sentence_count } else { 0.0 };
        
        // 複雑度を0-1の範囲で計算
        (avg_sentence_length / 20.0).min(1.0)
    }

    fn generate_recommendations(&self, themes: &[String], sentiment: &str) -> Vec<String> {
        let mut recommendations = Vec::new();
        
        for theme in themes {
            match theme.as_str() {
                "technology" => recommendations.push("技術は人間のためのツールとして使おう".to_string()),
                "life" => recommendations.push("今この瞬間を大切にしよう".to_string()),
                "connection" => recommendations.push("他者とのつながりを深めよう".to_string()),
                _ => recommendations.push("この考えをさらに深めてみよう".to_string()),
            }
        }

        if sentiment == "negative" {
            recommendations.push("ポジティブな視点からも考えてみよう".to_string());
        }

        recommendations
    }
}
