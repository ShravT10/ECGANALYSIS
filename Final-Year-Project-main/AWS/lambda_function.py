import json
import math

# Replace these with your actual values
w_adc = 0.02887732
w_pulse = 0.15880407
w_spo2 = -1.92051634
bias = 157.40830923

latest_prediction = "No Data"

def predict(adc, pulse, spo2):

    z = (w_adc * adc) + (w_pulse * pulse) + (w_spo2 * spo2) + bias
    prob = 1 / (1 + math.exp(-z))

    if prob > 0.5:
        return "stressed"
    else:
        return "normal"


def lambda_handler(event, context):

    global latest_prediction

    method = event["requestContext"]["http"]["method"]

    # -------- POST: Sensor sends data --------
    if method == "POST":

        body = json.loads(event["body"])

        adc = float(body["adc"])
        pulse = float(body["pulse"])
        spo2 = float(body["spo2"])

        latest_prediction = predict(adc, pulse, spo2)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Prediction updated",
                "prediction": latest_prediction
            })
        }

    # -------- GET: React fetches prediction --------
    elif method == "GET":

        return {
            "statusCode": 200,
            "body": json.dumps({
                "prediction": latest_prediction
            })
        }