const AUTH_KEY = "riwiflow_user";

export const authStore = {
  setUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },
  getUser() {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
};