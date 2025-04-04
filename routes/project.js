const express = require("express");
const ProjectGenerator = require("../controllers/ProjectGenerator");
const GeneratedProject = require("../models/Project");

const router = express.Router();
router.get("/",(req,res)=>{
  res.render("generated-project")
})

router.post("/generate-project", async (req, res) => {
  try {
    const materials = req.body.materials;
    console.log(materials);
    const generator = new ProjectGenerator(materials);
    const project = await generator.build();

    res.json(project);
  } catch (err) {
    console.error("Generation failed:", err);
    res.status(500).json({ error: "Project generation failed" });
  }
});

router.post('/save-generated-project', async (req, res) => {
    try {
      const { name, category, materials, image } = req.body;
  
      const newProject = new GeneratedProject({
        name,
        category,
        materials,
        image,
      });
  
      await newProject.save();
      res.status(201).json({ message: "Project saved successfully!" });
    } catch (err) {
      console.error("Error saving project:", err);
      res.status(500).json({ error: "Internal server error" });
    }
});
  

module.exports=router;