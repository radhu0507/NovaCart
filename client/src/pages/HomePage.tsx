import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck } from "lucide-react";
import { getProducts } from "../services/productService";
import type { Product } from "../types";
import { CATEGORIES } from "../constants";
import { formatCurrency } from "../utils/format";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts({ sort: "price_desc" })
      .then((products) => setFeatured(products.slice(0, 4)))
      .catch(() => setError("Failed to load featured products."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-slate-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" /> Fresh finds, every season
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Good things, delivered to your door.
            </h1>
            <p className="mt-4 max-w-md text-lg text-slate-600">
              Quality electronics, clothing, accessories and more — hand-picked for everyday life.
              Shop NovaCart for honest prices and fast delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products?sort=price_asc"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Best deals
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
              alt="Wireless headphones"
              className="mx-auto h-80 w-full max-w-md rounded-3xl object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 left-6 rounded-2xl bg-white px-5 py-4 shadow-lg">
              <p className="text-xs font-medium text-slate-500">From</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(1249)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured products</h2>
            <p className="mt-1 text-sm text-slate-500">Popular picks the whole team loves.</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="py-10 text-center text-sm text-rose-600">{error}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Shop by category</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <p className="font-semibold text-slate-800 group-hover:text-indigo-700">
                  {category}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6">
          <Truck className="h-10 w-10 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Free shipping on orders over {formatCurrency(4999)}
          </h2>
          <p className="max-w-lg text-slate-400">
            Every order includes easy tracking from our warehouse to your doorstep. No surprises,
            no hidden fees.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Start shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}