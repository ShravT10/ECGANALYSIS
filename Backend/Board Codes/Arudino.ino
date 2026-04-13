#include <Wire.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"

MAX30105 particleSensor;

uint16_t irBuffer[100];
uint16_t redBuffer[100];

int32_t spo2;
int8_t validSPO2;
int32_t heartRate;
int8_t validHeartRate;

int ecgPin = A0;
int loPlus = 10;
int loMinus = 11;

void setup()
{
  Serial.begin(115200);
  Wire.begin();

  pinMode(loPlus, INPUT);
  pinMode(loMinus, INPUT);

  if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD))
  {
    while (1);
  }

  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeIR(0x0A);
}

void loop()
{
  for (byte i = 0; i < 100; i++)
  {
    while (!particleSensor.available())
      particleSensor.check();

    redBuffer[i] = (uint16_t)(particleSensor.getRed() & 0xFFFF);
    irBuffer[i] = (uint16_t)(particleSensor.getIR() & 0xFFFF);
    particleSensor.nextSample();
  }

  maxim_heart_rate_and_oxygen_saturation(irBuffer, 100, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

  int ecgRaw = analogRead(ecgPin);
  float ecgValue = ((float)ecgRaw / 1023.0) * 100.0;

  if (digitalRead(loPlus) == 1 || digitalRead(loMinus) == 1)
  {
    return;
  }

  Serial.print("{\"ecg_value\":");
  Serial.print((int)ecgValue);
  Serial.print(",\"bpm\":");
  Serial.print(heartRate);
  Serial.print(",\"spo2\":");
  Serial.print(spo2);
  Serial.println("}");

  delay(2000);
}