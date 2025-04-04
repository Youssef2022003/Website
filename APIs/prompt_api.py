import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../DIY Text Generation')))

from flask import Flask, request, jsonify
from final_diy_prompt_generator import generate_diy_prompt

app = Flask(__name__)

@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    data = request.get_json()
    materials = data.get('materials', [])
    prompt = generate_diy_prompt(materials)
    return jsonify({"prompt": prompt})

if __name__ == '__main__':
    app.run(port=5001)
