// Data Models
const destinations = [
  { id: 1, name: 'Kyoto, Japan', region: 'Asia', desc: 'Serene bamboo forests, ancient shrines, and rich culinary heritage.' },
  { id: 2, name: 'Reykjavik, Iceland', region: 'Europe', desc: 'Geothermal hot springs, glaciers, and stunning displays of aurora borealis.' },
  { id: 3, name: 'Cape Town, South Africa', region: 'Africa', desc: 'Towering ocean cliffs, Table Mountain vistas, and coastal wildlife.' },
  { id: 4, name: 'Chiang Mai, Thailand', region: 'Asia', desc: 'Misty mountain sanctuaries, lantern celebrations, and street food markets.' },
  { id: 5, name: 'Swiss Alps, Switzerland', region: 'Europe', desc: 'Charming alpine chalets, world-class slopes, and glacial railways.' },
  { id: 6, name: 'Serengeti, Tanzania', region: 'Africa', desc: 'Classic safari plains, extraordinary biodiversity, and vast sunrises.' }
];

let savedDestinations = new Set();
let checklist = JSON.parse(localStorage.getItem('tn_items')) || [
  { text: 'Valid Passport / ID', done: true },
  { text: 'Universal Power Adapter', done: false },
  { text: 'Travel Insurance Documents', done: false }
];

// Elements
const grid = document.getElementById('destinations-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const savedBadge = document.getElementById('saved-count');

// Render Destinations
function renderCards(filter = 'all') {
  grid.innerHTML = '';
  const filtered = filter === 'all' 
    ? destinations 
    : destinations.filter(d => d.region === filter);

  filtered.forEach(item => {
    const isSaved = savedDestinations.has(item.id);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <span class="card-region">${item.region}</span>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
      <div class="card-footer">
        <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(${item.id})">
          ${isSaved ? '★ Bookmarked' : '☆ Save'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Bookmark Feature
window.toggleSave = function(id) {
  if (savedDestinations.has(id)) {
    savedDestinations.delete(id);
  } else {
    savedDestinations.add(id);
  }
  savedBadge.innerText = `${savedDestinations.size} Saved`;
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  renderCards(activeFilter);
};

// Filter Controls
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards(btn.dataset.filter);
  });
});

// Real-Time Budget Estimator
const daysSlider = document.getElementById('days-slider');
const travelersSlider = document.getElementById('travelers-slider');
const tierSelect = document.getElementById('tier-select');
const daysVal = document.getElementById('days-val');
const travelersVal = document.getElementById('travelers-val');
const totalCost = document.getElementById('total-cost');

function updateBudget() {
  const days = parseInt(daysSlider.value);
  const people = parseInt(travelersSlider.value);
  const costPerDay = parseInt(tierSelect.value);

  daysVal.innerText = days;
  travelersVal.innerText = people;

  const total = days * people * costPerDay;
  totalCost.innerText = `$${total.toLocaleString()}`;
}

[daysSlider, travelersSlider, tierSelect].forEach(input => {
  input.addEventListener('input', updateBudget);
});

// Interactive Checklist with LocalStorage
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemsList = document.getElementById('items-list');

function renderChecklist() {
  itemsList.innerHTML = '';
  checklist.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = item.done ? 'done' : '';
    li.innerHTML = `
      <span onclick="toggleItem(${index})" style="cursor: pointer;">
        ${item.done ? '✔ ' : '○ '} ${item.text}
      </span>
      <button class="delete-btn" onclick="deleteItem(${index})">✕</button>
    `;
    itemsList.appendChild(li);
  });
  localStorage.setItem('tn_items', JSON.stringify(checklist));
}

itemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!itemInput.value.trim()) return;
  checklist.push({ text: itemInput.value.trim(), done: false });
  itemInput.value = '';
  renderChecklist();
});

window.toggleItem = function(index) {
  checklist[index].done = !checklist[index].done;
  renderChecklist();
};

window.deleteItem = function(index) {
  checklist.splice(index, 1);
  renderChecklist();
};

// Initial calls
renderCards();
updateBudget();
renderChecklist();