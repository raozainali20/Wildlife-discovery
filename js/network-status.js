// ========================================
// NETWORK-STATUS.JS - Network Connectivity Detection
// Monitors online/offline status
// ========================================

// Initialize network status monitoring
document.addEventListener('DOMContentLoaded', () => {
  initNetworkStatus();
  setupNetworkListeners();
});

// Initialize network status display
function initNetworkStatus() {
  const networkStatus = document.getElementById('networkStatus');
  
  if (networkStatus) {
    updateNetworkStatus(navigator.onLine);
  }
  
  console.log(`📡 Network Status: ${navigator.onLine ? 'Online' : 'Offline'}`);
}

// Update network status display
function updateNetworkStatus(isOnline) {
  const networkStatus = document.getElementById('networkStatus');
  
  if (!networkStatus) return;
  
  if (isOnline) {
    networkStatus.classList.remove('offline');
    networkStatus.setAttribute('title', 'Online');
    networkStatus.setAttribute('aria-label', 'Online');
  } else {
    networkStatus.classList.add('offline');
    networkStatus.setAttribute('title', 'Offline');
    networkStatus.setAttribute('aria-label', 'Offline');
    showOfflineNotification();
  }
}

// Setup event listeners for network changes
function setupNetworkListeners() {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Network Information API (experimental)
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
      logConnectionInfo(connection);
    }
  }
}

// Handle online event
function handleOnline() {
  console.log('📡 Network: Back online');
  updateNetworkStatus(true);
  showOnlineNotification();
}

// Handle offline event
function handleOffline() {
  console.log('📡 Network: Offline');
  updateNetworkStatus(false);
}

// Handle connection change (Network Information API)
function handleConnectionChange(event) {
  const connection = event.target;
  logConnectionInfo(connection);
}

// Log connection information
function logConnectionInfo(connection) {
  console.log('📡 Connection Info:', {
    effectiveType: connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
    downlink: connection.downlink, // Mbps
    rtt: connection.rtt, // ms
    saveData: connection.saveData // boolean
  });
}

// Show offline notification
function showOfflineNotification() {
  showNotification('📡 You are offline', 'Some features may not be available.', 'warning');
}

// Show online notification
function showOnlineNotification() {
  showNotification('📡 You are back online', 'All features are now available.', 'success');
}

// Generic notification function
function showNotification(title, message, type = 'info') {
  // Check if notification already exists
  const existingNotification = document.querySelector('.network-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `network-notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
    <button class="notification-close" aria-label="Close notification">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // Add styles dynamically
  addNotificationStyles();
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
  
  // Close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  });
}

// Add notification styles
function addNotificationStyles() {
  if (document.getElementById('notification-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    .network-notification {
      position: fixed;
      top: 80px;
      right: 20px;
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      padding: 1rem;
      max-width: 350px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      transition: opacity 0.3s ease;
    }
    
    .network-notification.notification-success {
      border-left: 4px solid var(--color-success);
    }
    
    .network-notification.notification-warning {
      border-left: 4px solid var(--color-warning);
    }
    
    .network-notification.notification-info {
      border-left: 4px solid var(--color-info);
    }
    
    .notification-content strong {
      display: block;
      margin-bottom: 0.25rem;
      color: var(--color-text);
    }
    
    .notification-content p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
    
    .notification-close {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 1;
    }
    
    .notification-close:hover {
      color: var(--color-text);
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @media (max-width: 640px) {
      .network-notification {
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Check network status (can be called from other modules)
export function isOnline() {
  return navigator.onLine;
}

// Get connection info (if available)
export function getConnectionInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  
  return null;
}

// Export functions
export default {
  isOnline,
  getConnectionInfo,
  showNotification
};
