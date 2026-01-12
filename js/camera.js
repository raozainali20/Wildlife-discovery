// ========================================
// CAMERA.JS - Camera & Photo Upload Functionality
// ======================================== */

let stream = null;
let currentAnimalId = null;

// Initialize camera functionality
document.addEventListener('DOMContentLoaded', () => {
  // Get animal ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  currentAnimalId = urlParams.get('id');
  
  setupCameraButtons();
  loadSavedPhotos();
});

// Setup camera button event listeners
function setupCameraButtons() {
  const takePictureBtn = document.getElementById('takePictureBtn');
  const uploadPictureBtn = document.getElementById('uploadPictureBtn');
  const fileInput = document.getElementById('fileInput');
  const savePhotoBtn = document.getElementById('savePhotoBtn');
  const retakePhotoBtn = document.getElementById('retakePhotoBtn');
  
  // Take picture button
  if (takePictureBtn) {
    takePictureBtn.addEventListener('click', async () => {
      try {
        await startCamera();
      } catch (error) {
        console.error('Camera error:', error);
        showCameraError(error.message);
      }
    });
  }
  
  // Upload picture button
  if (uploadPictureBtn) {
    uploadPictureBtn.addEventListener('click', () => {
      fileInput?.click();
    });
  }
  
  // File input change
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
  
  // Save photo button
  if (savePhotoBtn) {
    savePhotoBtn.addEventListener('click', savePhoto);
  }
  
  // Retake photo button
  if (retakePhotoBtn) {
    retakePhotoBtn.addEventListener('click', () => {
      hidePreview();
      if (stream) {
        showCamera();
      }
    });
  }
}

// Start camera
async function startCamera() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('cameraCanvas');
  
  if (!video || !canvas) return;
  
  try {
    // Check if camera API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera API not supported in this browser');
    }
    
    // Request camera access
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Use back camera on mobile
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });
    
    video.srcObject = stream;
    video.style.display = 'block';
    canvas.style.display = 'none';
    
    // Show camera container
    showCamera();
    
    // Add capture button
    addCaptureButton(video, canvas);
    
  } catch (error) {
    console.error('Error accessing camera:', error);
    
    // Specific error messages
    if (error.name === 'NotAllowedError') {
      showCameraError('Camera access denied. Please allow camera permissions.');
    } else if (error.name === 'NotFoundError') {
      showCameraError('No camera found on this device.');
    } else {
      showCameraError('Could not access camera. ' + error.message);
    }
  }
}

// Show camera view
function showCamera() {
  const video = document.getElementById('cameraVideo');
  if (video) {
    video.style.display = 'block';
    video.style.cssText = `
      display: block;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
    `;
  }
}

// Add capture button to camera view
function addCaptureButton(video, canvas) {
  // Remove existing button if any
  const existingBtn = document.getElementById('captureBtn');
  if (existingBtn) existingBtn.remove();
  
  const captureBtn = document.createElement('button');
  captureBtn.id = 'captureBtn';
  captureBtn.className = 'btn btn-primary btn-lg';
  captureBtn.innerHTML = '<span>📸</span><span>Capture</span>';
  captureBtn.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    margin: var(--spacing-md) auto;
    max-width: 200px;
  `;
  
  captureBtn.addEventListener('click', () => {
    capturePhoto(video, canvas);
  });
  
  video.parentElement.appendChild(captureBtn);
}

// Capture photo from video stream
function capturePhoto(video, canvas) {
  const context = canvas.getContext('2d');
  
  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Draw current video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Get image data URL
  const imageData = canvas.toDataURL('image/jpeg', 0.8);
  
  // Stop camera
  stopCamera();
  
  // Show preview
  showPreview(imageData);
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    showCameraError('Please select an image file');
    return;
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showCameraError('Image is too large. Please select an image under 5MB.');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    showPreview(e.target.result);
  };
  
  reader.onerror = () => {
    showCameraError('Failed to read image file');
  };
  
  reader.readAsDataURL(file);
}

// Show photo preview
function showPreview(imageData) {
  const preview = document.getElementById('photoPreview');
  const previewImage = document.getElementById('previewImage');
  const video = document.getElementById('cameraVideo');
  const captureBtn = document.getElementById('captureBtn');
  
  if (preview && previewImage) {
    previewImage.src = imageData;
    preview.classList.remove('hidden');
    preview.style.display = 'block';
  }
  
  // Hide camera
  if (video) video.style.display = 'none';
  if (captureBtn) captureBtn.remove();
}

// Hide preview
function hidePreview() {
  const preview = document.getElementById('photoPreview');
  if (preview) {
    preview.classList.add('hidden');
    preview.style.display = 'none';
  }
}

// Save photo to localStorage
function savePhoto() {
  const previewImage = document.getElementById('previewImage');
  if (!previewImage || !previewImage.src) return;
  
  const photos = JSON.parse(localStorage.getItem('animalPhotos') || '{}');
  
  if (!photos[currentAnimalId]) {
    photos[currentAnimalId] = [];
  }
  
  // Add photo with timestamp
  photos[currentAnimalId].push({
    data: previewImage.src,
    timestamp: new Date().toISOString()
  });
  
  // Limit to 10 photos per animal
  if (photos[currentAnimalId].length > 10) {
    photos[currentAnimalId] = photos[currentAnimalId].slice(-10);
  }
  
  localStorage.setItem('animalPhotos', JSON.stringify(photos));
  
  // Hide preview
  hidePreview();
  
  // Reload saved photos
  loadSavedPhotos();
  
  // Show success message
  showNotification('Photo saved successfully! 📸');
}

// Load saved photos
function loadSavedPhotos() {
  const container = document.getElementById('savedPhotos');
  if (!container || !currentAnimalId) return;
  
  const photos = JSON.parse(localStorage.getItem('animalPhotos') || '{}');
  const animalPhotos = photos[currentAnimalId] || [];
  
  if (animalPhotos.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = animalPhotos.reverse().map((photo, index) => `
    <div class="saved-photo-item">
      <img src="${photo.data}" alt="Saved photo ${index + 1}">
      <button class="saved-photo-delete" onclick="deletePhoto(${animalPhotos.length - 1 - index})" aria-label="Delete photo">
        ×
      </button>
    </div>
  `).join('');
}

// Delete photo
window.deletePhoto = function(index) {
  if (!currentAnimalId) return;
  
  const photos = JSON.parse(localStorage.getItem('animalPhotos') || '{}');
  const animalPhotos = photos[currentAnimalId] || [];
  
  animalPhotos.splice(animalPhotos.length - 1 - index, 1);
  
  if (animalPhotos.length === 0) {
    delete photos[currentAnimalId];
  } else {
    photos[currentAnimalId] = animalPhotos;
  }
  
  localStorage.setItem('animalPhotos', JSON.stringify(photos));
  loadSavedPhotos();
  
  showNotification('Photo deleted');
};

// Stop camera
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  
  const video = document.getElementById('cameraVideo');
  if (video) {
    video.style.display = 'none';
    video.srcObject = null;
  }
  
  const captureBtn = document.getElementById('captureBtn');
  if (captureBtn) captureBtn.remove();
}

// Show camera error
function showCameraError(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-danger);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    z-index: 1000;
    max-width: 90%;
    text-align: center;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-success);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    animation: fadeInOut 2s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

// Clean up when leaving page
window.addEventListener('beforeunload', () => {
  stopCamera();
});
