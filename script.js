// === 1️⃣ Εμφάνιση χάρτη με βασικό layer ===
const map = L.map('map').setView([35.3387, 25.1442], 10); // Κρήτη
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// === 2️⃣ Προσθήκη νέας τοποθεσίας (Ηράκλειο) ===
const heraklionIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

L.marker([35.3387, 25.1442], { icon: heraklionIcon })
  .addTo(map)
  .bindPopup("<b>Ηράκλειο</b><br>Πρωτεύουσα της Κρήτης και σημείο αναφοράς του έργου.");

// === 3️⃣ Προσθήκη περιοχής (πολύγωνο Αρχάνες) ===
const archanesCoords = [
  [35.250, 25.131],
  [35.257, 25.156],
  [35.242, 25.169],
  [35.235, 25.146]
];
L.polygon(archanesCoords, {
  color: '#e74c3c',
  fillColor: '#ff7675',
  fillOpacity: 0.3
})
.addTo(map)
.bindPopup("<b>Αρχάνες</b><br>Αγροτική περιοχή με έντονη δραστηριότητα και ευαισθησία σε πυρκαγιές.");

// === 4️⃣ Εντοπισμός θέσης χρήστη ===
function onLocationFound(e) {
  const radius = e.accuracy / 2;
  const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
  L.marker(e.latlng, { icon: userIcon })
    .addTo(map)
    .bindPopup("Η θέση μου (" + radius.toFixed(0) + " m ακρίβεια)")
    .openPopup();
  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

L.control.locate = function() {
  const locateBtn = L.control({ position: 'topright' });
  locateBtn.onAdd = function() {
    const btn = L.DomUtil.create('button', 'leaflet-bar');
    btn.innerHTML = '📍';
    btn.title = 'Εντοπισμός θέσης';
    btn.style.cursor = 'pointer';
    btn.onclick = () => map.locate({ setView: true, maxZoom: 13 });
    return btn;
  };
  return locateBtn;
};
L.control.locate().addTo(map);

// === 5️⃣ Εμφάνιση μόνο κοντινών σημείων (spatial awareness) ===
const points = [
  { name: "Ηράκλειο", lat: 35.3387, lng: 25.1442 },
  { name: "Αρχάνες", lat: 35.243, lng: 25.155 },
  { name: "Βιάννος", lat: 35.031, lng: 25.427 }
];

function showNearby(lat, lng, radiusKm) {
  L.layerGroup().addTo(map);
  points.forEach(p => {
    const distance = getDistanceKm(lat, lng, p.lat, p.lng);
    if (distance <= radiusKm) {
      L.circleMarker([p.lat, p.lng], { radius: 7, color: '#2ecc71' })
        .addTo(map)
        .bindPopup(`<b>${p.name}</b><br>Απόσταση: ${distance.toFixed(1)} km`);
    }
  });
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Για δοκιμή spatial awareness:
showNearby(35.3387, 25.1442, 20); // 20km γύρω από Ηράκλειο
