var isMuted = false;
var predefinedLatitude;
var predefinedLongitude;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleMute') {
    predefinedLatitude = parseFloat(request.latitude);
    predefinedLongitude = parseFloat(request.longitude);

    // Use the geolocation API to get the current location
    navigator.geolocation.getCurrentPosition(function(position) {
      var currentLatitude = position.coords.latitude;
      var currentLongitude = position.coords.longitude;

      // Check if the current location is near the predefined location
      var distance = calculateDistance(currentLatitude, currentLongitude, predefinedLatitude, predefinedLongitude);

      // You can adjust the distance threshold based on your requirements
      var distanceThreshold = 0.1; // Adjust this value based on your needs

      if (distance <= distanceThreshold && isMuted) {
        // Unmute if near predefined location
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          var activeTab = tabs[0];
          chrome.tabs.update(activeTab.id, { muted: false });
          isMuted = false;
        });
      } else if (distance > distanceThreshold && !isMuted) {
        // Mute if not near predefined location
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          var activeTab = tabs[0];
          chrome.tabs.update(activeTab.id, { muted: true });
          isMuted = true;
        });
      }
    });
  }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula to calculate distance between two points on the Earth
  var R = 6371; // Radius of the Earth in kilometers
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c;
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
