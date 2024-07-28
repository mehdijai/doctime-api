export function isNearCoordinates(
  coord1: ICoordinates,
  coord2: ICoordinates,
  radiusInKm: number
): boolean {
  // Earth's radius in kilometers
  const earthRadius = 6371;

  // Convert latitude and longitude to radians
  const lat1 = toRadians(coord1.lat);
  const lon1 = toRadians(coord1.lng);
  const lat2 = toRadians(coord2.lat);
  const lon2 = toRadians(coord2.lng);

  // Haversine formula
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance <= radiusInKm;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
