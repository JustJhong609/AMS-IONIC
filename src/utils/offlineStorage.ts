const hasWindow = (): boolean => typeof window !== 'undefined';

const getLocalStorageValue = (key: string): string | null => {
  if (!hasWindow()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setLocalStorageValue = (key: string, value: string): void => {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore write errors so app flow does not break.
  }
};

const getCapacitorPreferences = () => {
  if (!hasWindow()) return null;

  const cap = (window as any).Capacitor;
  const isNative = typeof cap?.isNativePlatform === 'function' ? cap.isNativePlatform() : false;
  if (!isNative) return null;

  const preferences = cap?.Plugins?.Preferences;
  if (!preferences || typeof preferences.get !== 'function' || typeof preferences.set !== 'function') {
    return null;
  }

  return preferences;
};

export const readJsonValue = async <T,>(key: string, fallback: T): Promise<T> => {
  const preferences = getCapacitorPreferences();

  if (preferences) {
    try {
      const result = await preferences.get({ key });
      if (typeof result?.value === 'string') {
        return JSON.parse(result.value) as T;
      }
    } catch {
      // Fallback to local storage when plugin is unavailable or fails.
    }
  }

  const localValue = getLocalStorageValue(key);
  if (typeof localValue === 'string') {
    try {
      const parsed = JSON.parse(localValue) as T;
      if (preferences) {
        try {
          await preferences.set({ key, value: localValue });
        } catch {
          // Ignore migration failures and continue.
        }
      }
      return parsed;
    } catch {
      return fallback;
    }
  }

  return fallback;
};

export const writeJsonValue = async <T,>(key: string, value: T): Promise<void> => {
  const payload = JSON.stringify(value);
  const preferences = getCapacitorPreferences();

  if (preferences) {
    try {
      await preferences.set({ key, value: payload });
    } catch {
      // Fallback to local storage below.
    }
  }

  setLocalStorageValue(key, payload);
};
