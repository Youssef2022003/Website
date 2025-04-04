
let generationCount = 0;

async function generateProject() {
  // Step 1: Define materials (can be dynamic later)
  const materials = ["Tin cans"]; 

  // Step 2: Call backend to generate full project
  const response = await fetch("/generate-project/generate-project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ materials}),
    
  });

  if (!response.ok) {
    alert("Failed to generate project.");
    return;
  }

  const data = await response.json();

  // Step 3: Populate frontend
  document.getElementById("project-name").textContent = data.name;
  document.getElementById("category").textContent = data.category;
  document.getElementById("project-image").src = data.image;

  const matList = document.getElementById("materials");
  matList.innerHTML = data.materials.map(m => `<li>${m}</li>`).join("");

  const instructionsList = document.getElementById("instructions");
  instructionsList.innerHTML = [
    "Follow crafting steps for " + data.name,
    "Use materials as listed above",
    "Assemble the components carefully",
    "Let it dry and enjoy your upcycled creation!"
  ].map(i => `<li>${i}</li>`).join("");

  // Update URL without reload
  generationCount++;
  const newURL = generationCount === 1 
    ? "/generate-project/1" 
    : `/generate-project/${generationCount}`;
  window.history.pushState({}, "", newURL);
}

  