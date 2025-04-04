const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const uploadForm = document.getElementById('uploadForm');
const resultSection = document.getElementById('resultSection');
const resultsDisplay = document.getElementById('resultsDisplay');

let selectedFiles = [];
let previewURLs = [];

const materials = [
  { label: 'Aluminum Food Can', icon: '🥫' },
  { label: 'Aluminum Soda Can', icon: '🥤' },
  { label: 'Cardboard', icon: '📦' },
  { label: 'Fabric', icon: '👕' },
  { label: 'Glass Bottle', icon: '🍾' },
  { label: 'Glass Jar', icon: '🫙' },
  { label: 'Paper', icon: '📄' },
  { label: 'Plain Cup', icon: '☕' },
  { label: 'Plastic Bag', icon: '🛍️' },
  { label: 'Plastic Bottle', icon: '🥤' },
  { label: 'Plastic Cup', icon: '🥛' },
  { label: 'Plastic Cutlery', icon: '🍴' },
  { label: 'Plastic Detergent Bottle', icon: '🧴' },
  { label: 'Plastic Food Container', icon: '🍱' },
  { label: 'Plastic Straws', icon: '🥢' },
  { label: 'Styrofoam Food Containers', icon: '⚪' }
];

fileInput.addEventListener('change', () => {
  selectedFiles = Array.from(fileInput.files);
  updatePreview();
});

function updatePreview() {
  previewContainer.innerHTML = '';
  previewURLs = [];

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewItem = document.createElement('div');
      previewItem.classList.add('preview-item');

      const img = document.createElement('img');
      img.src = e.target.result;
      previewURLs.push(e.target.result); // track preview URL order

      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove-btn');
      removeBtn.textContent = '×';
      removeBtn.onclick = () => {
        selectedFiles.splice(index, 1);
        previewURLs.splice(index, 1);
        updatePreview();
        updateFileInput();
      };

      previewItem.appendChild(img);
      previewItem.appendChild(removeBtn);
      previewContainer.appendChild(previewItem);
    };
    reader.readAsDataURL(file);
  });
}

function updateFileInput() {
  const dataTransfer = new DataTransfer();
  selectedFiles.forEach(file => dataTransfer.items.add(file));
  fileInput.files = dataTransfer.files;
}

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const loader = document.getElementById('loaderBar');
  loader.style.display = 'block';

  if (selectedFiles.length === 0) {
    loader.style.display = 'none';
    return;
  }

  const formData = new FormData();
  selectedFiles.forEach(file => {
    formData.append('images', file);
  });

  try {
    const response = await fetch('http://localhost:5000/classify', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

    const data = await response.json();
    const allResults = data.results;
    showResults(allResults);
  } catch (err) {
    console.error('Classification error:', err);
    alert('Something went wrong while classifying. Please try again.');
  } finally {
    loader.style.display = 'none';
  }
});

function showResults(labels) {
  resultSection.style.display = 'block';
  resultsDisplay.innerHTML = '';

  labels.forEach((label, index) => {
    const item = document.createElement('div');
    item.className = 'classification-item';

    const labelEl = document.createElement('span');
    labelEl.className = 'classification-label';

    const labelParts = label.split(",").map(item => item.trim());
    const formattedLabels = labelParts.map(raw => {
      const formatted = formatLabel(raw);
      return `${getIcon(formatted)} ${formatted}`;
    }).join(", ");

    labelEl.textContent = `Image ${index + 1}: ${formattedLabels}`;
    labelEl.setAttribute('data-label', label);

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';

    editBtn.onclick = () => {
      item.innerHTML = '';
      const labelParts = labelEl.getAttribute('data-label').split(",").map(l => l.trim());
      const dropdowns = [];

      labelParts.forEach((raw, i) => {
        const formatted = formatLabel(raw);
        const dropdown = document.createElement('select');
        dropdown.className = 'material-dropdown';

        materials.forEach(mat => {
          const option = document.createElement('option');
          option.value = mat.label;
          option.textContent = `${mat.icon} ${mat.label}`;
          if (mat.label === formatted) {
            option.selected = true;
          }
          dropdown.appendChild(option);
        });

        dropdowns.push(dropdown);
        item.appendChild(dropdown);
      });

      const saveBtn = document.createElement('button');
      saveBtn.className = 'edit-btn';
      saveBtn.textContent = 'Save';

      saveBtn.onclick = () => {
        const newLabels = dropdowns.map(dd => dd.value);
        const newLabelText = newLabels.map(l => `${getIcon(l)} ${l}`).join(", ");
        labelEl.textContent = `Image ${index + 1}: ${newLabelText}`;
        labelEl.setAttribute('data-label', newLabels.join(', '));
        item.innerHTML = '';
        item.appendChild(labelEl);
        item.appendChild(editBtn);
      };

      item.appendChild(saveBtn);
    };

    item.appendChild(labelEl);
    item.appendChild(editBtn);
    resultsDisplay.appendChild(item);
  });
}

function getIcon(label) {
  const match = materials.find(m => m.label === label);
  return match ? match.icon : '';
}

function formatLabel(raw) {
  return raw
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

previewContainer.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    document.querySelector('.lightbox-img').src = e.target.src;
    document.getElementById('lightbox').style.display = 'flex';
  }
});

document.querySelector('.lightbox-close').addEventListener('click', () => {
  document.getElementById('lightbox').style.display = 'none';
});
