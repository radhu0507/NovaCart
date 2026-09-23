import api from "./api";
import type { Product, ProductInput } from "../types";

export type ProductSort = "price_asc" | "price_desc" | "name_asc";

export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: ProductSort;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.sort) params.set("sort", filters.sort);

  const query = params.toString();
  const res = await api.get<{ data: { products: Product[] } }>(
    `/products${query ? `?${query}` : ""}`
  );
  return res.data.data.products;
}

export async function getProduct(id: string): Promise<Product> {
  const res = await api.get<{ data: { product: Product } }>(`/products/${id}`);
  return res.data.data.product;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const res = await api.post<{ data: { product: Product } }>("/products", input);
  return res.data.data.product;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  const res = await api.put<{ data: { product: Product } }>(`/products/${id}`, input);
  return res.data.data.product;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}