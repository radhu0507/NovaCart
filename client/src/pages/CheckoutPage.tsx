import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createOrder } from "../services/orderService";
import { getErrorMessage } from "../services/api";
import { formatCurrency } from "../utils/format";
import ProductImage from "../components/ProductImage";
import EmptyState from "../components/EmptyState";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Nothing to check out"
          message="Your cart is empty. Add some products first."
          action={
            <Link
              to="/products"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  const setField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setCardField = (key: keyof typeof card) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCard((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      showToast("Please log in to place your order", "error");
      navigate("/login");
      return;
    }

    const shippingAddress = [
      form.fullName,
      form.address,
      form.city,
      form.postalCode,
      form.country,
    ]
      .map((line) => line.trim())
      .filter(Boolean)
      .join(", ");

    if (!shippingAddress) {
      setError("Please fill in your shipping details.");
      return;
    }

    if (!card.number.trim() || !card.expiry.trim() || !card.cvc.trim()) {
      setError("Please enter your payment details.");
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    setSubmitting(true);
    try {
      const order = await createOrder(orderItems, shippingAddress);
      clearCart();
      showToast("Order placed successfully!");
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={form.fullName}
                onChange={setField("fullName")}
                placeholder="Full name"
                className={inputClass}
                required
              />
              <input
                type="text"
                value={form.country}
                onChange={setField("country")}
                placeholder="Country"
                className={inputClass}
                required
              />
              <input
                type="text"
                value={form.address}
                onChange={setField("address")}
                placeholder="Street address"
                className={`${inputClass} sm:col-span-2`}
                required
              />
              <input
                type="text"
                value={form.city}
                onChange={setField("city")}
                placeholder="City"
                className={inputClass}
                required
              />
              <input
                type="text"
                value={form.postalCode}
                onChange={setField("postalCode")}
                placeholder="Postal code"
                className={inputClass}
                required
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-900">Payment</h2>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="h-3 w-3" /> Demo checkout — no real payment is processed.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <input
                type="text"
                value={card.number}
                onChange={setCardField("number")}
                placeholder="Card number"
                inputMode="numeric"
                className={`${inputClass} sm:col-span-2`}
                required
              />
              <input
                type="text"
                value={card.expiry}
                onChange={setCardField("expiry")}
                placeholder="MM/YY"
                className={inputClass}
                required
              />
              <input
                type="text"
                value={card.cvc}
                onChange={setCardField("cvc")}
                placeholder="CVC"
                inputMode="numeric"
                className={inputClass}
                required
              />
            </div>
          </section>

          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
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
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-300"
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}