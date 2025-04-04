const axios = require("axios");

class ProjectGenerator {
  constructor(materials) {
    this.materials = materials;
    this.prompt = null;
    this.image = null;
    this.name = null;
    this.category = null;
    //this.instructions = null;
  }

  async generatePrompt() {
    const response = await axios.post("http://localhost:5001/generate-prompt", {
      materials: this.materials
    });
    this.prompt = response.data.prompt;
  }

  async generateImage() {
    const response = await axios.post("http://localhost:5000/generate-image", {
      prompt: this.prompt
    }, { responseType: "arraybuffer" });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    this.image = `data:image/png;base64,${base64}`;
  }

  assignProjectMetadata() {
    // These could be made smarter later
    this.name = "Auto-Generated DIY Project";
    this.category = "Storage & Decoration";
    //this.instructions = 
  }

  async build() {
    await this.generatePrompt();
    await this.generateImage();
    this.assignProjectMetadata();

    return {
      name: this.name,
      category: this.category,
      materials: this.materials,
      prompt: this.prompt,
      image: this.image
    };
  }
}

module.exports = ProjectGenerator;
