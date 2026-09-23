import { Request, Response } from "express";
import prisma from "../prisma";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middleware/auth";

export async function createOrder(req: AuthRequest, res: Response) {
  const { items, shippingAddress } = req.body ?? {};
  const userId = req.user!.id;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }
  if (typeof shippingAddress !== "string" || !shippingAddress.trim()) {
    throw new ApiError(400, "Shipping address is required");
  }

  const combined = new Map<string, number>();

  for (const item of items) {
    if (!item || typeof item.productId !== "string" || !item.productId.trim()) {
      throw new ApiError(400, "Invalid product in order");
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new ApiError(400, "Invalid quantity in order");
    }
    combined.set(
      item.productId,
      (combined.get(item.productId) || 0) + item.quantity
    );
  }

  const productIds = [...combined.keys()];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  let totalAmount = 0;
  const orderItemData: { productId: string; quantity: number; price: number }[] = [];
  const stockUpdates: { id: string; quantity: number }[] = [];

  for (const [productId, quantity] of combined) {
    const product = productMap.get(productId);
    if (!product) {
      throw new ApiError(404, "One of the products in your cart no longer exists");
    }
    if (product.stock < quantity) {
      throw new ApiError(
        400,
        `Not enough stock for "${product.name}" (only ${product.stock} left)`
      );
    }
    totalAmount += product.price * quantity;
    orderItemData.push({ productId, quantity, price: product.price });
    stockUpdates.push({ id: productId, quantity });
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress: shippingAddress.trim(),
        items: { create: orderItemData },
      },
      include: { items: { include: { product: true } } },
    });

    for (const update of stockUpdates) {
      await tx.product.update({
        where: { id: update.id },
        data: { stock: { decrement: update.quantity } },
      });
    }

    return created;
  });

  res.status(201).json({ success: true, data: { order } });
}

export async function getOrders(req: AuthRequest, res: Response) {
  const user = req.user!;

  const orders =
    user.role === "ADMIN"
      ? await prisma.order.findMany({
          include: { items: { include: { product: true } }, user: true },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.order.findMany({
          where: { userId: user.id },
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: "desc" },
        });

  res.json({ success: true, data: { orders } });
}

export async function getOrderById(req: AuthRequest, res: Response) {
  const user = req.user!;

  const order =
    user.role === "ADMIN"
      ? await prisma.order.findUnique({
          where: { id: String(req.params.id) },
          include: { items: { include: { product: true } }, user: true },
        })
      : await prisma.order.findFirst({
          where: { id: String(req.params.id), userId: user.id },
          include: { items: { include: { product: true } } },
        });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.json({ success: true, data: { order } });
}

export async function updateOrderStatus(req: Request<{ id: string }>, res: Response) {
  const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  const { status } = req.body ?? {};

  if (typeof status !== "string" || !validStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Status must be one of: ${validStatuses.join(", ")}`
    );
  }

  const order = await prisma.order.findUnique({ where: { id: String(req.params.id) } });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: status as "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" },
  });

  res.json({ success: true, data: { order: updated } });
}