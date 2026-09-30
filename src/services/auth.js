import api from "./api";
import { setSession } from "./session";

export async function login(username, password) {
  const { data } = await api.post("/login", { username, password });
  setSession(data.token, data.user.username);
  return data.user;
}
