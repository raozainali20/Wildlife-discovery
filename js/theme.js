// ========================================
// THEME.JS - Light/Dark Mode Toggle
// System preference detection + manual toggle
// ========================================

// Theme configuration
const THEME_KEY = 'wildlife-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  setupThemeToggle();
});

// Initialize theme based on saved preference or system preference
function initializeTheme() {
  const savedTheme = getSavedTheme();
  const systemTheme = getSystemTheme();
  const theme = savedTheme || systemTheme;
  
  applyTheme(theme);
  console.log(`🎨 Theme initialized: ${theme}`);
}

// Get saved theme from localStorage
function getSavedTheme() {
  return localStorage.getItem(THEME_KEY);
}

// Get system color scheme preference
function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEME_DARK;
  }
  return THEME_LIGHT;
}

// Apply theme to document
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeToggleIcon(theme);
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === THEME_DARK ? '#121212' : '#2d5016');
  }
}

// Save theme preference
function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

// Toggle between light and dark themes
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
  
  applyTheme(newTheme);
  saveTheme(newTheme);
  
  console.log(`🎨 Theme switched to: ${newTheme}`);
}

// Update theme toggle button icon
function updateThemeToggleIcon(theme) {
  const lightIcon = document.querySelector('.theme-icon-light');
  const darkIcon = document.querySelector('.theme-icon-dark');
  
  if (theme === THEME_DARK) {
    if (lightIcon) lightIcon.style.opacity = '0';
    if (darkIcon) darkIcon.style.opacity = '1';
  } else {
    if (lightIcon) lightIcon.style.opacity = '1';
    if (darkIcon) darkIcon.style.opacity = '0';
  }
}

// Setup theme toggle button
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

// Listen for system theme changes
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!getSavedTheme()) {
      const newTheme = e.matches ? THEME_DARK : THEME_LIGHT;
      applyTheme(newTheme);
      console.log(`🎨 System theme changed to: ${newTheme}`);
    }
  });
}

// Export functions for use in other modules
export {
  initializeTheme,
  toggleTheme,
  applyTheme,
  getSavedTheme,
  getSystemTheme
};
