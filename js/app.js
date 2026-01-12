// ========================================
// APP.JS - Main Application Initialization
// ========================================

import { initBatteryStatus } from './battery-status.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('🦊 British Wildlife Centre App Initialized');
  
  // Set the current page data attribute for navigation styling
  setCurrentPage();
  
  // Initialize battery status indicator
  initBatteryStatus();
  
  // Initialize service worker if supported
  if ('serviceWorker' in navigator) {
    registerServiceWorker();
  }
  
  // Check for updates
  checkForUpdates();
});

// Set current page identifier
function setCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';
  const pageName = page === 'index' ? 'home' : page;
  document.body.setAttribute('data-page', pageName);
}

// Register service worker for PWA functionality
async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('✅ Service Worker registered:', registration.scope);
    
    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          showUpdateNotification();
        }
      });
    });
  } catch (error) {
    console.warn('⚠️ Service Worker registration failed:', error);
  }
}

// Show update notification
function showUpdateNotification() {
  const updateBanner = document.createElement('div');
  updateBanner.className = 'update-banner';
  updateBanner.innerHTML = `
    <div class="update-banner-content">
      <p>🎉 New version available!</p>
      <button class="btn btn-sm btn-primary" onclick="location.reload()">Update Now</button>
      <button class="btn btn-sm" onclick="this.parentElement.parentElement.remove()">Later</button>
    </div>
  `;
  document.body.appendChild(updateBanner);
}

// Check for app updates
function checkForUpdates() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
  }
}

// Set active navigation link
export function setActiveNav(currentPath) {
  // Bottom navigation
  const bottomNavLinks = document.querySelectorAll('.bottom-nav-item');
  bottomNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
  
  // Main navigation
  const mainNavLinks = document.querySelectorAll('.nav-link');
  mainNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

// Utility: Format date
export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

// Utility: Format time
export function formatTime(timeString) {
  return timeString;
}

// Utility: Show loading state
export function showLoading(container) {
  container.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <div class="loading"></div>
      <p style="margin-top: 1rem; color: var(--color-text-muted);">Loading...</p>
    </div>
  `;
}

// Utility: Show error message
export function showError(container, message) {
  container.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <p style="color: var(--color-danger); font-size: 1.2rem;">❌ ${message}</p>
    </div>
  `;
}

// Utility: Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for use in other modules
export default {
  setActiveNav,
  formatDate,
  formatTime,
  showLoading,
  showError,
  debounce
};
