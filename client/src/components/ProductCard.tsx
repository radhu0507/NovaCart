import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Product } from "../types";
import { formatCurrency } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock <= 5;

  const handleAddToCart = () => {
    addToCart(product, 1);
    showToast(`${product.name} added to cart`);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {outOfStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        ) : lowStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Only {product.stock} left
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
          {product.category}
        </p>
        <Link
          to={`/products/${product.id}`}
          className="mt-1 text-sm font-semibold text-slate-800 hover:text-indigo-700"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-base font-bold text-slate-900">{formatCurrency(product.price)}</p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}