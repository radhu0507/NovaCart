import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateOrderStatus, getOrders } from "../../services/orderService";
import type { Order, OrderStatus } from "../../types";
import { getErrorMessage } from "../../services/api";
import { ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from "../../constants";
import { formatCurrency, formatDateTime } from "../../utils/format";
import { useToast } from "../../context/ToastContext";
import StatusBadge from "../../components/StatusBadge";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError("");
    getOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    if (status === order.status) return;
    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, status);
      showToast(`Order ${order.id.slice(0, 8).toUpperCase()} marked as ${ORDER_STATUS_LABELS[status].toLowerCase()}`);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o)));
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner label="Loading orders..." />;

  if (error) return <p className="text-sm text-rose-600">{error}</p>;

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="Orders placed by customers will appear here."
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
      <p className="mt-1 text-sm text-slate-500">
        {orders.length} order{orders.length === 1 ? "" : "s"} on record.
      </p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-800">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {formatDateTime(order.createdAt)} &middot;
                  {order.user ? ` ${order.user.name} (${order.user.email})` : " Customer"}
                </p>
              </div>
              <p className="text-base font-bold text-slate-900">{formatCurrency(order.totalAmount)}</p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {order.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.productId}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {item.product.name} × {item.quantity}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">{order.shippingAddress}</p>
              <div className="flex items-center gap-2">
                <label htmlFor={`status-${order.id}`} className="sr-only">
                  Update status
                </label>
                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                  disabled={updatingId === order.id}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                  aria-label="Order status"
                >
                  {ORDER_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {ORDER_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
                {updatingId === order.id && <span className="text-xs text-slate-400">Saving...</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}