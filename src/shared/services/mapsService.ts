const ORIGIN = import.meta.env.VITE_MAPS_ORIGIN || "Jl Hasan Saban Pancoran Mas Depok";

export async function getDistance(destination: string): Promise<number | null> {
  try {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!key || key === "ISI_API_KEY") {
      console.warn("VITE_GOOGLE_MAPS_KEY is not configured or contains placeholder.");
      return null;
    }

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        ORIGIN
      )}&destinations=${encodeURIComponent(destination)}&key=${key}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    
    // Safely parse data properties to avoid TypeErrors
    const element = data?.rows?.[0]?.elements?.[0];
    if (!element) {
      throw new Error("Invalid distance matrix response structure");
    }

    if (element.status !== "OK") {
      throw new Error(`Maps API returned non-OK status: ${element.status}`);
    }

    const meters = element.distance?.value;
    if (typeof meters !== "number") {
      throw new Error("Distance value is not a number in Maps response");
    }

    return meters / 1000; // KM
  } catch (error) {
    console.error("Failed to calculate distance:", error);
    return null;
  }
}
