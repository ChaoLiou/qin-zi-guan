export function getDistanceFromLatLonInKm(
  coords1: { latitude: number; longitude: number },
  coords2: { latitude: number; longitude: number }
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(coords2.latitude - coords1.latitude); // deg2rad below
  var dLon = deg2rad(coords2.longitude - coords1.longitude);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coords1.latitude)) *
      Math.cos(deg2rad(coords2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
