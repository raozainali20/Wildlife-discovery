// ========================================
// BATTERY-STATUS.JS - Battery Status API Implementation
// ========================================

let battery = null;

// Initialize battery status
export async function initBatteryStatus() {
  if (!('getBattery' in navigator)) {
    console.log('Battery Status API not supported');
    return;
  }

  try {
    battery = await navigator.getBattery();
    
    // Create battery indicator
    createBatteryIndicator();
    
    // Update initial state
    updateBatteryDisplay();
    
    // Listen for changes
    battery.addEventListener('levelchange', updateBatteryDisplay);
    battery.addEventListener('chargingchange', updateBatteryDisplay);
    battery.addEventListener('chargingtimechange', updateBatteryDisplay);
    battery.addEventListener('dischargingtimechange', updateBatteryDisplay);
    
  } catch (error) {
    console.error('Error accessing battery status:', error);
  }
}

// Create battery indicator in header
function createBatteryIndicator() {
  const headerControls = document.querySelector('.header-controls');
  if (!headerControls) return;

  const batteryEl = document.createElement('div');
  batteryEl.id = 'batteryStatus';
  batteryEl.className = 'battery-status';
  batteryEl.setAttribute('role', 'status');
  batteryEl.setAttribute('aria-live', 'polite');
  
  // Insert before theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    headerControls.insertBefore(batteryEl, themeToggle);
  } else {
    headerControls.appendChild(batteryEl);
  }
}

// Update battery display
function updateBatteryDisplay() {
  if (!battery) return;

  const batteryEl = document.getElementById('batteryStatus');
  if (!batteryEl) return;

  const level = Math.floor(battery.level * 100);
  const charging = battery.charging;
  
  // Determine battery icon
  let icon = '';
  if (charging) {
    icon = '🔌';
  } else if (level > 80) {
    icon = '🔋';
  } else if (level > 50) {
    icon = '🔋';
  } else if (level > 20) {
    icon = '🪫';
  } else {
    icon = '🪫';
  }
  
  // Determine color class
  let colorClass = '';
  if (charging) {
    colorClass = 'battery-charging';
  } else if (level <= 20) {
    colorClass = 'battery-low';
  } else if (level <= 50) {
    colorClass = 'battery-medium';
  } else {
    colorClass = 'battery-high';
  }
  
  // Update display
  batteryEl.className = `battery-status ${colorClass}`;
  batteryEl.innerHTML = `
    <span class="battery-icon" title="${charging ? 'Charging' : 'Battery'}">${icon}</span>
    <span class="battery-level">${level}%</span>
  `;
  
  // Update aria-label for accessibility
  batteryEl.setAttribute('aria-label', 
    `Battery ${level}% ${charging ? 'and charging' : ''}`
  );
  
  // Show low battery warning
  if (!charging && level <= 10 && !localStorage.getItem('lowBatteryWarningShown')) {
    showLowBatteryWarning(level);
    localStorage.setItem('lowBatteryWarningShown', 'true');
  }
  
  // Reset warning flag when charging or level increases
  if (charging || level > 15) {
    localStorage.removeItem('lowBatteryWarningShown');
  }
}

// Show low battery warning
function showLowBatteryWarning(level) {
  const warning = document.createElement('div');
  warning.className = 'battery-warning';
  warning.innerHTML = `
    <div class="warning-content">
      <span class="warning-icon">⚠️</span>
      <p>Low battery (${level}%). Please charge your device to continue using all features.</p>
      <button class="warning-close">OK</button>
    </div>
  `;
  
  document.body.appendChild(warning);
  
  // Close button
  warning.querySelector('.warning-close').addEventListener('click', () => {
    warning.remove();
  });
  
  // Auto close after 10 seconds
  setTimeout(() => {
    if (warning.parentElement) {
      warning.remove();
    }
  }, 10000);
}

// Add CSS for battery indicator
const style = document.createElement('style');
style.textContent = `
  .battery-status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .battery-icon {
    font-size: 1.25rem;
    line-height: 1;
  }
  
  .battery-level {
    font-variant-numeric: tabular-nums;
  }
  
  .battery-high {
    color: var(--success-color);
    background: rgba(76, 175, 80, 0.1);
  }
  
  .battery-medium {
    color: var(--warning-color);
    background: rgba(255, 152, 0, 0.1);
  }
  
  .battery-low {
    color: var(--danger-color);
    background: rgba(244, 67, 54, 0.1);
    animation: batteryPulse 2s ease infinite;
  }
  
  .battery-charging {
    color: var(--info-color);
    background: rgba(33, 150, 243, 0.1);
  }
  
  @keyframes batteryPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  /* Low Battery Warning */
  .battery-warning {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  }
  
  .warning-content {
    background: var(--bg-primary);
    padding: var(--spacing-2xl);
    border-radius: var(--radius-lg);
    max-width: 400px;
    text-align: center;
    box-shadow: var(--shadow-xl);
  }
  
  .warning-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: var(--spacing-md);
  }
  
  .warning-content p {
    margin-bottom: var(--spacing-lg);
    color: var(--text-primary);
  }
  
  .warning-close {
    padding: 0.75rem 2rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .warning-close:hover {
    background: var(--primary-hover);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .battery-status {
      font-size: 0.75rem;
      padding: 0.25rem 0.375rem;
    }
    
    .battery-icon {
      font-size: 1rem;
    }
  }
`;
document.head.appendChild(style);
