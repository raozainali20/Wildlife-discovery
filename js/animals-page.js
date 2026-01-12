// ========================================
// ANIMALS-PAGE.JS - Animals List with Filters
// ========================================

import { showLoading, showError, debounce } from './app.js';
import { createImageWithSrcset } from './responsive-images.js';

// State
let allAnimals = [];
let filteredAnimals = [];
let currentFilter = 'all';
let currentSort = 'name-asc';
let searchQuery = '';

// Initialize animals page
document.addEventListener('DOMContentLoaded', () => {
  loadAnimals();
  setupEventListeners();
});

// Load all animals from JSON
async function loadAnimals() {
  const container = document.getElementById('animalsGrid');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const response = await fetch('data/animals.json');
    if (!response.ok) throw new Error('Failed to load animals');
    
    allAnimals = await response.json();
    filteredAnimals = [...allAnimals];
    
    updateCounts();
    applyFiltersAndSort();
    displayAnimals();
  } catch (error) {
    console.error('Error loading animals:', error);
    showError(container, 'Failed to load animals. Please try again later.');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchQuery = e.target.value.toLowerCase();
      applyFiltersAndSort();
      displayAnimals();
      updateActiveFilters();
    }, 300));
  }
  
  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      setFilter(filter);
      
      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // Sort select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndSort();
      displayAnimals();
    });
  }
}

// Set filter
function setFilter(filter) {
  currentFilter = filter;
  applyFiltersAndSort();
  displayAnimals();
  updateActiveFilters();
}

// Apply filters and sorting
function applyFiltersAndSort() {
  // Start with all animals
  filteredAnimals = [...allAnimals];
  
  // Apply endangered level filter
  if (currentFilter !== 'all') {
    filteredAnimals = filteredAnimals.filter(animal => 
      animal.endangeredLevel === currentFilter
    );
  }
  
  // Apply search filter
  if (searchQuery) {
    filteredAnimals = filteredAnimals.filter(animal =>
      animal.name.toLowerCase().includes(searchQuery) ||
      animal.scientificName.toLowerCase().includes(searchQuery) ||
      animal.description.toLowerCase().includes(searchQuery) ||
      animal.habitat.toLowerCase().includes(searchQuery)
    );
  }
  
  // Apply sorting
  filteredAnimals.sort((a, b) => {
    switch (currentSort) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'endangered-high':
        return getEndangeredValue(b.endangeredLevel) - getEndangeredValue(a.endangeredLevel);
      case 'endangered-low':
        return getEndangeredValue(a.endangeredLevel) - getEndangeredValue(b.endangeredLevel);
      default:
        return 0;
    }
  });
}

// Get numeric value for endangered level
function getEndangeredValue(level) {
  const values = { high: 3, medium: 2, low: 1 };
  return values[level] || 0;
}

// Update filter counts
function updateCounts() {
  const counts = {
    all: allAnimals.length,
    high: allAnimals.filter(a => a.endangeredLevel === 'high').length,
    medium: allAnimals.filter(a => a.endangeredLevel === 'medium').length,
    low: allAnimals.filter(a => a.endangeredLevel === 'low').length
  };
  
  document.getElementById('countAll').textContent = counts.all;
  document.getElementById('countHigh').textContent = counts.high;
  document.getElementById('countMedium').textContent = counts.medium;
  document.getElementById('countLow').textContent = counts.low;
}

// Update active filters display
function updateActiveFilters() {
  const container = document.getElementById('activeFilters');
  if (!container) return;
  
  const tags = [];
  
  // Search filter
  if (searchQuery) {
    tags.push(`
      <span class="active-filter-tag">
        Search: "${searchQuery}"
        <button onclick="clearSearch()" aria-label="Clear search">×</button>
      </span>
    `);
  }
  
  // Endangered level filter
  if (currentFilter !== 'all') {
    const labels = {
      high: 'Endangered',
      medium: 'Vulnerable',
      low: 'Stable'
    };
    tags.push(`
      <span class="active-filter-tag">
        ${labels[currentFilter]}
        <button onclick="clearFilter()" aria-label="Clear filter">×</button>
      </span>
    `);
  }
  
  container.innerHTML = tags.join('');
}

// Display animals
function displayAnimals() {
  const container = document.getElementById('animalsGrid');
  const noResults = document.getElementById('noResults');
  
  if (!container || !noResults) return;
  
  if (filteredAnimals.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }
  
  noResults.classList.add('hidden');
  
  container.innerHTML = filteredAnimals.map(animal => `
    <article class="animal-card" data-animal-id="${animal.id}">
      <div class="animal-card-image">
        ${createImageWithSrcset(
          animal.image, 
          animal.name, 
          '', 
          'lazy'
        ).replace('<img ', `<img onerror="this.src='https://via.placeholder.com/400x300/2d5016/ffffff?text=${encodeURIComponent(animal.name)}'" `)}
        ${getEndangeredBadge(animal.endangeredLevel)}
      </div>
      <div class="animal-card-content">
        <h3 class="animal-card-title">${animal.name}</h3>
        <p class="animal-card-subtitle">${animal.scientificName}</p>
        <p class="animal-card-description">${animal.description}</p>
        
        <div class="animal-card-info">
          <div class="animal-card-info-item">
            <span>🏡</span>
            <span>${animal.habitat}</span>
          </div>
          <div class="animal-card-info-item">
            <span>🍽️</span>
            <span>${animal.diet}</span>
          </div>
        </div>
        
        <div class="animal-card-footer">
          <span class="animal-card-location">
            <span>📍</span>
            <span>${animal.location.area}</span>
          </span>
          <button class="favourite-btn ${isFavourite(animal.id) ? 'active' : ''}" 
                  data-animal-id="${animal.id}" 
                  aria-label="Add to favourites">
            ${isFavourite(animal.id) ? '⭐' : '☆'}
          </button>
        </div>
      </div>
    </article>
  `).join('');
  
  // Add event listeners
  setupAnimalCardListeners();
  setupFavouriteButtons();
}

// Get endangered level badge
function getEndangeredBadge(level) {
  if (!level) return '';
  
  const badges = {
    high: '<span class="animal-card-badge">Endangered</span>',
    medium: '<span class="animal-card-badge medium">Vulnerable</span>',
    low: '<span class="animal-card-badge low">Stable</span>'
  };
  
  return badges[level] || '';
}

// Check if animal is in favourites
function isFavourite(animalId) {
  const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
  return favourites.includes(animalId);
}

// Setup animal card click listeners
function setupAnimalCardListeners() {
  const cards = document.querySelectorAll('.animal-card');
  
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking favourite button
      if (e.target.closest('.favourite-btn')) return;
      
      const animalId = card.getAttribute('data-animal-id');
      window.location.href = `animal-details.html?id=${animalId}`;
    });
  });
}

// Setup favourite button listeners
function setupFavouriteButtons() {
  const buttons = document.querySelectorAll('.favourite-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavourite(button);
    });
  });
}

// Toggle favourite status
function toggleFavourite(button) {
  const animalId = parseInt(button.getAttribute('data-animal-id'));
  const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
  
  if (favourites.includes(animalId)) {
    const index = favourites.indexOf(animalId);
    favourites.splice(index, 1);
    button.textContent = '☆';
    button.classList.remove('active');
  } else {
    favourites.push(animalId);
    button.textContent = '⭐';
    button.classList.add('active');
    showNotification('Added to favourites!');
  }
  
  localStorage.setItem('favourites', JSON.stringify(favourites));
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

// Global functions for clearing filters (called from HTML)
window.clearSearch = function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
    searchQuery = '';
    applyFiltersAndSort();
    displayAnimals();
    updateActiveFilters();
  }
};

window.clearFilter = function() {
  currentFilter = 'all';
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
  });
  applyFiltersAndSort();
  displayAnimals();
  updateActiveFilters();
};

window.clearFilters = function() {
  window.clearSearch();
  window.clearFilter();
};
