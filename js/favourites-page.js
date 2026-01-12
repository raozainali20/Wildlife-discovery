// ========================================
// FAVOURITES-PAGE.JS - Display User's Favourite Animals
// ========================================

import { setCurrentPage, formatDate, showError } from './app.js';
import { createImageWithSrcset } from './responsive-images.js';

let favourites = [];
let allAnimals = [];

// Initialize favourites page
document.addEventListener('DOMContentLoaded', async () => {
  setCurrentPage('favourites');
  
  try {
    // Load favourites from localStorage
    loadFavourites();
    
    // Load animals data
    await loadAnimalsData();
    
    // Display favourites
    displayFavourites();
    
    // Setup event listeners
    setupEventListeners();
  } catch (error) {
    console.error('Error initializing favourites page:', error);
    showError('Failed to load favourites. Please try refreshing the page.');
  }
});

// Load favourites from localStorage
function loadFavourites() {
  favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
  updateFavouritesCount();
}

// Load animals data
async function loadAnimalsData() {
  try {
    const response = await fetch('data/animals.json');
    if (!response.ok) throw new Error('Failed to fetch animals');
    allAnimals = await response.json();
  } catch (error) {
    console.error('Error loading animals:', error);
    throw error;
  }
}

// Display favourites
function displayFavourites() {
  const emptyState = document.getElementById('emptyState');
  const favouritesGrid = document.getElementById('favouritesGrid');
  const clearAllBtn = document.getElementById('clearAllBtn');
  
  if (!favouritesGrid || !emptyState) return;
  
  // Clear grid
  favouritesGrid.innerHTML = '';
  
  // Check if empty
  if (favourites.length === 0) {
    emptyState.classList.add('visible');
    favouritesGrid.classList.remove('visible');
    if (clearAllBtn) clearAllBtn.style.display = 'none';
    return;
  }
  
  // Show grid
  emptyState.classList.remove('visible');
  favouritesGrid.classList.add('visible');
  if (clearAllBtn) clearAllBtn.style.display = 'block';
  
  // Get favourite animals
  const favouriteAnimals = allAnimals.filter(animal => 
    favourites.includes(animal.id)
  );
  
  // Display each favourite
  favouriteAnimals.forEach(animal => {
    const card = createFavouriteCard(animal);
    favouritesGrid.appendChild(card);
  });
}

// Create favourite card element
function createFavouriteCard(animal) {
  const card = document.createElement('div');
  card.className = 'favourite-card';
  card.innerHTML = `
    ${createImageWithSrcset(animal.image, animal.name, 'favourite-image', 'lazy')}
    
    <div class="favourite-content">
      <div class="favourite-header">
        <div class="favourite-title">
          <h3>${animal.name}</h3>
          <p class="favourite-scientific">${animal.scientificName}</p>
        </div>
        <button class="remove-favourite" 
                data-id="${animal.id}" 
                aria-label="Remove from favourites"
                title="Remove from favourites">
          💔
        </button>
      </div>
      
      <p class="favourite-description">${animal.description}</p>
      
      <div class="favourite-meta">
        <div class="meta-item">
          <span class="meta-icon">🏠</span>
          <span>${animal.habitat}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">🍽️</span>
          <span>${animal.diet}</span>
        </div>
      </div>
      
      <div class="favourite-meta">
        <span class="conservation-status status-${animal.endangeredLevel.toLowerCase()}">
          ${animal.conservationStatus}
        </span>
      </div>
      
      <div class="favourite-actions">
        <a href="animal-details.html?id=${animal.id}" class="btn btn-primary btn-small">
          View Details
        </a>
        <button class="btn btn-secondary btn-small share-btn" data-id="${animal.id}">
          Share
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// Setup event listeners
function setupEventListeners() {
  // Remove favourite buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-favourite')) {
      const animalId = parseInt(e.target.dataset.id);
      removeFavourite(animalId);
    }
  });
  
  // Share buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('share-btn')) {
      const animalId = parseInt(e.target.dataset.id);
      shareAnimal(animalId);
    }
  });
  
  // Clear all button
  const clearAllBtn = document.getElementById('clearAllBtn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to remove all favourites?')) {
        clearAllFavourites();
      }
    });
  }
}

// Remove favourite
function removeFavourite(animalId) {
  favourites = favourites.filter(id => id !== animalId);
  localStorage.setItem('favourites', JSON.stringify(favourites));
  
  // Update display
  updateFavouritesCount();
  displayFavourites();
  
  // Show notification
  showNotification('Removed from favourites');
}

// Clear all favourites
function clearAllFavourites() {
  favourites = [];
  localStorage.setItem('favourites', JSON.stringify(favourites));
  
  // Update display
  updateFavouritesCount();
  displayFavourites();
  
  // Show notification
  showNotification('All favourites cleared');
}

// Update favourites count
function updateFavouritesCount() {
  const countEl = document.getElementById('favouritesCount');
  if (countEl) {
    countEl.textContent = favourites.length;
  }
}

// Share animal
function shareAnimal(animalId) {
  const animal = allAnimals.find(a => a.id === animalId);
  if (!animal) return;
  
  const shareData = {
    title: `${animal.name} - British Wildlife Centre`,
    text: `Check out this amazing ${animal.name} at the British Wildlife Centre!`,
    url: `${window.location.origin}/animal-details.html?id=${animalId}`
  };
  
  // Check if Web Share API is available
  if (navigator.share) {
    navigator.share(shareData)
      .then(() => showNotification('Shared successfully!'))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          fallbackShare(shareData);
        }
      });
  } else {
    fallbackShare(shareData);
  }
}

// Fallback share (copy to clipboard)
function fallbackShare(shareData) {
  const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
  
  navigator.clipboard.writeText(text)
    .then(() => showNotification('Link copied to clipboard!'))
    .catch(err => {
      console.error('Error copying to clipboard:', err);
      showNotification('Failed to share');
    });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: calc(80px + var(--spacing-lg));
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    animation: slideUp 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
  }
  
  @media (min-width: 1024px) {
    .notification {
      bottom: var(--spacing-lg) !important;
    }
  }
`;
document.head.appendChild(style);
