// ========================================
// MAP-PAGE.JS - Interactive Map with Leaflet
// ======================================== */

import { createImageWithSrcset } from './responsive-images.js';

let map = null;
let markers = [];
let userMarker = null;

// Initialize map page
document.addEventListener('DOMContentLoaded', () => {
  initializeMap();
  loadAnimals();
  setupGeolocationButton();
});

// Initialize Leaflet map
function initializeMap() {
  // Center on UK
  map = L.map('map').setView([54.5, -2.5], 6);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);
  
  console.log('🗺️ Map initialized');
}

// Load animals and add markers
async function loadAnimals() {
  try {
    const response = await fetch('data/animals.json');
    if (!response.ok) throw new Error('Failed to load animals');
    
    const animals = await response.json();
    
    // Add markers to map
    animals.forEach(animal => {
      addAnimalMarker(animal);
    });
    
    // Populate sidebar
    populateSidebar(animals);
    
  } catch (error) {
    console.error('Error loading animals:', error);
    showNotification('Failed to load animal locations', 'error');
  }
}

// Add animal marker to map
function addAnimalMarker(animal) {
  // Create custom icon based on endangered level
  const iconColor = getMarkerColor(animal.endangeredLevel);
  
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background-color: ${iconColor};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        cursor: pointer;
      ">
        🐾
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
  
  // Create marker
  const marker = L.marker([animal.location.lat, animal.location.lng], { icon })
    .addTo(map)
    .bindPopup(createPopupContent(animal));
  
  markers.push({ marker, animal });
}

// Get marker color based on endangered level
function getMarkerColor(level) {
  const colors = {
    high: '#f44336',
    medium: '#ff9800',
    low: '#4caf50'
  };
  return colors[level] || '#2196f3';
}

// Create popup content
function createPopupContent(animal) {
  const statusLabels = {
    high: 'Endangered',
    medium: 'Vulnerable',
    low: 'Stable'
  };
  
  return `
    <div class="map-popup">
      <img src="${animal.image}" alt="${animal.name}" class="map-popup-image"
           onerror="this.src='https://via.placeholder.com/200x120/2d5016/ffffff?text=${encodeURIComponent(animal.name)}'">
      <h3 class="map-popup-title">${animal.name}</h3>
      <p class="map-popup-subtitle">${animal.scientificName}</p>
      <span class="map-popup-badge ${animal.endangeredLevel}">${statusLabels[animal.endangeredLevel] || 'Unknown'}</span>
      <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.75rem;">
        📍 ${animal.location.area}
      </p>
      <a href="animal-details.html?id=${animal.id}" class="map-popup-btn">View Details</a>
    </div>
  `;
}

// Populate sidebar with animal list
function populateSidebar(animals) {
  const sidebar = document.getElementById('animalList');
  if (!sidebar) return;
  
  sidebar.innerHTML = animals.map(animal => `
    <div class="sidebar-animal-item" data-animal-id="${animal.id}">
      <div class="sidebar-animal-name">${animal.name}</div>
      <div class="sidebar-animal-location">📍 ${animal.location.area}</div>
    </div>
  `).join('');
  
  // Add click handlers
  sidebar.querySelectorAll('.sidebar-animal-item').forEach(item => {
    item.addEventListener('click', () => {
      const animalId = parseInt(item.getAttribute('data-animal-id'));
      const markerData = markers.find(m => m.animal.id === animalId);
      
      if (markerData) {
        // Zoom to marker
        map.setView(markerData.marker.getLatLng(), 10);
        // Open popup
        markerData.marker.openPopup();
      }
    });
  });
}

// Setup geolocation button
function setupGeolocationButton() {
  const locateBtn = document.getElementById('locateBtn');
  if (!locateBtn) return;
  
  locateBtn.addEventListener('click', getUserLocation);
}

// Get user's current location
function getUserLocation() {
  if (!navigator.geolocation) {
    showNotification('Geolocation is not supported by your browser', 'error');
    return;
  }
  
  showLoadingOverlay('Getting your location...');
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      hideLoadingOverlay();
      const { latitude, longitude } = position.coords;
      
      addUserMarker(latitude, longitude);
      showNotification('Location found! 📍', 'success');
      
      // Zoom to user location
      map.setView([latitude, longitude], 12);
    },
    (error) => {
      hideLoadingOverlay();
      console.error('Geolocation error:', error);
      
      let message = 'Could not get your location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location access denied. Please allow location permissions.';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information unavailable.';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out.';
          break;
      }
      
      showNotification(message, 'error');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Add user location marker
function addUserMarker(lat, lng) {
  // Remove existing user marker if any
  if (userMarker) {
    map.removeLayer(userMarker);
  }
  
  // Create user location icon
  const userIcon = L.divIcon({
    className: 'user-location-marker',
    html: '<div class="user-location-marker"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  // Add marker
  userMarker = L.marker([lat, lng], { icon: userIcon })
    .addTo(map)
    .bindPopup('📍 You are here')
    .openPopup();
}

// Show loading overlay
function showLoadingOverlay(message) {
  const overlay = document.createElement('div');
  overlay.id = 'geolocationLoading';
  overlay.className = 'geolocation-loading';
  overlay.innerHTML = `
    <div class="loading"></div>
    <p>${message}</p>
  `;
  document.body.appendChild(overlay);
}

// Hide loading overlay
function hideLoadingOverlay() {
  const overlay = document.getElementById('geolocationLoading');
  if (overlay) overlay.remove();
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  const bgColor = type === 'error' ? 'var(--color-danger)' : 'var(--color-success)';
  
  notification.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${bgColor};
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    animation: fadeInOut 3s ease;
    max-width: 90%;
    text-align: center;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
