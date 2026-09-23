import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createProduct, getProduct, updateProduct } from "../../services/productService";
import type { Product, ProductInput } from "../../types";
import { getErrorMessage } from "../../services/api";
import { CATEGORIES } from "../../constants";
import { useToast } from "../../context/ToastContext";
import ProductImage from "../../components/ProductImage";
import Spinner from "../../components/Spinner";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

const emptyForm: ProductInput = {
  name: "",
  description: "",
  price: 0,
  image: "",
  category: CATEGORIES[0],
  stock: 0,
};

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((product: Product) => {
        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
        });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const setField =
    (key: keyof ProductInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim() || !form.image.trim()) {
      setError("Name, description and image URL are required.");
      return;
    }
    if (form.price < 0) {
      setError("Price cannot be negative.");
      return;
    }
    if (form.stock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    const payload: ProductInput = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      price: Number(form.price) || 0,
      stock: Math.floor(Number(form.stock) || 0),
    };

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateProduct(id, payload);
        showToast("Product updated");
      } else {
        await createProduct(payload);
        showToast("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading product..." />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {isEdit ? "Edit product" : "New product"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-bold text-slate-900">Details</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={setField("name")}
                placeholder="Wireless Bluetooth Headphones"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={setField("description")}
                rows={4}
                placeholder="Describe the product..."
                className={`${inputClass} resize-y`}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={setField("category")}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-700">
                  Price (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={setField("price")}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="stock" className="mb-1 block text-sm font-medium text-slate-700">
                  Stock
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={setField("stock")}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-bold text-slate-900">Image</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_9rem]">
            <div>
              <label htmlFor="image" className="mb-1 block text-sm font-medium text-slate-700">
                Image URL
              </label>
              <input
                id="image"
                type="text"
                value={form.image}
                onChange={setField("image")}
                placeholder="https://images.unsplash.com/..."
                className={inputClass}
                required
              />
              <p className="mt-1 text-xs text-slate-400">
                A placeholder image is used if the URL fails to load.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <ProductImage src={form.image} alt="Preview" className="aspect-square w-full object-cover" />
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-300"
          >
            <Save className="h-4 w-4" />
            {submitting ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </div>
  );
}