import joblib

model = joblib.load(open("model.pkl","rb"))

print("Weights:", model.coef_)
print("Bias:", model.intercept_)