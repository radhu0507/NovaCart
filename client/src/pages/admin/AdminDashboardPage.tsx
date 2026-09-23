import { useEffect, useState } from "react";
import { Boxes, DollarSign, ShoppingCart, Users } from "lucide-react";
import { getStats } from "../../services/adminService";
import type { AdminStats } from "../../types";
import { getErrorMessage } from "../../services/api";
import { formatCurrency } from "../../utils/format";
import Spinner from "../../components/Spinner";

const cards = [
  { key: "totalSales", label: "Total sales", icon: DollarSign, accent: "bg-emerald-50 text-emerald-600" },
  { key: "totalOrders", label: "Orders placed", icon: ShoppingCart, accent: "bg-indigo-50 text-indigo-600" },
  { key: "totalProducts", label: "Products listed", icon: Boxes, accent: "bg-violet-50 text-violet-600" },
  { key: "totalUsers", label: "Registered users", icon: Users, accent: "bg-amber-50 text-amber-600" },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading stats..." />;

  if (error || !stats) return <p className="text-sm text-rose-600">{error || "Failed to load stats."}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">A quick overview of your store.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.accent}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">
              {card.key === "totalSales"
                ? formatCurrency(stats[card.key] ?? 0)
                : stats[card.key]}
            </p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}