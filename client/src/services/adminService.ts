import api from "./api";
import type { AdminStats, AdminUser } from "../types";

export async function getStats(): Promise<AdminStats> {
  const res = await api.get<{ data: AdminStats }>("/admin/stats");
  return res.data.data;
}

export async function getUsers(): Promise<AdminUser[]> {
  const res = await api.get<{ data: { users: AdminUser[] } }>("/admin/users");
  return res.data.data.users;
}