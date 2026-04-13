# 📡 IoT-Based Stress Detection System Using ECG, SpO2, and BPM

## 📌 Overview
This project implements a real-time stress detection system using physiological signals:
- ECG signal (via AD8232)
- Heart rate (BPM)
- Blood oxygen level (SpO2)

The system uses an ESP32 microcontroller to transmit sensor data to the cloud, where a machine learning model predicts whether a person is in a `normal` or `stressed` state.

## ⚙️ System Architecture
**Sensors → Arduino → ESP32 → AWS API → Lambda (ML Model) → Prediction → DynamoDB**

### Flow Explanation
1. Sensors collect physiological data
2. Arduino reads and formats the data
3. ESP32 sends data to AWS
4. AWS Lambda processes input
5. ML model predicts stress state
6. Result is stored and returned

## 🧠 Machine Learning Model
- **Algorithm:** Logistic Regression
- **Input Features:**
  - ECG value
  - BPM
  - SpO2
- **Output:**
  - `normal`
  - `stressed`

The model is deployed inside AWS Lambda using a lightweight pure Python implementation (no external dependencies).

## 🔌 Hardware Components

| Component | Purpose |
| --- | --- |
| **AD8232 ECG Sensor** | Measures heart electrical activity |
| **MAX30102** | Measures BPM and SpO2 |
| **Arduino** | Reads sensor data |
| **ESP32** | Sends data to cloud |
| **Electrodes** | Attach ECG sensor to body |

## 🔗 Pin Connections

### AD8232 → Arduino
| AD8232 | Arduino |
| --- | --- |
| 3.3V | 3.3V |
| GND | GND |
| OUTPUT | A0 |
| LO+ | D10 |
| LO- | D11 |

### MAX30102 → Arduino
| MAX30102 | Arduino |
| --- | --- |
| VCC | 3.3V |
| GND | GND |
| SDA | A4 |
| SCL | A5 |

### Arduino → ESP32 (Serial)
| Arduino | ESP32 |
| --- | --- |
| TX | RX (GPIO16) |
| GND | GND |

> ⚠️ **Use a voltage divider (5V → 3.3V)** for safe communication.

## ☁️ Cloud Setup (AWS)

### Services Used
- **API Gateway** – handles HTTP requests
- **Lambda** – runs ML model
- **DynamoDB** – stores predictions

### API Endpoint
`POST /predict`

### Expected Input Format
```json
{
  "ecg_value": 520,
  "bpm": 75,
  "spo2": 98
}
```

### Output Format
```json
{
  "prediction": "normal"
}
```

## 📡 ESP32 Functionality
The ESP32:
- Connects to WiFi
- Accepts input via Serial Monitor
- Sends data continuously to AWS
- Prints prediction results

## 🧪 Testing Without Hardware
You can test the system without sensors by sending data manually:

**Example Input**
```json
{
  "ecg_value": 1530,
  "bpm": 90,
  "spo2": 96
}
```

## 🛠️ Setup Instructions

### 1️⃣ Install Arduino IDE
Download and install Arduino IDE.

### 2️⃣ Install Required Libraries
- WiFi (built-in)
- HTTPClient (built-in)
- Wire
- MAX30105 library

### 3️⃣ Configure ESP32
- Select board: **ESP32 Dev Module**
- Set correct COM port

### 4️⃣ Update WiFi Credentials
In ESP32 code:
```cpp
const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
```

### 5️⃣ Update API Endpoint
```cpp
const char* serverName = "YOUR_AWS_ENDPOINT";
```

### 6️⃣ Upload Code
1. Connect ESP32
2. Upload code
3. Open Serial Monitor (115200 baud)

### 7️⃣ Test the System

#### Option 1: Automatic Mode
ESP32 sends default values continuously.

#### Option 2: Manual Mode
Send JSON from Serial Monitor:
```json
{"ecg_value":1700,"bpm":120,"spo2":94}
```

## ⚠️ Important Notes
- Ensure stable WiFi connection
- ECG signal requires proper electrode placement
- MAX30102 requires finger stability
- Noise in sensors may affect prediction

## 🚀 Future Improvements
- Real-time dashboard (React / Grafana)
- Mobile app integration
- Continuous ECG waveform analysis
- Advanced ML models (LSTM, Deep Learning)
- AWS IoT Core integration

## 📊 Applications
- Mental health monitoring
- Stress detection systems
- Wearable health devices
- Smart healthcare systems

## 🧾 Conclusion
This project demonstrates a complete IoT + Machine Learning pipeline:
- Real-time data acquisition
- Cloud-based prediction
- Scalable architecture

It is a practical implementation of smart healthcare monitoring systems using modern embedded and cloud technologies.