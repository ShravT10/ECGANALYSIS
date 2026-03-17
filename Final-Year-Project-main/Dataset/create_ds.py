import numpy as np
import pandas as pd

np.random.seed(42)
n = 200

data = []

for i in range(n):
    # Decide if this row will be normal (0) or abnormal (1)
    y = np.random.choice([0, 1], p=[0.7, 0.3])  # 70% normal, 30% abnormal

    if y == 0:
        # Normal vitals
        temp = np.random.uniform(36.5, 37.2)
        pulse = np.random.uniform(65, 90)
        spo2 = np.random.uniform(96, 100)
    else:
        # Abnormal vitals: randomly choose which parameter(s) to push out of range
        temp = np.random.uniform(36.5, 37.2)
        pulse = np.random.uniform(65, 90)
        spo2 = np.random.uniform(96, 100)

        choice = np.random.choice(["temp", "pulse", "spo2", "multi"])

        if choice in ["temp", "multi"]:
            temp = np.random.choice([
                np.random.uniform(35.0, 36.0),    # low temp
                np.random.uniform(38.0, 40.0)     # fever
            ])
        if choice in ["pulse", "multi"]:
            pulse = np.random.choice([
                np.random.uniform(40, 50),        # bradycardia
                np.random.uniform(110, 140)       # tachycardia
            ])
        if choice in ["spo2", "multi"]:
            spo2 = np.random.uniform(80, 93)      # hypoxia

    # ECG feature: correlated with pulse plus some noise
    ecg = pulse + np.random.normal(0, 3)

    data.append([ecg, temp, spo2, pulse, y])

df = pd.DataFrame(data, columns=["ECG_value", "Temperature_C", "SpO2", "Pulse_bpm", "Label"])
print(df.head())
# df.to_csv("vitals_dataset.csv", index=False)
