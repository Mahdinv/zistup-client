const TOKEN_STORAGE_KEY = "token";

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  set(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },

  remove(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  has(): boolean {
    return Boolean(this.get());
  },
};
