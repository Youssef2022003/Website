import os
from flask import Flask, request, send_file
from flask_cors import CORS  # <-- NEW
from diffusers import StableDiffusionPipeline
import torch
import uuid


app = Flask(__name__)
CORS(app)
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load model and LoRA weights
pipeline = StableDiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2-1",
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
).to(device)

base_dir = os.path.dirname(os.path.abspath(__file__)) 
weights_path = os.path.join(base_dir, "../models_paths/lora_glass_bottles_weightsV2.1.pth")

lora_weights = torch.load(weights_path, map_location=device)
pipeline.unet.load_state_dict(lora_weights, strict=False)

@app.route("/generate-image", methods=["POST"])
def generate():
    
    prompt = request.json.get("prompt", "")
    
    if not prompt:
        print("No prompt received.")
        return {"error": "Prompt required"}, 400

    print(f"\nReceived prompt: {prompt}")
    print("Generating image...")

    try:
        with torch.autocast(device_type=device):
            image = pipeline(prompt).images[0]
        print("Image generated successfully")

        # Save with UUID name (optional: keep old if needed)
        image_name = f"image_{uuid.uuid4().hex[:6]}.png"
        image_path = os.path.join(base_dir, image_name)
        image.save(image_path)
        print(f"Image saved at: {image_path}")

        return send_file(image_path, mimetype='image/png')

    except Exception as e:
        print("Generation failed:", e)
        return {"error": "Generation failed", "details": str(e)}, 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
