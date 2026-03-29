#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define SS_PIN D8
#define RST_PIN D3

#define LED_PIN D0
#define BUZZER_PIN D4

// LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);

// WiFi
const char *ssid = "OnePlus Nord CE 3 Lite 5G";
const char *password = "enter password";
const char *apiEndpoint = "http://10.196.76.82:5000/api/scan-rfid";
const char *deviceKey = "gauravthakur";

MFRC522 mfrc522(SS_PIN, RST_PIN);

// ===== UID FUNCTION =====
String uidToString(MFRC522::Uid *uid) {
  String uidString = "";
  for (byte i = 0; i < uid->size; i++) {
    if (uid->uidByte[i] < 0x10) uidString += "0";
    uidString += String(uid->uidByte[i], HEX);
  }
  uidString.toUpperCase();
  return uidString;
}

// ===== WIFI =====
void connectWiFi() {
  WiFi.begin(ssid, password);

  lcd.clear();
  lcd.print("Connecting WiFi");

  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.println(WiFi.localIP());

  lcd.clear();
  lcd.print("WiFi Connected");
  delay(1000);
}

// ===== FEEDBACK =====
void successFeedback() {
  analogWrite(LED_PIN, 100);
  tone(BUZZER_PIN, 1000, 150);
  delay(200);
  analogWrite(LED_PIN, 0);
}

void duplicateFeedback() {
  tone(BUZZER_PIN, 600, 300);
}

void errorFeedback() {
  tone(BUZZER_PIN, 200, 700);
}

// ===== SEND RFID =====
void sendRFID(String uid) {

  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  WiFiClient client;
  HTTPClient http;

  Serial.println("Sending request...");
  lcd.clear();
  lcd.print("Sending...");

  if (!http.begin(client, apiEndpoint)) {
    Serial.println("HTTP begin failed");
    lcd.clear();
    lcd.print("HTTP Failed");
    return;
  }

  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-key", deviceKey);

  String payload = "{\"rfid_uid\":\"" + uid + "\"}";

  int responseCode = http.POST(payload);

  Serial.print("Response Code: ");
  Serial.println(responseCode);

  if (responseCode > 0) {

    String response = http.getString();
    Serial.println(response);

    if (responseCode == 201) {
      lcd.clear();
      lcd.print("Attendance Done");
      successFeedback();
    }
    else if (responseCode == 200) {
      lcd.clear();
      lcd.print("Already Marked");
      duplicateFeedback();
    }
    else {
      lcd.clear();
      lcd.print("Error Occurred");
      errorFeedback();
    }

  } else {
    Serial.println("HTTP Error");
    lcd.clear();
    lcd.print("No Connection");
    errorFeedback();
  }

  delay(1500);

  lcd.clear();
  lcd.print("Scan RFID Card");

  http.end();
}

// ===== SETUP =====
void setup() {
  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  SPI.begin();
  mfrc522.PCD_Init();

  lcd.init();
  lcd.backlight();

  connectWiFi();

  lcd.clear();
  lcd.print("Scan RFID Card");
}

// ===== LOOP =====
void loop() {

  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  String uid = uidToString(&mfrc522.uid);

  Serial.print("Card UID: ");
  Serial.println(uid);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Card Detected");

  lcd.setCursor(0, 1);
  lcd.print(uid);

  delay(1500);

  sendRFID(uid);

  mfrc522.PICC_HaltA();
}