#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = ""; //PUT WIFI NAME HERE
const char* password = ""; //PUT WIFI PASSWORD HERE

const char* serverName = ""; //PUT SERVER NAME HERE WHOEVER IS WATCHING

String latestInput = "";
unsigned long lastSend = 0;
int interval = 3000;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("wifi not connected");
  }
}

void loop() {

  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    if (input.startsWith("{") && input.endsWith("}")) {
      latestInput = input;
    }
  }

  if (millis() - lastSend > interval) {

    if (WiFi.status() == WL_CONNECTED) {

      HTTPClient http;
      http.begin(serverName);
      http.addHeader("Content-Type", "application/json");

      String json;

      if (latestInput != "") {
        json = latestInput;
      } else {
        json = "{\"ecg_value\":520,\"bpm\":75,\"spo2\":98}";
      }

      int httpResponseCode = http.POST(json);

      Serial.print("Sent: ");
      Serial.println(json);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.print("Response: ");
        Serial.println(response);
      } else {
        Serial.print("HTTP Error: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    }

    lastSend = millis();
  }
}