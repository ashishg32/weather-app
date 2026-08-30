'use client';

import { useActionState, useOptimistic } from 'react';
import { addFavorite, removeFavorite, type FavoriteLocation } from '@/app/actions';

type Props = {
  initialFavorites: FavoriteLocation[];
  currentLocation?: { name: string; lat: number; lon: number };
};

export function Favorites({ initialFavorites, currentLocation }: Props) {
  // React Hook: useActionState manages form submission with automatic pending state
  const [addState, addFormAction, isAddingPending] = useActionState(addFavorite, null);

  // React Hook: useOptimistic provides instant UI updates before server confirmation
  const [optimisticFavorites, addOptimisticFavorite] = useOptimistic(
    initialFavorites,
    (state, newFavorite: FavoriteLocation) => [...state, newFavorite]
  );

  const [removeState, removeFormAction, isRemovingPending] = useActionState(removeFavorite, null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Favorite Locations</h3>
      {currentLocation && (
        <form
          action={(formData) => {
            // Optimistically add to UI
            const name = formData.get('name') as string;
            const lat = parseFloat(formData.get('lat') as string);
            const lon = parseFloat(formData.get('lon') as string);
            addOptimisticFavorite({ id: `${lat}-${lon}`, name, lat, lon });

            // Submit to server (auto-rolls back on failure)
            addFormAction(formData);
          }}
          className="mb-6"
        >
          <input type="hidden" name="name" value={currentLocation.name} />
          <input type="hidden" name="lat" value={currentLocation.lat} />
          <input type="hidden" name="lon" value={currentLocation.lon} />

          <button
            type="submit"
            disabled={isAddingPending}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isAddingPending ? 'Adding...' : `Add ${currentLocation.name} to Favorites`}
          </button>
          {addState?.message && (
            <p
              className={`mt-2 text-sm ${
                addState.success ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {addState.message}
            </p>
          )}
        </form>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">
          Saved Locations ({optimisticFavorites.length})
        </p>

        {optimisticFavorites.length === 0 ? (
          <p className="text-sm text-slate-500">No favorites yet. Add one above!</p>
        ) : (
          <ul className="space-y-1">
            {optimisticFavorites.map((fav) => (
              <li
                key={fav.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="text-sm text-slate-700">{fav.name}</span>
                <form
                  action={(formData) => {
                    removeFormAction(formData);
                  }}
                >
                  <input type="hidden" name="id" value={fav.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                    disabled={isRemovingPending}
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        {removeState?.message && (
          <p
            className={`text-xs ${
              removeState.success ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {removeState.message}
          </p>
        )}
      </div>
    </div>
  );
}
