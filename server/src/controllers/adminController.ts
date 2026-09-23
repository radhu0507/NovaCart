import { Request, Response } from "express";
import prisma from "../prisma";

export async function getAllUsers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: { users } });
}

export async function getStats(_req: Request, res: Response) {
  const [totalProducts, totalOrders, totalUsers, sales] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } },
    }),
  ]);

  res.json({
    success: true,
    data: {
      totalProducts,
      totalOrders,
      totalUsers,
      totalSales: sales._sum.totalAmount || 0,
    },
  });
}