let map;
const BASE_URL = window.location.href;
let markers = [];
let activities;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.7041, lng: 77.1025 },
    zoom: 1
  });
  setTimeout(() => {}, 100);
};

axios.get(`${BASE_URL}activities`).then(res => {
    activities = res.data;
    for (let i = 0; i < 2; i++) {
      zoomIn(map);
    }
  })
  .then(_ => {
    addMarkersToArray();
    hideMarkers();
  })
  .catch(err => console.log(err))

setTimeout(_ =>
  document.querySelector('.dismissButton').click(), 1500);

const refreshMap = async () => {
  const res = await axios.get(`${BASE_URL}activities`)
  activities = res.data;
  addMarkersToArray();
  map.panTo(markers[markers.length - 1].getPosition());
};


const addMarkersToArray = () => {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
  activities.forEach(activity => {
    const { coordinates } = activity.camera.location;
    const { personCount } = activity;
    const position = { lat: coordinates[0], lng: coordinates[1] };
    const marker = new google.maps.Marker({
      title: `person count: ${personCount}`,
      position,
      map
    });
    google.maps.event.addListener(marker, 'click', () => {
      // Add image on side..
      zoomIn(map);
      map.setCenter(marker.getPosition());
    });
    markers.push(marker)
  });
}

const zoomIn = (map) => {
  const zoomLevel = map.getZoom();
  zoomLevel < 22
    ? map.setZoom(zoomLevel + 2)
    : map.setZoom(21);
}

const showMarkers = () => {
  markers.forEach(marker => {
    marker.setMap(map);
  });
  // map.panTo(markers[markers.length - 1].getPosition());
  // map.setZoom(7);
}

const hideMarkers = () => {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

const refreshBtn = document.querySelector('#refresh');
refreshBtn.addEventListener('click', refreshMap);

const showMarkersBtn = document.querySelector('#show');
showMarkersBtn.addEventListener('click', showMarkers);

const hideMarkersBtn = document.querySelector('#hide');
hideMarkersBtn.addEventListener('click', hideMarkers);
