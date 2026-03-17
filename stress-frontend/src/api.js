const API_URL = import.meta.env.VITE_API_URL;

/**
 * GETs the latest stress prediction from the AWS API Gateway.
 * Expected response shape: { adc: number, pulse: number, spo2: number, prediction: "stressed"|"normal" }
 */
export async function fetchPrediction() {
  if (!API_URL || API_URL.includes("YOUR_API_ID")) {
    throw new Error("API URL not configured. Please set VITE_API_URL in your .env file.");
  }

  const res = await fetch(API_URL, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`API returned ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  console.log("API Response:", data);

  // Handle both raw JSON body or AWS Gateway wrapped {"body": "..."}
  // If the data itself has "prediction", return it.
  if (data.prediction) {
    return data;
  }
  
  // If it's wrapped in a body string
  if (typeof data.body === "string") {
    try {
      const parsed = JSON.parse(data.body);
      console.log("Parsed Body:", parsed);
      return parsed;
    } catch (e) {
      console.error("Failed to parse response body string", e);
    }
  }
  
  return data;
}
