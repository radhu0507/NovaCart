import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { getOrder } from "../services/orderService";
import type { Order } from "../types";
import { getErrorMessage } from "../services/api";
import { formatCurrency, formatDateTime } from "../utils/format";
import OrderStatusTracker from "../components/OrderStatusTracker";
import Spinner from "../components/Spinner";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getOrder(id)
      .then(setOrder)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner label="Loading your order..." />;

  if (error || !order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-lg font-semibold text-slate-800">We couldn't find that order.</h1>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <Link
          to="/orders"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          View my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Order confirmed!
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Thanks for shopping with NovaCart. Your order has been placed and is on its way.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-slate-800">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-xs text-slate-500">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <p className="mt-1 text-xs text-slate-500">{order.shippingAddress}</p>

        <div className="mt-6">
          <OrderStatusTracker status={order.status} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-bold text-slate-900">Items</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 text-sm">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-800">{item.product.name}</span>
                <span className="text-xs text-slate-400">× {item.quantity}</span>
              </div>
              <span className="font-semibold text-slate-800">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-900">
          <span>Total</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Track this order
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ShoppingBag className="h-4 w-4" /> Keep shopping
        </Link>
      </div>
    </div>
  );
}