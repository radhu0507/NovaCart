import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getProducts, type ProductSort } from "../services/productService";
import type { Product } from "../types";
import { CATEGORIES } from "../constants";
import { useDebounce } from "../hooks/useDebounce";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const sortParam = (searchParams.get("sort") ?? "") as ProductSort | "";
  const debouncedSearch = useDebounce(search, 300);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const updateParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    getProducts({
      search: debouncedSearch || undefined,
      category: category || undefined,
      sort: sortParam || undefined,
    })
      .then(setProducts)
      .catch(() => setError("Failed to load products. Please try again."))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, sortParam]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Products</h1>
        <p className="text-sm text-slate-500">
          Search, filter and find exactly what you need.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => updateParam("search", e.target.value)}
            placeholder="Search products..."
            className={`${inputClass} pl-9`}
            aria-label="Search products"
          />
        </div>

        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
          className={inputClass}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sortParam}
          onChange={(e) => updateParam("sort", e.target.value)}
          className={inputClass}
          aria-label="Sort products"
        >
          <option value="">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="py-12 text-center text-sm text-rose-600">{error}</p>
      ) : products.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No products found"
            message="Try a different search term or category."
            action={
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Clear filters
              </button>
            }
          />
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-slate-500">
            Showing {products.length} product{products.length === 1 ? "" : "s"}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}