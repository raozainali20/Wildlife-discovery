// ========================================
// HOME.JS - Home Page Functionality
// Load featured animals and upcoming events
// ========================================

import { formatDate, formatTime, showLoading, showError } from './app.js';
import { createImageWithSrcset } from './responsive-images.js';

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedAnimals();
  loadUpcomingEvents();
});

// Load featured animals (first 4 from animals.json)
async function loadFeaturedAnimals() {
  const container = document.getElementById('featuredAnimals');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const response = await fetch('data/animals.json');
    if (!response.ok) throw new Error('Failed to load animals');
    
    const animals = await response.json();
    const featured = animals.slice(0, 4); // Get first 4 animals
    
    displayFeaturedAnimals(featured, container);
  } catch (error) {
    console.error('Error loading animals:', error);
    showError(container, 'Failed to load animals. Please try again later.');
  }
}

// Display featured animals
function displayFeaturedAnimals(animals, container) {
  if (animals.length === 0) {
    container.innerHTML = '<p class="text-center text-muted">No animals to display.</p>';
    return;
  }
  
  container.innerHTML = animals.map(animal => `
    <article class="animal-card" data-animal-id="${animal.id}">
      <div class="animal-card-image">
        ${createImageWithSrcset(animal.image, animal.name, '', 'lazy').replace('<img ', `<img onerror="this.src='images/placeholder-animal.jpg'" `)}
        ${getEndangeredBadge(animal.endangeredLevel)}
      </div>
      <div class="animal-card-content">
        <h3 class="animal-card-title">${animal.name}</h3>
        <p class="animal-card-subtitle">${animal.scientificName}</p>
        <p class="animal-card-description">${animal.description}</p>
        <div class="animal-card-footer">
          <span class="animal-card-location">📍 ${animal.location.area}</span>
          <button class="favourite-btn" data-animal-id="${animal.id}" 
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
    // Remove from favourites
    const index = favourites.indexOf(animalId);
    favourites.splice(index, 1);
    button.textContent = '☆';
    button.classList.remove('active');
  } else {
    // Add to favourites
    favourites.push(animalId);
    button.textContent = '⭐';
    button.classList.add('active');
    
    // Show feedback
    showFavouriteNotification('Added to favourites!');
  }
  
  localStorage.setItem('favourites', JSON.stringify(favourites));
}

// Show favourite notification
function showFavouriteNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'favourite-notification';
  notification.textContent = message;
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
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 2000);
}

// Load upcoming events (next 3 events)
async function loadUpcomingEvents() {
  const container = document.getElementById('upcomingEvents');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const response = await fetch('data/events.json');
    if (!response.ok) throw new Error('Failed to load events');
    
    const events = await response.json();
    
    // Filter future events and get first 3
    const today = new Date();
    const upcomingEvents = events
      .filter(event => new Date(event.date) >= today)
      .slice(0, 3);
    
    displayUpcomingEvents(upcomingEvents, container);
  } catch (error) {
    console.error('Error loading events:', error);
    showError(container, 'Failed to load events. Please try again later.');
  }
}

// Display upcoming events
function displayUpcomingEvents(events, container) {
  if (events.length === 0) {
    container.innerHTML = '<p class="text-center text-muted">No upcoming events.</p>';
    return;
  }
  
  container.innerHTML = events.map(event => `
    <article class="event-card">
      <div class="event-icon">${event.icon || '📅'}</div>
      <div class="event-content">
        <span class="event-type ${event.type}">${event.type}</span>
        <h3 class="event-title">${event.title}</h3>
        <div class="event-meta">
          <span>📅 ${formatDate(event.date)}</span>
          <span>🕐 ${formatTime(event.time)}</span>
          <span>⏱️ ${event.duration}</span>
        </div>
        <p class="event-description">${event.description}</p>
      </div>
    </article>
  `).join('');
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
    20% { opacity: 1; transform: translateX(-50%) translateY(0); }
    80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  }
`;
document.head.appendChild(style);
