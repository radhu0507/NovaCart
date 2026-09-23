import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getOrder } from "../services/orderService";
import type { Order } from "../types";
import { getErrorMessage } from "../services/api";
import { formatCurrency, formatDateTime } from "../utils/format";
import OrderStatusTracker from "../components/OrderStatusTracker";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";

export default function OrderDetailPage() {
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

  if (loading) return <Spinner label="Loading order..." />;

  if (error || !order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-lg font-semibold text-slate-800">Order not found.</h1>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <Link
          to="/orders"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> My orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-bold text-slate-900">Delivery status</h2>
        <div className="mt-5">
          <OrderStatusTracker status={order.status} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-bold text-slate-900">Items</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <Link
                  to={`/products/${item.productId}`}
                  className="font-medium text-slate-800 hover:text-indigo-600"
                >
                  {item.product.name}
                </Link>
                <p className="mt-0.5 text-xs text-slate-500">Unit price {formatCurrency(item.price)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">
                  {formatCurrency(item.price * item.quantity)}
                </p>
                <p className="text-xs text-slate-500">Qty {item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-900">
          <span>Total</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-bold text-slate-900">Shipping address</h2>
        <p className="mt-3 text-sm text-slate-600">{order.shippingAddress}</p>
      </div>
    </div>
  );
}