# Python Wisdom Microservice
# AIキャラクター「寂しガエル」の哲学的思考エンジン

from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import threading
import time

app = Flask(__name__)
CORS(app)

class PhilosophicalFrog:
    def __init__(self):
        self.loneliness_level = 5
        self.wisdom_quotes = [
            "🐸 孤独は人を強くする...でも時には誰かと話したいカエル",
            "🐸 真理は静寂の中にある。騒がしい世界では見つからないカエル",
            "🐸 一人の時間こそ、自分と向き合える貴重な時間カエル",
            "🐸 寂しさは創造性の源。多くの芸術が孤独から生まれるカエル",
            "🐸 効率より情緒、速度より深度が大切カエル"
        ]
    
    def contemplate(self, topic):
        """哲学的思考を実行"""
        thinking_time = random.uniform(1, 3)
        time.sleep(thinking_time)
        
        philosophical_response = {
            "topic": topic,
            "wisdom": random.choice(self.wisdom_quotes),
            "depth_level": random.randint(1, 10),
            "loneliness_factor": self.loneliness_level,
            "contemplation_time": f"{thinking_time:.2f}秒",
            "mood": "contemplative" if self.loneliness_level > 3 else "cheerful"
        }
        
        return philosophical_response
    
    def parallel_thinking(self, topics):
        """複数のトピックを並列思考"""
        results = []
        threads = []
        
        def think_about_topic(topic):
            result = self.contemplate(topic)
            results.append(result)
        
        for topic in topics:
            thread = threading.Thread(target=think_about_topic, args=(topic,))
            threads.append(thread)
            thread.start()
        
        for thread in threads:
            thread.join()
        
        return results

frog = PhilosophicalFrog()

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "service": "Python Wisdom Service",
        "character": "寂しガエル 🐸",
        "mood": "philosophical"
    })

@app.route('/wisdom/<topic>')
def get_wisdom(topic):
    wisdom = frog.contemplate(topic)
    return jsonify({
        "service": "python-wisdom",
        "character": "寂しガエル",
        "wisdom": wisdom
    })

@app.route('/parallel-thinking', methods=['POST'])
def parallel_thinking():
    data = request.get_json()
    topics = data.get('topics', ['人生', '愛', '真理'])
    
    results = frog.parallel_thinking(topics)
    
    return jsonify({
        "service": "python-wisdom",
        "character": "寂しガエル",
        "parallel_thoughts": results,
        "message": "複数の哲学的思考を並列実行したカエル"
    })

@app.route('/loneliness-level', methods=['POST'])
def update_loneliness():
    data = request.get_json()
    new_level = data.get('level', 5)
    frog.loneliness_level = max(1, min(10, new_level))
    
    return jsonify({
        "loneliness_level": frog.loneliness_level,
        "message": f"寂しさレベルを{frog.loneliness_level}に設定したカエル"
    })

@app.route('/mood-based-response')
def mood_based_response():
    if frog.loneliness_level > 7:
        response = "🐸 今日はとても寂しいカエル...でも、この感情も大切な体験カエル"
    elif frog.loneliness_level > 4:
        response = "🐸 ほどよい孤独感。思考が深まる時間カエル"
    else:
        response = "🐸 今日は珍しく社交的な気分カエル！みんなと話したいカエル"
    
    return jsonify({
        "character": "寂しガエル",
        "mood_response": response,
        "loneliness_level": frog.loneliness_level
    })

if __name__ == '__main__':
    print("🐸 Python Wisdom Service (寂しガエル) starting...")
    app.run(host='0.0.0.0', port=5001, debug=True)
