import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { getProduct } from "../services/productService";
import type { Product } from "../types";
import { formatCurrency } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductImage from "../components/ProductImage";
import QuantitySelector from "../components/QuantitySelector";
import Spinner from "../components/Spinner";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    getProduct(id)
      .then(setProduct)
      .catch(() => setError("Product not found or it was removed."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  if (loading) return <Spinner />;

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-lg font-semibold text-slate-800">{error}</h1>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product, quantity);
    showToast(`${product.name} added to cart`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <ProductImage src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{product.name}</h1>
          <p className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(product.price)}</p>

          <div className="mt-4">
            {outOfStock ? (
              <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
                Out of stock
              </span>
            ) : (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  product.stock <= 5
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-slate-600">{product.description}</p>

          {!outOfStock && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                max={product.stock}
              />
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </button>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <p className="flex justify-between py-1 text-slate-600">
              <span>Available stock</span>
              <span className="font-semibold text-slate-800">{product.stock}</span>
            </p>
            <p className="flex justify-between py-1 text-slate-600">
              <span>Category</span>
              <span className="font-semibold text-slate-800">{product.category}</span>
            </p>
            <p className="flex justify-between py-1 text-slate-600">
              <span>Free shipping</span>
              <span className="font-semibold text-emerald-600">On orders over {formatCurrency(4999)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}