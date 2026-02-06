export function calculatePickupPrice(distance: number) {
  if (distance <= 5) return 25000;
  if (distance <= 10) return 35000;
  if (distance <= 20) return 45000;

  return null;
}
