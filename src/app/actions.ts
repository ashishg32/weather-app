'use server';

// Server Actions for favorite locations management

export type FavoriteLocation = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

const favorites = new Map<string, FavoriteLocation>();

export async function addFavorite(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const name = formData.get('name') as string;
  const lat = parseFloat(formData.get('lat') as string);
  const lon = parseFloat(formData.get('lon') as string);

  if (!name || isNaN(lat) || isNaN(lon)) {
    return { success: false, message: 'Invalid location data' };
  }

  const id = `${lat}-${lon}`;

  if (favorites.has(id)) {
    return { success: false, message: 'Location already in favorites' };
  }

  favorites.set(id, { id, name, lat, lon });
  return { success: true, message: `Added ${name} to favorites!` };
}

export async function removeFavorite(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const id = formData.get('id') as string;

  if (!favorites.has(id)) {
    return { success: false, message: 'Location not found' };
  }

  favorites.delete(id);
  return { success: true, message: 'Removed from favorites' };
}

export async function getFavorites(): Promise<FavoriteLocation[]> {
  return Array.from(favorites.values());
}
