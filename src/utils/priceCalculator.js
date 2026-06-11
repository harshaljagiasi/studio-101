export function calculateBasePrice(hours, amenities = {}) {
  // simple placeholder formula
  const ratePerHour = 1000;
  let total = hours * ratePerHour;
  if (amenities.camera) total += 500;
  if (amenities.light) total += 300;
  return total;
}
