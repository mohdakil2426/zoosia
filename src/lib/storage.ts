/**
 * Simple LocalStorage utility to persist mock data
 */

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`zoosia_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(`zoosia_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(`zoosia_${key}`);
  },

  clear: (): void => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('zoosia_')) {
        localStorage.removeItem(key);
      }
    });
  }
};
