export type Role = "USER" | "ADMIN";

export interface JwtPayload {
  id: string;
  role: Role;
}