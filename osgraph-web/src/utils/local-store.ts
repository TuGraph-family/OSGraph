class BrowserStore {
  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(e);
    }
  }
}

export const LocalStore = new BrowserStore();
