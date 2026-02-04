import axios from "axios";

/**
 * Geocoding service menggunakan OpenStreetMap Nominatim API (gratis)
 * Convert nama hotel + kota menjadi koordinat latitude/longitude
 */
export const geocodeHotel = async (hotelName, city) => {
  try {
    // Query untuk mencari koordinat hotel
    const query = `${hotelName}, ${city}, Indonesia`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "HotelBookingApp/1.0", // Required by Nominatim
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.display_name,
      };
    }

    // Jika tidak ditemukan, coba cari berdasarkan kota saja
    const cityQuery = `${city}, Indonesia`;
    const cityUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityQuery)}&limit=1`;

    const cityResponse = await axios.get(cityUrl, {
      headers: {
        "User-Agent": "HotelBookingApp/1.0",
      },
    });

    if (cityResponse.data && cityResponse.data.length > 0) {
      const result = cityResponse.data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.display_name,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return null;
  }
};

