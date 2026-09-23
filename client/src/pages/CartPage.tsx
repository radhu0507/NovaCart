import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/format";
import ProductImage from "../components/ProductImage";
import QuantitySelector from "../components/QuantitySelector";
import EmptyState from "../components/EmptyState";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Your cart is empty"
          message="Browse the catalog and add something you like."
          action={
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Continue shopping <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  const handleRemove = (productId: string, name: string) => {
    removeFromCart(productId);
    showToast(`${name} removed from cart`, "info");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shopping cart</h1>
      <p className="mt-1 text-sm text-slate-500">
        {items.length} item{items.length === 1 ? "" : "s"} in your cart
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <Link
                to={`/products/${item.productId}`}
                className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100"
              >
                <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>

              <div className="flex-1">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-semibold text-slate-800 hover:text-indigo-700"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {formatCurrency(item.price)}
                </p>
                {item.quantity >= item.stock && (
                  <p className="mt-1 text-xs text-amber-600">Max stock reached</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <QuantitySelector
                  quantity={item.quantity}
                  max={item.stock}
                  onChange={(qty) => updateQuantity(item.productId, qty)}
                />
                <div className="flex items-center gap-4">
                  <p className="font-bold text-slate-900 sm:min-w-20 sm:text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId, item.name)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-slate-800">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Shipping</dt>
                <dd className="font-semibold text-emerald-600">Free</dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                <dt>Total</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              to="/products"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ShoppingBag className="h-4 w-4" /> Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}