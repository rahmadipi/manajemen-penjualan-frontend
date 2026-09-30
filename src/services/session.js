// Penyimpanan sesi login di localStorage.
const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUsername = () => localStorage.getItem(USER_KEY) || "Admin";

export function setSession(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function isExpired(token) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return Boolean(payload.exp) && payload.exp * 1000 <= Date.now();
  } catch {
    return true; // token rusak dianggap tidak valid
  }
}

export function isAuthenticated() {
  const token = getToken();
  return Boolean(token) && !isExpired(token);
}
