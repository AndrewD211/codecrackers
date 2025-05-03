// Toggle Side Menu
function toggleMenu() {
  const menu = document.getElementById("side-menu");
  const body = document.body;
  if (menu.style.width === "250px") {
    menu.style.width = "0";
    body.classList.remove("menu-open");
  } else {
    menu.style.width = "250px";
    body.classList.add("menu-open");
  }
}

// Dynamic Section Display Logic
let currentSectionId = (document.querySelector('.section.active') || {}).id || null;

function showSection(id, clickedButton = null) {
  const contentPanel = document.querySelector('.content-panel');
  const sidebar = document.querySelector('.sidebar-nav');
  if (!contentPanel || !sidebar) return;

  const sections = document.querySelectorAll('.section');
  const buttons = sidebar.querySelectorAll('button');

  const nextSection = document.getElementById(id);
  if (!nextSection || id === currentSectionId) return;

  // Hide current section
  const currentSection = document.getElementById(currentSectionId);
  if (currentSection && currentSection !== nextSection) {
    currentSection.classList.remove('active');
    currentSection.style.display = 'none';
  }

  // Show next section
  nextSection.style.display = 'block';
  nextSection.classList.add('active');

  // Make sure panel resizes naturally
  contentPanel.style.height = 'auto';

  // Update active button state
  buttons.forEach(btn => btn.classList.remove('active'));
  if (clickedButton) clickedButton.classList.add('active');

  currentSectionId = id;
}


window.addEventListener('message', function(event) {
  if (event.data?.type === 'resize-iframe') {
    const iframe = document.getElementById('quiz-frame');
    if (iframe) {
      iframe.style.height = `${event.data.height}px`;
      console.log('↕️ Resizing iframe to', event.data.height);
    }
  }
});

function showHistoryEra(eraId, btn) {
  const allEras = document.querySelectorAll('.history-era');
  const allTabs = document.querySelectorAll('.history-tab');

  allEras.forEach(era => era.classList.remove('active'));
  allTabs.forEach(tab => tab.classList.remove('active'));

  document.getElementById(eraId).classList.add('active');
  btn.classList.add('active');

  // Smooth scroll to top of content panel for clarity
  const panel = document.querySelector('.content-panel');
  if (panel) {
    panel.scrollTo({ top: 0, behavior: 'smooth' });
    panel.style.height = 'auto'; // Maintain your original resize logic
  }
}

function showQuizTab(id, btn) {
  const panels = document.querySelectorAll('.quiz-panel');
  const tabs = document.querySelectorAll('.quiz-tab');

  panels.forEach(panel => panel.style.display = 'none');
  tabs.forEach(tab => tab.classList.remove('active'));

  const activePanel = document.getElementById(id);
  if (activePanel) {
    activePanel.style.display = 'block';
  }
  btn.classList.add('active');

  const contentPanel = document.querySelector('.content-panel');
  if (contentPanel) {
    contentPanel.style.height = 'auto';
  }
}

// Game Embed Logic
function loadGame(file) {
  const container = document.getElementById('game-container');
  container.style.display = 'block';
  container.innerHTML = `<iframe src="${file}" width="100%" height="600px" frameborder="0"></iframe>`;
}

// Carousel Setup
const buttons = document.querySelectorAll('.carousel-button');
let currentIndex = 0;
let hoverTimers = [];

function updateCarousel() {
  const total = buttons.length;
  buttons.forEach((btn, i) => {
    const diff = i - currentIndex;
    const offset = ((diff + total) % total);
    const adjusted = offset > total / 2 ? offset - total : offset;
    const rotation = adjusted * 120;
    btn.style.transform = `rotateY(${rotation}deg) translateZ(300px)`;
    btn.style.opacity = (adjusted === 0) ? '1' : '0.5';
    btn.style.zIndex = (adjusted === 0) ? 2 : 1;
  });
}

buttons.forEach((btn, i) => {
  btn.addEventListener('mouseenter', () => {
    if (i !== currentIndex) {
      hoverTimers[i] = setTimeout(() => {
        currentIndex = i;
        updateCarousel();
      }, 400);
    }
  });

  btn.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimers[i]);
  });

  btn.addEventListener('click', () => {
    if (i === currentIndex) {
      window.location.href = btn.getAttribute('data-url');
    }
  });
});

updateCarousel();

// Caesar Cipher Tool
function runCaesar() {
  const mode = document.getElementById('caesar-mode').value;
  const input = document.getElementById('caesar-input').value.toUpperCase();
  let shift = parseInt(document.getElementById('caesar-shift').value);
  if (mode === 'decrypt') shift = 26 - shift;

  let result = '';
  for (let char of input) {
    if (char >= 'A' && char <= 'Z') {
      const code = ((char.charCodeAt(0) - 65 + shift) % 26) + 65;
      result += String.fromCharCode(code);
    } else {
      result += char;
    }
  }

  document.getElementById('caesar-output').innerText = result;
}

// Substitution Cipher Tool
function generateRandomMap() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const shuffled = [...alphabet];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const mapText = alphabet.map((letter, i) => `${letter}→${shuffled[i]}`).join(', ');
  document.getElementById('sub-map').value = mapText;
}

function parseMapping(input) {
  const map = {};
  const entries = input.toUpperCase().split(',').map(p => p.trim());
  for (const pair of entries) {
    const [from, to] = pair.replace('→', '->').split('->').map(c => c.trim());
    if (from && to && from.length === 1 && to.length === 1) {
      map[from] = to;
    }
  }
  return map;
}

function runSubstitution() {
  const message = document.getElementById('sub-input').value.toUpperCase();
  const mode = document.getElementById('sub-mode').value;
  const map = parseMapping(document.getElementById('sub-map').value);
  let output = '';

  if (mode === 'decrypt') {
    const reversed = {};
    for (const key in map) reversed[map[key]] = key;
    for (const char of message) {
      output += reversed[char] || char;
    }
  } else {
    for (const char of message) {
      output += map[char] || char;
    }
  }

  document.getElementById('sub-output').innerText = output;
}

window.addEventListener('DOMContentLoaded', generateRandomMap);

// Vigenère Cipher Tool
function runVigenere() {
  const message = document.getElementById('vig-input').value.toUpperCase().replace(/[^A-Z]/g, '');
  const keyword = document.getElementById('vig-keyword').value.toUpperCase().replace(/[^A-Z]/g, '');
  const mode = document.getElementById('vig-mode').value;
  let output = '';
  if (!keyword.length) {
    document.getElementById('vig-output').innerText = 'Please enter a keyword.';
    return;
  }

  for (let i = 0, j = 0; i < message.length; i++) {
    const msgChar = message.charCodeAt(i) - 65;
    const keyChar = keyword.charCodeAt(j % keyword.length) - 65;
    let newChar;
    if (mode === 'encrypt') {
      newChar = (msgChar + keyChar) % 26;
    } else {
      newChar = (msgChar - keyChar + 26) % 26;
    }
    output += String.fromCharCode(newChar + 65);
    j++;
  }

  document.getElementById('vig-output').innerText = output;
  document.querySelector('.content-panel').style.height = 'auto'; // dynamically resize
}

// Dark Mode 
// Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Toggle Settings Dropdown
function toggleSettingsMenu() {
  const menu = document.getElementById("settingsDropdown");
  menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
}

// Run on page load
window.onload = function () {
  // Restore dark mode if saved
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Auto-inject settings menu
  const settingsContainer = document.createElement('div');
  settingsContainer.className = 'settings-menu';
  settingsContainer.innerHTML = `
    <button onclick="toggleSettingsMenu()">⚙️</button>
    <div class="settings-dropdown" id="settingsDropdown">
      <label><input type="checkbox" id="darkModeToggle"> Dark Mode</label>
    </div>
  `;

  document.body.appendChild(settingsContainer);

  // Hook up checkbox toggle
  const checkbox = settingsContainer.querySelector('#darkModeToggle');
  checkbox.checked = document.body.classList.contains('dark-mode');
  checkbox.addEventListener('change', toggleDarkMode);
};
