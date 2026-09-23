import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import { getOrders } from "../services/orderService";
import type { Order } from "../types";
import { getErrorMessage } from "../services/api";
import { formatCurrency, formatDateTime } from "../utils/format";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading your orders..." />;

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-sm text-rose-600">{error}</p>
        <Link to="/products" className="mt-4 inline-block text-sm font-semibold text-indigo-600">
          Browse products
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={<PackageOpen className="h-7 w-7" />}
          title="No orders yet"
          message="When you place an order, it will show up here."
          action={
            <Link
              to="/products"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Start shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">My orders</h1>
      <p className="mt-1 text-sm text-slate-500">
        {orders.length} order{orders.length === 1 ? "" : "s"} placed
      </p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-bold text-slate-900">{formatCurrency(order.totalAmount)}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.items.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                >
                  {item.product.name} × {item.quantity}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}