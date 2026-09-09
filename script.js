const places = ['Tokyo, Japan', 'Reykjavik, Iceland', 'Zurich, Switzerland', 'Bali, Indonesia', 'Cape Town, South Africa'];

document.getElementById('explore-btn').addEventListener('click', () => {
  const randomPlace = places[Math.floor(Math.random() * places.length)];
  document.getElementById('suggestion').innerText = `Pack your bags for: ${randomPlace}! ✈️`;
});