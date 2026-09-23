import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteProduct, getProducts } from "../../services/productService";
import type { Product } from "../../types";
import { getErrorMessage } from "../../services/api";
import { formatCurrency } from "../../utils/format";
import { useToast } from "../../context/ToastContext";
import ProductImage from "../../components/ProductImage";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import ConfirmationDialog from "../../components/ConfirmationDialog";

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<Product | null>(null);

  const load = () => {
    setLoading(true);
    setError("");
    getProducts()
      .then(setProducts)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteProduct(deleting.id);
      showToast(`${deleting.name} deleted`);
      setDeleting(null);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            {products.length} product{products.length === 1 ? "" : "s"} in your catalog.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading products..." />
      ) : error ? (
        <p className="py-12 text-center text-sm text-rose-600">{error}</p>
      ) : products.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No products yet"
            message="Add your first product to start selling."
          />
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">Stock</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <ProductImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <Link
                          to={`/products/${product.id}`}
                          className="max-w-48 truncate font-semibold text-slate-800 hover:text-indigo-600"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-500 md:table-cell">{product.category}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.stock === 0
                            ? "bg-rose-100 text-rose-700"
                            : product.stock <= 5
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleting(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmationDialog
          title="Delete product?"
          message={`"${deleting.name}" will be permanently removed. This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}