import api from "./api";
import type { AuthResponse, User } from "../types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<{ data: AuthResponse }>("/auth/login", { email, password });
  return res.data.data;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await api.post<{ data: AuthResponse }>("/auth/register", { name, email, password });
  return res.data.data;
}

export async function fetchMe(): Promise<User> {
  const res = await api.get<{ data: { user: User } }>("/auth/me");
  return res.data.data.user;
}