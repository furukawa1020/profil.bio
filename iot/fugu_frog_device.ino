/*
 * ESP32/M5Stack用 フグ・カエルデバイス制御コード
 * 納得メーターや記事に反応してLED/音で表現
 */

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <FastLED.h>

// WiFi設定
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// WebSocket設定
const char* websocket_server = "192.168.1.100"; // Philosophy PlaygroundサーバーIP
const int websocket_port = 8080;

// LED設定
#define NUM_LEDS 16
#define DATA_PIN 5
CRGB leds[NUM_LEDS];

// ブザー設定
#define BUZZER_PIN 25

// デバイスタイプ (FUGU or FROG)
#define DEVICE_TYPE "FUGU"

WebSocketsClient webSocket;

void setup() {
  Serial.begin(115200);
  
  // LED初期化
  FastLED.addLeds<WS2812, DATA_PIN, GRB>(leds, NUM_LEDS);
  
  // ブザー初期化
  pinMode(BUZZER_PIN, OUTPUT);
  
  // WiFi接続
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("WiFi接続中...");
  }
  Serial.println("WiFi接続成功!");
  
  // WebSocket接続
  webSocket.begin(websocket_server, websocket_port, "/ws");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
  
  // 起動時フグ爆発エフェクト
  if (String(DEVICE_TYPE) == "FUGU") {
    fuguExplosion();
  } else {
    frogContemplation();
  }
}

void loop() {
  webSocket.loop();
  
  // 定期的なハートビート
  static unsigned long lastHeartbeat = 0;
  if (millis() - lastHeartbeat > 30000) {
    sendHeartbeat();
    lastHeartbeat = millis();
  }
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket切断");
      showDisconnectedState();
      break;
      
    case WStype_CONNECTED:
      Serial.println("WebSocket接続成功");
      showConnectedState();
      registerDevice();
      break;
      
    case WStype_TEXT:
      handleMessage((char*)payload);
      break;
  }
}

void handleMessage(const char* message) {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, message);
  
  String type = doc["type"];
  
  if (type == "conviction_update") {
    int count = doc["count"];
    bool lightEffect = doc["light_effect"];
    
    if (String(DEVICE_TYPE) == "FUGU") {
      fuguConvictionReaction(count, lightEffect);
    } else {
      frogConvictionReaction(count, lightEffect);
    }
  }
  else if (type == "new_post") {
    String category = doc["category"];
    
    if (category == "humor" && String(DEVICE_TYPE) == "FUGU") {
      fuguHumorReaction();
    } else if (category == "philosophy" && String(DEVICE_TYPE) == "FROG") {
      frogPhilosophyReaction();
    }
  }
  else if (type == "character_interaction") {
    String character = doc["character"];
    
    if ((character == "fugu" && String(DEVICE_TYPE) == "FUGU") ||
        (character == "frog" && String(DEVICE_TYPE) == "FROG")) {
      characterSpecificReaction();
    }
  }
}

// フグ専用エフェクト
void fuguExplosion() {
  // 爆発的な光とサウンド
  for (int i = 0; i < 3; i++) {
    fill_solid(leds, NUM_LEDS, CRGB::Red);
    FastLED.show();
    tone(BUZZER_PIN, 1000, 200);
    delay(200);
    
    fill_solid(leds, NUM_LEDS, CRGB::Orange);
    FastLED.show();
    tone(BUZZER_PIN, 1500, 200);
    delay(200);
    
    fill_solid(leds, NUM_LEDS, CRGB::Yellow);
    FastLED.show();
    delay(200);
  }
  clearLeds();
}

void fuguConvictionReaction(int count, bool lightEffect) {
  if (lightEffect) {
    fuguExplosion();
  } else {
    // 小さな光る反応
    fill_solid(leds, NUM_LEDS, CRGB::Yellow);
    FastLED.show();
    tone(BUZZER_PIN, 800, 100);
    delay(500);
    clearLeds();
  }
}

void fuguHumorReaction() {
  // ユーモラスな色の変化
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CHSV(random(255), 255, 255);
    FastLED.show();
    tone(BUZZER_PIN, 500 + i * 100, 50);
    delay(100);
  }
  delay(1000);
  clearLeds();
}

// カエル専用エフェクト
void frogContemplation() {
  // 瞑想的な緑の波
  for (int brightness = 0; brightness < 255; brightness += 5) {
    fill_solid(leds, NUM_LEDS, CHSV(96, 255, brightness));
    FastLED.show();
    delay(20);
  }
  for (int brightness = 255; brightness > 0; brightness -= 5) {
    fill_solid(leds, NUM_LEDS, CHSV(96, 255, brightness));
    FastLED.show();
    delay(20);
  }
  clearLeds();
}

void frogConvictionReaction(int count, bool lightEffect) {
  if (lightEffect) {
    // 深い瞑想状態
    frogContemplation();
  } else {
    // 静かな同意
    fill_solid(leds, NUM_LEDS, CRGB::DarkGreen);
    FastLED.show();
    delay(1000);
    clearLeds();
  }
}

void frogPhilosophyReaction() {
  // 哲学的思考の波
  for (int wave = 0; wave < 3; wave++) {
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CHSV(96 + wave * 20, 255, 128);
      FastLED.show();
      delay(100);
      leds[i] = CRGB::Black;
    }
  }
}

void characterSpecificReaction() {
  if (String(DEVICE_TYPE) == "FUGU") {
    fuguExplosion();
  } else {
    frogContemplation();
  }
}

// 共通機能
void showConnectedState() {
  fill_solid(leds, NUM_LEDS, CRGB::Blue);
  FastLED.show();
  delay(1000);
  clearLeds();
}

void showDisconnectedState() {
  fill_solid(leds, NUM_LEDS, CRGB::Red);
  FastLED.show();
  delay(500);
  clearLeds();
}

void clearLeds() {
  fill_solid(leds, NUM_LEDS, CRGB::Black);
  FastLED.show();
}

void registerDevice() {
  DynamicJsonDocument doc(512);
  doc["type"] = "iot_register";
  doc["device_type"] = DEVICE_TYPE;
  doc["device_id"] = WiFi.macAddress();
  doc["capabilities"] = JsonArray();
  doc["capabilities"].add("led");
  doc["capabilities"].add("buzzer");
  doc["capabilities"].add("conviction_reaction");
  
  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
}

void sendHeartbeat() {
  DynamicJsonDocument doc(256);
  doc["type"] = "iot_heartbeat";
  doc["device_type"] = DEVICE_TYPE;
  doc["timestamp"] = millis();
  
  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
}
