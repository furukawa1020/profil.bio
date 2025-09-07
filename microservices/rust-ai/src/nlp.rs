use std::collections::HashMap;
use regex::Regex;

#[derive(Clone)]
pub struct NLPProcessor {
    sentiment_keywords: HashMap<String, Vec<String>>,
    theme_keywords: HashMap<String, Vec<String>>,
}

impl NLPProcessor {
    pub fn new() -> Self {
        let mut sentiment_keywords = HashMap::new();
        
        sentiment_keywords.insert("positive".to_string(), vec![
            "好き".to_string(), "素晴らしい".to_string(), "最高".to_string(),
            "楽しい".to_string(), "嬉しい".to_string(), "感動".to_string(),
            "幸せ".to_string(), "喜び".to_string(), "満足".to_string(),
            "愛".to_string(), "希望".to_string(), "成功".to_string(),
        ]);
        
        sentiment_keywords.insert("negative".to_string(), vec![
            "嫌い".to_string(), "悲しい".to_string(), "困った".to_string(),
            "問題".to_string(), "エラー".to_string(), "失敗".to_string(),
            "不安".to_string(), "心配".to_string(), "怒り".to_string(),
            "絶望".to_string(), "孤独".to_string(), "疲れ".to_string(),
        ]);

        let mut theme_keywords = HashMap::new();
        
        theme_keywords.insert("technology".to_string(), vec![
            "技術".to_string(), "AI".to_string(), "プログラミング".to_string(),
            "コンピュータ".to_string(), "ソフトウェア".to_string(), "アルゴリズム".to_string(),
            "データ".to_string(), "ネットワーク".to_string(), "システム".to_string(),
        ]);
        
        theme_keywords.insert("philosophy".to_string(), vec![
            "哲学".to_string(), "思想".to_string(), "存在".to_string(),
            "真理".to_string(), "知識".to_string(), "意味".to_string(),
            "価値".to_string(), "倫理".to_string(), "道徳".to_string(),
        ]);
        
        theme_keywords.insert("life".to_string(), vec![
            "人生".to_string(), "生きる".to_string(), "経験".to_string(),
            "成長".to_string(), "学び".to_string(), "変化".to_string(),
            "時間".to_string(), "未来".to_string(), "過去".to_string(),
        ]);
        
        theme_keywords.insert("connection".to_string(), vec![
            "人間関係".to_string(), "コミュニティ".to_string(), "友情".to_string(),
            "愛情".to_string(), "家族".to_string(), "社会".to_string(),
            "つながり".to_string(), "絆".to_string(), "協力".to_string(),
        ]);

        NLPProcessor {
            sentiment_keywords,
            theme_keywords,
        }
    }

    pub fn analyze_sentiment(&self, text: &str) -> String {
        let text_lower = text.to_lowercase();
        let mut positive_score = 0;
        let mut negative_score = 0;

        // ポジティブキーワードのカウント
        if let Some(positive_words) = self.sentiment_keywords.get("positive") {
            for word in positive_words {
                if text_lower.contains(&word.to_lowercase()) {
                    positive_score += 1;
                }
            }
        }

        // ネガティブキーワードのカウント
        if let Some(negative_words) = self.sentiment_keywords.get("negative") {
            for word in negative_words {
                if text_lower.contains(&word.to_lowercase()) {
                    negative_score += 1;
                }
            }
        }

        // 感嘆符や疑問符の影響
        let exclamation_count = text.chars().filter(|&c| c == '！' || c == '!').count();
        let question_count = text.chars().filter(|&c| c == '？' || c == '?').count();
        
        positive_score += exclamation_count;
        
        if positive_score > negative_score {
            "positive".to_string()
        } else if negative_score > positive_score {
            "negative".to_string()
        } else {
            "neutral".to_string()
        }
    }

    pub fn extract_themes(&self, text: &str) -> Vec<String> {
        let text_lower = text.to_lowercase();
        let mut themes = Vec::new();

        for (theme, keywords) in &self.theme_keywords {
            let mut theme_score = 0;
            for keyword in keywords {
                if text_lower.contains(&keyword.to_lowercase()) {
                    theme_score += 1;
                }
            }
            
            if theme_score > 0 {
                themes.push(theme.clone());
            }
        }

        // 専門的なキーワードの検出
        let tech_regex = Regex::new(r"(rust|go|javascript|python|haskell|programming|code)").unwrap();
        if tech_regex.is_match(&text_lower) && !themes.contains(&"technology".to_string()) {
            themes.push("technology".to_string());
        }

        // デフォルトテーマ
        if themes.is_empty() {
            themes.push("general".to_string());
        }

        themes
    }

    pub fn extract_keywords(&self, text: &str) -> Vec<String> {
        let text_lower = text.to_lowercase();
        let words: Vec<&str> = text_lower.split_whitespace().collect();
        let mut keywords = Vec::new();

        // 重要そうな単語を抽出（長さ3文字以上）
        for word in words {
            let clean_word = word.trim_matches(|c: char| !c.is_alphanumeric());
            if clean_word.len() >= 3 && !self.is_stop_word(clean_word) {
                keywords.push(clean_word.to_string());
            }
        }

        // 重複を除去
        keywords.sort();
        keywords.dedup();
        
        // 最大10個まで
        keywords.truncate(10);
        keywords
    }

    pub fn calculate_readability(&self, text: &str) -> f32 {
        let sentences = text.split('.').count() as f32;
        let words = text.split_whitespace().count() as f32;
        
        if sentences > 0.0 {
            let avg_sentence_length = words / sentences;
            // 読みやすさスコア（10-20語が理想的）
            let ideal_length = 15.0;
            let deviation = (avg_sentence_length - ideal_length).abs();
            (1.0 - (deviation / ideal_length)).max(0.0)
        } else {
            0.0
        }
    }

    fn is_stop_word(&self, word: &str) -> bool {
        let stop_words = [
            "の", "は", "が", "を", "に", "で", "と", "から", "まで",
            "です", "である", "ます", "した", "する", "される",
            "この", "その", "あの", "どの", "これ", "それ", "あれ", "どれ",
            "the", "is", "at", "which", "on", "and", "a", "an", "as", "are",
            "was", "were", "been", "be", "have", "has", "had", "do", "does", "did",
        ];
        
        stop_words.contains(&word)
    }
}
