// ========================================
// ANIMAL-DETAILS.JS - Individual Animal Page
// ======================================== */

import { showLoading, showError } from './app.js';
import { createResponsiveImage } from './responsive-images.js';

let currentAnimal = null;
let allAnimals = [];

// Initialize animal details page
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const animalId = parseInt(urlParams.get('id'));
  
  if (animalId) {
    loadAnimalDetails(animalId);
  } else {
    showError(document.getElementById('animalDetails'), 'No animal ID provided');
  }
});

// Load animal details
async function loadAnimalDetails(animalId) {
  const container = document.getElementById('animalDetails');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const response = await fetch('data/animals.json');
    if (!response.ok) throw new Error('Failed to load animal data');
    
    allAnimals = await response.json();
    currentAnimal = allAnimals.find(animal => animal.id === animalId);
    
    if (!currentAnimal) {
      throw new Error('Animal not found');
    }
    
    displayAnimalDetails(currentAnimal);
    updateBreadcrumb(currentAnimal.name);
    loadRelatedAnimals(currentAnimal);
  } catch (error) {
    console.error('Error loading animal details:', error);
    showError(container, error.message || 'Failed to load animal details');
  }
}

// Display animal details
function displayAnimalDetails(animal) {
  const container = document.getElementById('animalDetails');
  if (!container) return;
  
  // Update page title
  document.title = `${animal.name} - British Wildlife Centre`;
  
  container.innerHTML = `
    <section class="animal-hero">
      <div class="container">
        <div class="animal-hero-content">
          <div class="animal-hero-image">
            <img src="${animal.image}" alt="${animal.name}" 
                 onerror="this.src='https://via.placeholder.com/800x600/2d5016/ffffff?text=${encodeURIComponent(animal.name)}'">
            ${getStatusBadge(animal.endangeredLevel)}
          </div>
          
          <div class="animal-hero-info">
            <div class="animal-header">
              <div class="animal-title-group">
                <h1>${animal.name}</h1>
                <p class="animal-scientific-name">${animal.scientificName}</p>
              </div>
              <button class="favourite-btn-large ${isFavourite(animal.id) ? 'active' : ''}" 
                      id="favouriteBtn" 
                      aria-label="Add to favourites">
                ${isFavourite(animal.id) ? '⭐' : '☆'}
              </button>
            </div>
            
            <p class="animal-description">${animal.description}</p>
            
            <div class="quick-facts">
              <div class="quick-fact">
                <span class="quick-fact-icon">🏡</span>
                <div class="quick-fact-content">
                  <div class="quick-fact-label">Habitat</div>
                  <div class="quick-fact-value">${animal.habitat}</div>
                </div>
              </div>
              
              <div class="quick-fact">
                <span class="quick-fact-icon">🍽️</span>
                <div class="quick-fact-content">
                  <div class="quick-fact-label">Diet</div>
                  <div class="quick-fact-value">${animal.diet}</div>
                </div>
              </div>
              
              <div class="quick-fact">
                <span class="quick-fact-icon">📍</span>
                <div class="quick-fact-content">
                  <div class="quick-fact-label">Location</div>
                  <div class="quick-fact-value">${animal.location.area}</div>
                </div>
              </div>
              
              <div class="quick-fact">
                <span class="quick-fact-icon">🌍</span>
                <div class="quick-fact-content">
                  <div class="quick-fact-label">Conservation Status</div>
                  <div class="quick-fact-value">${animal.conservationStatus}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="animal-info-section">
      <div class="container">
        <h2 class="info-section-title">Detailed Information</h2>
        <div class="info-cards">
          <div class="info-card">
            <h3><span>🏞️</span> Natural Habitat</h3>
            <p>${animal.habitat}. These animals have adapted to various environments across Britain and can be found in ${animal.location.area}.</p>
          </div>
          
          <div class="info-card">
            <h3><span>🍴</span> Diet & Feeding</h3>
            <p>${animal.diet}. Their feeding habits play a crucial role in the ecosystem, helping maintain the natural balance of their habitat.</p>
          </div>
          
          <div class="info-card">
            <h3><span>🔒</span> Conservation</h3>
            <p>Currently listed as <strong>${animal.conservationStatus}</strong>. Conservation efforts are ${animal.endangeredLevel === 'high' ? 'critical' : animal.endangeredLevel === 'medium' ? 'important' : 'ongoing'} to protect this species and its habitat.</p>
          </div>
          
          <div class="info-card">
            <h3><span>📊</span> Population Status</h3>
            <p>This species is considered ${getStatusText(animal.endangeredLevel)}. ${getConservationMessage(animal.endangeredLevel)}</p>
          </div>
        </div>
      </div>
    </section>
    
    ${animal.funFact ? `
      <section class="animal-info-section">
        <div class="container">
          <div class="fun-fact-card">
            <h3>🎯 Did You Know?</h3>
            <p>${animal.funFact}</p>
          </div>
        </div>
      </section>
    ` : ''}
  `;
  
  // Setup favourite button
  setupFavouriteButton(animal.id);
}

// Get status badge HTML
function getStatusBadge(level) {
  const badges = {
    high: '<span class="animal-status-badge">Endangered</span>',
    medium: '<span class="animal-status-badge medium">Vulnerable</span>',
    low: '<span class="animal-status-badge low">Stable</span>'
  };
  return badges[level] || '';
}

// Get status text
function getStatusText(level) {
  const texts = {
    high: 'endangered and requires urgent protection',
    medium: 'vulnerable and needs conservation efforts',
    low: 'stable but still monitored'
  };
  return texts[level] || 'under observation';
}

// Get conservation message
function getConservationMessage(level) {
  const messages = {
    high: 'Immediate action is needed to prevent further decline. Support conservation efforts to protect this species.',
    medium: 'Continued monitoring and habitat protection are essential to ensure population recovery.',
    low: 'While currently stable, ongoing conservation ensures this species thrives for future generations.'
  };
  return messages[level] || '';
}

// Check if animal is favourite
function isFavourite(animalId) {
  const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
  return favourites.includes(animalId);
}

// Setup favourite button
function setupFavouriteButton(animalId) {
  const btn = document.getElementById('favouriteBtn');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    
    if (favourites.includes(animalId)) {
      const index = favourites.indexOf(animalId);
      favourites.splice(index, 1);
      btn.textContent = '☆';
      btn.classList.remove('active');
      showNotification('Removed from favourites');
    } else {
      favourites.push(animalId);
      btn.textContent = '⭐';
      btn.classList.add('active');
      showNotification('Added to favourites!');
    }
    
    localStorage.setItem('favourites', JSON.stringify(favourites));
  });
}

// Update breadcrumb
function updateBreadcrumb(animalName) {
  const breadcrumb = document.getElementById('breadcrumbAnimal');
  if (breadcrumb) {
    breadcrumb.textContent = animalName;
  }
}

// Load related animals
function loadRelatedAnimals(currentAnimal) {
  const container = document.getElementById('relatedAnimals');
  if (!container) return;
  
  // Filter out current animal and get random 4 animals
  const related = allAnimals
    .filter(animal => animal.id !== currentAnimal.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  
  if (related.length === 0) {
    container.innerHTML = '<p class="text-center text-muted">No related animals found.</p>';
    return;
  }
  
  container.innerHTML = related.map(animal => `
    <div class="related-animal-card" onclick="window.location.href='animal-details.html?id=${animal.id}'">
      <div class="related-animal-image">
        <img src="${animal.image}" alt="${animal.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x200/2d5016/ffffff?text=${encodeURIComponent(animal.name)}'">
      </div>
      <div class="related-animal-content">
        <h3 class="related-animal-name">${animal.name}</h3>
        <p class="related-animal-scientific">${animal.scientificName}</p>
      </div>
    </div>
  `).join('');
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

// Export current animal for camera module
export function getCurrentAnimal() {
  return currentAnimal;
}
