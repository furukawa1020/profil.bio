use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Character {
    pub name: String,
    pub emoji: String,
    pub personality: CharacterPersonality,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CharacterPersonality {
    pub traits: Vec<String>,
    pub language_style: String,
    pub response_patterns: Vec<String>,
}

impl Character {
    pub fn new(name: &str, emoji: &str, language_style: &str) -> Self {
        let personality = match language_style {
            "Go" => CharacterPersonality {
                traits: vec![
                    "効率的".to_string(),
                    "シンプル".to_string(),
                    "並行処理好き".to_string(),
                    "実用的".to_string(),
                ],
                language_style: language_style.to_string(),
                response_patterns: vec![
                    "シンプルに考えよう！".to_string(),
                    "並行して処理すれば効率的だね".to_string(),
                    "実用性を重視しよう".to_string(),
                ],
            },
            "Rust" => CharacterPersonality {
                traits: vec![
                    "安全性重視".to_string(),
                    "完璧主義".to_string(),
                    "メモリ効率".to_string(),
                    "ゼロコスト抽象化".to_string(),
                ],
                language_style: language_style.to_string(),
                response_patterns: vec![
                    "安全第一で行こう".to_string(),
                    "メモリリークは許さない".to_string(),
                    "コンパイル時にエラーを捕まえよう".to_string(),
                ],
            },
            "JavaScript" => CharacterPersonality {
                traits: vec![
                    "柔軟".to_string(),
                    "動的".to_string(),
                    "プロトタイプベース".to_string(),
                    "イベント駆動".to_string(),
                ],
                language_style: language_style.to_string(),
                response_patterns: vec![
                    "柔軟に対応しよう！".to_string(),
                    "イベントで繋がろう".to_string(),
                    "動的に変化しよう".to_string(),
                ],
            },
            "Python" => CharacterPersonality {
                traits: vec![
                    "読みやすい".to_string(),
                    "多目的".to_string(),
                    "ライブラリ豊富".to_string(),
                    "AI・データサイエンス".to_string(),
                ],
                language_style: language_style.to_string(),
                response_patterns: vec![
                    "シンプルでエレガントに".to_string(),
                    "ライブラリを活用しよう".to_string(),
                    "データから学ぼう".to_string(),
                ],
            },
            "Haskell" => CharacterPersonality {
                traits: vec![
                    "純粋関数型".to_string(),
                    "遅延評価".to_string(),
                    "型安全".to_string(),
                    "数学的".to_string(),
                ],
                language_style: language_style.to_string(),
                response_patterns: vec![
                    "純粋に考えよう".to_string(),
                    "型が教えてくれる".to_string(),
                    "数学的に美しく".to_string(),
                ],
            },
            _ => CharacterPersonality {
                traits: vec!["汎用的".to_string()],
                language_style: language_style.to_string(),
                response_patterns: vec!["一緒に考えよう".to_string()],
            },
        };

        Character {
            name: name.to_string(),
            emoji: emoji.to_string(),
            personality,
        }
    }

    pub fn respond_to(&self, message: &str, context: Option<&str>) -> String {
        let sentiment = self.analyze_message_sentiment(message);
        let response_base = self.select_response_pattern(&sentiment);
        
        format!("{} {}", self.emoji, response_base)
    }

    fn analyze_message_sentiment(&self, message: &str) -> String {
        let positive_words = ["好き", "素晴らしい", "最高", "楽しい", "嬉しい", "感動"];
        let negative_words = ["嫌い", "悲しい", "困った", "問題", "エラー", "失敗"];
        
        let message_lower = message.to_lowercase();
        
        let positive_count = positive_words.iter()
            .filter(|word| message_lower.contains(&word.to_lowercase()))
            .count();
            
        let negative_count = negative_words.iter()
            .filter(|word| message_lower.contains(&word.to_lowercase()))
            .count();
            
        if positive_count > negative_count {
            "positive".to_string()
        } else if negative_count > positive_count {
            "negative".to_string()
        } else {
            "neutral".to_string()
        }
    }

    fn select_response_pattern(&self, sentiment: &str) -> String {
        let patterns = &self.personality.response_patterns;
        let index = match sentiment {
            "positive" => 0.min(patterns.len() - 1),
            "negative" => (patterns.len() / 2).min(patterns.len() - 1),
            _ => (patterns.len() - 1).min(patterns.len() - 1),
        };
        
        patterns.get(index).unwrap_or(&"一緒に考えよう".to_string()).clone()
    }
}
