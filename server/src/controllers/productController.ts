import { Request, Response } from "express";
import prisma from "../prisma";
import { ApiError } from "../utils/ApiError";

export async function getProducts(req: Request, res: Response) {
  const { search, category, sort } = req.query;

  const where: Record<string, unknown> = {};

  if (typeof search === "string" && search.trim()) {
    where.name = { contains: search.trim(), mode: "insensitive" };
  }

  if (typeof category === "string" && category.trim()) {
    where.category = category.trim();
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "name_asc") orderBy = { name: "asc" };

  const products = await prisma.product.findMany({ where, orderBy });

  res.json({ success: true, data: { products } });
}

export async function getProductById(req: Request<{ id: string }>, res: Response) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, data: { product } });
}

export async function createProduct(req: Request, res: Response) {
  const { name, description, price, image, category, stock } = req.body ?? {};

  if (!name || !description || !image || !category) {
    throw new ApiError(400, "Name, description, image and category are required");
  }

  const parsedPrice = Number(price);
  const parsedStock = Number(stock);

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    throw new ApiError(400, "Price must be a valid number greater than or equal to 0");
  }
  if (!Number.isFinite(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) {
    throw new ApiError(400, "Stock must be a whole number greater than or equal to 0");
  }

  const product = await prisma.product.create({
    data: {
      name: String(name).trim(),
      description: String(description).trim(),
      price: parsedPrice,
      image: String(image).trim(),
      category: String(category).trim(),
      stock: parsedStock,
    },
  });

  res.status(201).json({ success: true, data: { product } });
}

export async function updateProduct(req: Request<{ id: string }>, res: Response) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const { name, description, price, image, category, stock } = req.body ?? {};

  const data: Record<string, unknown> = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) throw new ApiError(400, "Name cannot be empty");
    data.name = name.trim();
  }
  if (description !== undefined) {
    if (typeof description !== "string" || !description.trim())
      throw new ApiError(400, "Description cannot be empty");
    data.description = description.trim();
  }
  if (image !== undefined) {
    if (typeof image !== "string" || !image.trim()) throw new ApiError(400, "Image cannot be empty");
    data.image = image.trim();
  }
  if (category !== undefined) {
    if (typeof category !== "string" || !category.trim())
      throw new ApiError(400, "Category cannot be empty");
    data.category = category.trim();
  }
  if (price !== undefined) {
    const parsed = Number(price);
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new ApiError(400, "Price must be a valid number greater than or equal to 0");
    }
    data.price = parsed;
  }
  if (stock !== undefined) {
    const parsed = Number(stock);
    if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
      throw new ApiError(400, "Stock must be a whole number greater than or equal to 0");
    }
    data.stock = parsed;
  }

  if (Object.keys(data).length === 0) {
    throw new ApiError(400, "Nothing to update");
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data,
  });

  res.json({ success: true, data: { product: updated } });
}

export async function deleteProduct(req: Request<{ id: string }>, res: Response) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await prisma.product.delete({ where: { id: product.id } });

  res.json({ success: true, data: { message: "Product deleted" } });
}