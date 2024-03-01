document.addEventListener('DOMContentLoaded', function() {
  var toggleButton = document.getElementById('toggleButton');
  var latitudeInput = document.getElementById('latitude');
  var longitudeInput = document.getElementById('longitude');

  toggleButton.addEventListener('click', function() {
    var latitude = latitudeInput.value.trim();
    var longitude = longitudeInput.value.trim();

    if (latitude !== '' && longitude !== '') {
      chrome.runtime.sendMessage({ action: 'toggleMute', latitude, longitude });
    } else {
      alert('Please enter valid latitude and longitude.');
    }
  });
});
