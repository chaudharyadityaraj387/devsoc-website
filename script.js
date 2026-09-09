// Data Models with High-Quality Image URLs and INR Pricing
const destinations = [
  {
    id: 1,
    name: 'Ladakh, India',
    category: 'India',
    desc: 'Breathtaking mountain passes, crystal-clear high altitude lakes, and Buddhist monasteries.',
    estCost: '₹35,000 / week',
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Goa Beaches, India',
    category: 'India',
    desc: 'Golden sands, vibrant flea markets, coastal cuisine, and scenic beach sunsets.',
    estCost: '₹22,000 / week',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Kerala Backwaters, India',
    category: 'India',
    desc: 'Peaceful houseboat cruises through palm-fringed canals, spice plantations, and lagoons.',
    estCost: '₹28,000 / week',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Kyoto, Japan',
    category: 'International',
    desc: 'Historic pagodas, tranquil bamboo groves, traditional tea houses, and shrines.',
    estCost: '₹1,20,000 / week',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'Swiss Alps, Switzerland',
    category: 'International',
    desc: 'Snow-capped peaks, scenic glacial trains, pristine lakes, and alpine chalets.',
    estCost: '₹1,80,000 / week',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    name: 'Bali, Indonesia',
    category: 'International',
    desc: 'Lush terraced rice paddies, cliffside temples, surfing beaches, and volcanic hills.',
    estCost: '₹75,000 / week',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
  }
];

let savedDestinations = new Set();
let checklist = JSON.parse(localStorage.getItem('tn_items_inr')) || [
  { text: 'Aadhaar Card / Passport', done: true },
  { text: 'Power Bank & Charger', done: false },
  { text: 'UPI / Travel Cards Activated', done: false }
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
    : destinations.filter(d => d.category === filter);

  filtered.forEach(item => {
    const isSaved = savedDestinations.has(item.id);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-image-box">
        <img src="${item.imageUrl}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="card-body">
        <div>
          <span class="card-region">${item.category}</span>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
        </div>
        <div class="card-footer">
          <span class="card-cost">${item.estCost}</span>
          <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(${item.id})">
            ${isSaved ? '★ Bookmarked' : '☆ Save'}
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Bookmark Functionality
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

// Filter Buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards(btn.dataset.filter);
  });
});

// Real-Time Budget Estimator (INR formatted)
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
  totalCost.innerText = `₹${total.toLocaleString('en-IN')}`;
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
  localStorage.setItem('tn_items_inr', JSON.stringify(checklist));
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