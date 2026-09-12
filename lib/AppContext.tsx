import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { UserPreferences, Language, SavedLocation, SelectedLocation } from './types';
import { getPreferences, updatePreferences, getSavedLocations, saveLocation, deleteLocation, setDefaultLocation } from './storage';
import { reverseGeocode } from './weather';
import { findCuratedLocation } from './indianLocations';

const DEFAULT_SELECTED: SelectedLocation = {
  city: 'New Delhi',
  state: 'Delhi',
  country: 'India',
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
};

interface AppContextValue {
  preferences: UserPreferences | null;
  loadingPrefs: boolean;
  selectedLocation: SelectedLocation;
  savedLocations: SavedLocation[];
  refreshLocations: () => Promise<void>;
  addLocation: (name: string, lat: number, lon: number, country?: string) => Promise<void>;
  removeLocation: (id: string) => Promise<void>;
  makeDefault: (id: string) => Promise<void>;
  selectLocation: (loc: SelectedLocation) => void;
  setLanguage: (lang: Language) => Promise<void>;
  setUnit: (unit: 'celsius' | 'fahrenheit') => Promise<void>;
  setVoiceEnabled: (enabled: boolean) => Promise<void>;
  setAutoLocation: (enabled: boolean) => Promise<void>;
  detectLocation: () => Promise<void>;
  detecting: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>(DEFAULT_SELECTED);
  const [detecting, setDetecting] = useState(false);

  const refreshLocations = useCallback(async () => {
    const locs = await getSavedLocations();
    setSavedLocations(locs);
    const def = locs.find((l) => l.isDefault);
    if (def) {
      const curated = findCuratedLocation(def.name);
      if (curated) {
        setSelectedLocation(curated);
      } else {
        setSelectedLocation({
          city: def.name,
          state: '',
          country: def.country || 'India',
          latitude: def.latitude,
          longitude: def.longitude,
          timezone: 'Asia/Kolkata',
        });
      }
    }
  }, []);

  useEffect(() => {
    (async () => {
      const prefs = await getPreferences();
      setPreferences(prefs);
      setLoadingPrefs(false);
      await refreshLocations();
      if (prefs?.autoLocation) {
        detectLocation();
      }
    })();
  }, []);

  const detectLocation = useCallback(async () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const geo = await reverseGeocode(latitude, longitude);
        const name = geo?.name || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
        const curated = findCuratedLocation(name);
        if (curated) {
          setSelectedLocation(curated);
        } else {
          setSelectedLocation({
            city: name,
            state: geo?.admin1 || '',
            country: geo?.country || 'India',
            latitude,
            longitude,
            timezone: 'Asia/Kolkata',
          });
        }
        setDetecting(false);
      },
      () => { setDetecting(false); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const selectLocation = useCallback((loc: SelectedLocation) => { setSelectedLocation(loc); }, []);

  const addLocation = useCallback(async (name: string, lat: number, lon: number, country?: string) => {
    await saveLocation(name, lat, lon, country, savedLocations.length === 0);
    await refreshLocations();
  }, [savedLocations.length, refreshLocations]);

  const removeLocation = useCallback(async (id: string) => {
    await deleteLocation(id);
    await refreshLocations();
  }, [refreshLocations]);

  const makeDefault = useCallback(async (id: string) => {
    await setDefaultLocation(id);
    await refreshLocations();
  }, [refreshLocations]);

  const setLanguage = useCallback(async (lang: Language) => {
    setPreferences((p) => p ? { ...p, language: lang } : p);
    await updatePreferences({ language: lang });
  }, []);

  const setUnit = useCallback(async (unit: 'celsius' | 'fahrenheit') => {
    setPreferences((p) => p ? { ...p, unit } : p);
    await updatePreferences({ unit });
  }, []);

  const setVoiceEnabled = useCallback(async (enabled: boolean) => {
    setPreferences((p) => p ? { ...p, voiceEnabled: enabled } : p);
    await updatePreferences({ voiceEnabled: enabled });
  }, []);

  const setAutoLocation = useCallback(async (enabled: boolean) => {
    setPreferences((p) => p ? { ...p, autoLocation: enabled } : p);
    await updatePreferences({ autoLocation: enabled });
    if (enabled) detectLocation();
  }, [detectLocation]);

  return (
    <AppContext.Provider value={{
      preferences, loadingPrefs, selectedLocation, savedLocations,
      refreshLocations, addLocation, removeLocation, makeDefault,
      selectLocation, setLanguage, setUnit, setVoiceEnabled, setAutoLocation,
      detectLocation, detecting,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
