#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN D8
#define RST_PIN D3

const char *ssid = "OnePlus Nord CE 3 Lite 5G";
const char *password = "enter password";
// const char *apiEndpoint = "http://192.168.1.5:5000/api/scan-rfid";
const char *apiEndpoint = "http://10.196.76.82:5000/api/scan-rfid";
const char *deviceKey = "gauravthakur";

MFRC522 mfrc522(SS_PIN, RST_PIN);

String uidToString(MFRC522::Uid *uid) {
  String uidString = "";
  for (byte i = 0; i < uid->size; i++) {
    if (uid->uidByte[i] < 0x10) uidString += "0";
    uidString += String(uid->uidByte[i], HEX);
  }
  uidString.toUpperCase();
  return uidString;
}

void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("NodeMCU IP: ");
  Serial.println(WiFi.localIP());
}

void sendRFID(String uid) {

  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  WiFiClient client;   // ✅ HTTP के लिए यही सही है
  client.setTimeout(10000);

  HTTPClient http;

  Serial.println("Sending request to:");
  Serial.println(apiEndpoint);

  if (!http.begin(client, apiEndpoint)) {
    Serial.println("HTTP begin failed");
    return;
  }

  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-key", deviceKey);

  String payload = "{\"rfid_uid\":\"" + uid + "\"}";

  Serial.print("Payload: ");
  Serial.println(payload);

  int responseCode = http.POST(payload);

  Serial.print("Response Code: ");
  Serial.println(responseCode);

  if (responseCode > 0) {
    String response = http.getString();
    Serial.println("Server Response:");
    Serial.println(response);
  } else {
    Serial.print("HTTP Error: ");
    Serial.println(http.errorToString(responseCode));
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();

  connectWiFi();
  Serial.println("Scan RFID...");
}

void loop() {

  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  String uid = uidToString(&mfrc522.uid);

  Serial.print("Card UID: ");
  Serial.println(uid);

  sendRFID(uid);

  delay(2000);

  mfrc522.PICC_HaltA();
}