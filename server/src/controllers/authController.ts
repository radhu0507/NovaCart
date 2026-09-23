import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";
import { Role } from "../types";

function safeUser(user: {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }
  if (typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "Name cannot be empty");
  }
  if (typeof password !== "string" || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  const token = signToken({ id: user.id, role: user.role });

  res.status(201).json({ success: true, data: { token, user: safeUser(user) } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(String(password), user.password);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ id: user.id, role: user.role });

  res.json({ success: true, data: { token, user: safeUser(user) } });
}

export async function me(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json({ success: true, data: { user: safeUser(user) } });
}