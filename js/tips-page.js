// ========================================
// TIPS-PAGE.JS - Interactive Tips Page for Children
// ======================================== */

let completedTips = [];

// Initialize tips page
document.addEventListener('DOMContentLoaded', () => {
  loadCompletedTips();
  setupTipButtons();
  updateAchievements();
});

// Load completed tips from localStorage
function loadCompletedTips() {
  completedTips = JSON.parse(localStorage.getItem('completedTips') || '[]');
  
  // Mark completed buttons
  completedTips.forEach(index => {
    const buttons = document.querySelectorAll('.tip-btn');
    if (buttons[index]) {
      buttons[index].classList.add('completed');
      buttons[index].textContent = 'Done! ✓';
    }
  });
}

// Setup tip button listeners
function setupTipButtons() {
  const buttons = document.querySelectorAll('.tip-btn');
  
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      toggleTip(button, index);
    });
  });
}

// Toggle tip completion
function toggleTip(button, index) {
  if (completedTips.includes(index)) {
    // Uncomplete
    completedTips = completedTips.filter(i => i !== index);
    button.classList.remove('completed');
    button.textContent = 'I did this! ✓';
  } else {
    // Complete
    completedTips.push(index);
    button.classList.add('completed');
    button.textContent = 'Done! ✓';
    
    // Celebrate!
    celebrate(button);
  }
  
  // Save to localStorage
  localStorage.setItem('completedTips', JSON.stringify(completedTips));
  
  // Update achievements
  updateAchievements();
}

// Celebrate completion with animation
function celebrate(button) {
  // Create confetti effect
  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  for (let i = 0; i < 10; i++) {
    createConfetti(x, y);
  }
  
  // Play sound (if available)
  playSuccessSound();
  
  // Show message
  showMessage('🎉 Great job! 🎉');
}

// Create confetti particle
function createConfetti(x, y) {
  const confetti = document.createElement('div');
  const colors = ['#ff9800', '#4caf50', '#2196f3', '#9c27b0', '#ffeb3b'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  confetti.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 10px;
    height: 10px;
    background-color: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
  `;
  
  document.body.appendChild(confetti);
  
  // Animate confetti
  const angle = Math.random() * Math.PI * 2;
  const velocity = 200 + Math.random() * 200;
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity - 200;
  
  let currentX = 0;
  let currentY = 0;
  let currentVy = vy;
  let opacity = 1;
  
  const animate = () => {
    currentX += vx * 0.01;
    currentY += currentVy * 0.01;
    currentVy += 20; // Gravity
    opacity -= 0.01;
    
    confetti.style.transform = `translate(${currentX}px, ${currentY}px)`;
    confetti.style.opacity = opacity;
    
    if (opacity > 0) {
      requestAnimationFrame(animate);
    } else {
      confetti.remove();
    }
  };
  
  animate();
}

// Play success sound
function playSuccessSound() {
  // Create a simple beep using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    // Silently fail if audio not supported
    console.log('Audio not supported');
  }
}

// Show success message
function showMessage(message) {
  const messageEl = document.createElement('div');
  messageEl.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    color: white;
    padding: 2rem 3rem;
    border-radius: 20px;
    font-size: 2rem;
    font-weight: bold;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    text-align: center;
    animation: popIn 0.5s ease forwards;
  `;
  messageEl.textContent = message;
  
  document.body.appendChild(messageEl);
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes popIn {
      0% { transform: translate(-50%, -50%) scale(0); }
      50% { transform: translate(-50%, -50%) scale(1.2); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    messageEl.style.animation = 'popIn 0.5s ease reverse';
    setTimeout(() => messageEl.remove(), 500);
  }, 1500);
}

// Update achievements
function updateAchievements() {
  const totalTips = document.querySelectorAll('.tip-btn').length;
  const completed = completedTips.length;
  const percentage = (completed / totalTips) * 100;
  
  const achievementText = document.getElementById('achievementText');
  const achievementStars = document.getElementById('achievementStars');
  
  if (!achievementText || !achievementStars) return;
  
  // Update text
  if (completed === 0) {
    achievementText.textContent = 'Start doing tips to become a Wildlife Hero!';
    achievementStars.textContent = '☆☆☆☆☆';
  } else if (completed < totalTips / 4) {
    achievementText.textContent = `Great start! You've completed ${completed} tips!`;
    achievementStars.textContent = '⭐☆☆☆☆';
  } else if (completed < totalTips / 2) {
    achievementText.textContent = `Good job! You're helping wildlife! ${completed} tips done!`;
    achievementStars.textContent = '⭐⭐☆☆☆';
  } else if (completed < (totalTips * 3) / 4) {
    achievementText.textContent = `Amazing work! Keep it up! ${completed} tips completed!`;
    achievementStars.textContent = '⭐⭐⭐☆☆';
  } else if (completed < totalTips) {
    achievementText.textContent = `Almost there! You're a real hero! ${completed}/${totalTips} tips!`;
    achievementStars.textContent = '⭐⭐⭐⭐☆';
  } else {
    achievementText.textContent = `WOW! You completed ALL tips! You're a SUPER Wildlife Hero!`;
    achievementStars.textContent = '⭐⭐⭐⭐⭐';
    
    // Show special celebration
    if (localStorage.getItem('celebratedAllTips') !== 'true') {
      showAllCompleteCelebration();
      localStorage.setItem('celebratedAllTips', 'true');
    }
  }
}

// Show special celebration for completing all tips
function showAllCompleteCelebration() {
  const celebration = document.createElement('div');
  celebration.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(156, 39, 176, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.5s ease;
  `;
  
  celebration.innerHTML = `
    <div style="text-align: center; color: white; padding: 2rem;">
      <div style="font-size: 8rem; margin-bottom: 1rem;">🏆</div>
      <h2 style="font-size: 3rem; margin-bottom: 1rem; color: white;">CONGRATULATIONS!</h2>
      <p style="font-size: 2rem; margin-bottom: 2rem;">You're a SUPER Wildlife Hero!</p>
      <p style="font-size: 1.5rem; margin-bottom: 2rem;">You completed all tips! 🎉</p>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="padding: 1rem 2rem; font-size: 1.5rem; background: white; 
                     color: #9c27b0; border: none; border-radius: 50px; 
                     cursor: pointer; font-weight: bold;">
        Thank you! ✨
      </button>
    </div>
  `;
  
  document.body.appendChild(celebration);
  
  // Create lots of confetti
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      createConfetti(
        window.innerWidth * Math.random(),
        window.innerHeight * Math.random()
      );
    }, i * 100);
  }
}
