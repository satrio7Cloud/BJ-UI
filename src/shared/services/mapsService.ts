const ORIGIN = "Jl Hasan Saban Pancoran Mas Depok";

export async function getDistance(destination: string) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      ORIGIN
    )}&destinations=${encodeURIComponent(destination)}&key=${
      import.meta.env.VITE_GOOGLE_MAPS_KEY
    }`
  );

  const data = await res.json();

  const meters =
    data.rows[0].elements[0].distance.value;

  return meters / 1000; // KM
}
