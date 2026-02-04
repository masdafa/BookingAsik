const FAVORITES_KEY = "favorite_hotels";

const readStorage = () => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const writeStorage = (list) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  window.dispatchEvent(
    new CustomEvent("favorites-updated", {
      detail: list.length,
    })
  );
};

export const getFavorites = () => readStorage();

export const isFavoriteHotel = (id) =>
  readStorage().some((hotel) => hotel.id === id);

export const addFavoriteHotel = (hotel) => {
  const list = readStorage();
  if (!hotel?.id || list.some((item) => item.id === hotel.id)) return list;
  const newList = [
    ...list,
    {
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      price: hotel.price,
      image: hotel.image,
    },
  ];
  writeStorage(newList);
  return newList;
};

export const removeFavoriteHotel = (id) => {
  const newList = readStorage().filter((hotel) => hotel.id !== id);
  writeStorage(newList);
  return newList;
};

