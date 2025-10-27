# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import base64
import json
import os
import re
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = FastAPI(title="EcoCycle AI Backend")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")

client = Groq(api_key=GROQ_API_KEY)

# REAL VISION MODEL (WORKS WITH IMAGES)
VISION_MODELS = ["llava-v1.5-7b-4096-preview"]

# PRICING (₦ per kg)
PRICING = {
    "Plastic": 30,
    "Paper": 10,
    "Metal": 50,
    "Glass": 20,
    "Organic": 0,
    "Other": 0
}

def encode_image(image_bytes):
    return base64.b64encode(image_bytes).decode('utf-8')

def get_prompt():
    return """You are a waste expert. Classify the image into:
Plastic, Paper, Metal, Glass, Organic, Other

Return ONLY JSON:
{
  "class": "Plastic",
  "confidence": 0.95,
  "reasoning": "Clear plastic bottle with label"
}
"""

def parse_response(text):
    try:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            data = json.loads(match.group())
            cls = data.get("class", "Other").title()
            conf = float(data.get("confidence", 0.5))
            reason = data.getnul("reasoning", "")
            return cls, conf, reason
        # Fallback
        text_lower = text.lower()
        for cat in ["plastic", "paper", "metal", "glass", "organic"]:
            if cat in text_lower:
                return cat.title(), 0.7, f"Detected {cat}"
        return "Other", 0.5, "Unclear"
    except:
        return "Other", 0.3, "Parse failed"

@app.post("/classify")
async def classify(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Must be an image")

    try:
        image_bytes = await file.read()
        base64_img = encode_image(image_bytes)

        response = client.chat.completions.create(
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": get_prompt()},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_img}"}}
                ]
            }],
            model=VISION_MODELS[0],
            temperature=0.1,
            max_tokens=300
        )

        text = response.choices[0].message.content
        cls, conf, reason = parse_response(text)
        price = PRICING.get(cls, 0)
        recyclable = price > 0

        return {
            "class": cls if recyclable else "Non-recyclable",
            "confidence": round(conf, 2),
            "recyclable": recyclable,
            "price_per_kg": price,
            "debug": {"reasoning": reason, "model": VISION_MODELS[0]}
        }

    except Exception as e:
        raise HTTPException(500, f"AI Error: {str(e)}")

@app.get("/")
def home():
    return {"status": "EcoCycle Backend LIVE", "endpoints": ["/classify", "/test"]}

@app.get("/test")
def test():
    try:
        res = client.chat.completions.create(
            messages=[{"role": "user", "content": "Hi"}],
            model="llama3-8b-8192",
            max_tokens=10
        )
        return {"status": "Groq OK", "response": res.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)