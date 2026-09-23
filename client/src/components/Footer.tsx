import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { CATEGORIES } from "../constants";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Nova<span className="text-indigo-600">Cart</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-500">
              Quality goods for every day.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-800">Shop</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/products" className="text-sm text-slate-500 hover:text-indigo-600">
                  All products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-slate-500 hover:text-indigo-600">
                  Shopping cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-slate-500 hover:text-indigo-600">
                  My orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-800">Categories</h4>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.slice(0, 4).map((category) => (
                <li key={category}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="text-sm text-slate-500 hover:text-indigo-600"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} NovaCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}