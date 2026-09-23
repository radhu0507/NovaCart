import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, LogOut, Package, ShoppingBag, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const adminLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast("Logged out", "info");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">NovaCart</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <NavLink to="/admin" end className={adminLinkClass}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={adminLinkClass}>
            <Package className="h-4 w-4" /> Products
          </NavLink>
          <NavLink to="/admin/orders" className={adminLinkClass}>
            <ShoppingCart className="h-4 w-4" /> Orders
          </NavLink>
        </nav>

        <div className="border-t border-slate-800 p-3">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" /> Back to store
          </NavLink>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <p className="text-sm font-semibold text-slate-700">
            Welcome back, {user?.name.split(" ")[0]}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 border-b border-slate-200 bg-white px-4 py-2 md:hidden">
          <NavLink to="/admin" end className={adminLinkClass}>
            <LayoutDashboard className="h-4 w-4" /> Dash
          </NavLink>
          <NavLink to="/admin/products" className={adminLinkClass}>
            <Package className="h-4 w-4" /> Products
          </NavLink>
          <NavLink to="/admin/orders" className={adminLinkClass}>
            <ShoppingCart className="h-4 w-4" /> Orders
          </NavLink>
          <NavLink
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Store
          </NavLink>
        </nav>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}