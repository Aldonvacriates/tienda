"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  createProduct,
  deleteProduct,
  getProductsClient,
  updateProduct,
} from "@/lib/firebase/products-client";
import type { Product } from "@/lib/firebase/types";
import type { ProductInput } from "@/lib/firebase/products-shared";

const emptyForm = {
  title: "",
  handle: "",
  price: "",
  description: "",
  imageUrl: "",
  tags: "",
  collections: "",
  availableForSale: true,
};

function toList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await getProductsClient();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setStatus("Unable to load products.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;
      setFormState((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState(emptyForm);
    setEditingId(null);
  };

  const buildProductInput = (): ProductInput => {
    const images = formState.imageUrl
      ? [
          {
            url: formState.imageUrl,
            altText: formState.title,
            width: 1200,
            height: 1200,
          },
        ]
      : [];
    return {
      title: formState.title,
      handle: formState.handle,
      description: formState.description,
      price: Number(formState.price || 0),
      images,
      featuredImage: images[0],
      tags: toList(formState.tags),
      collections: toList(formState.collections),
      availableForSale: formState.availableForSale,
    };
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const payload = buildProductInput();
      if (editingId) {
        await updateProduct(editingId, payload);
        setStatus("Product updated.");
      } else {
        await createProduct(payload);
        setStatus("Product created.");
      }
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      setStatus("Unable to save product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormState({
      title: product.title,
      handle: product.handle,
      price: product.priceRange.maxVariantPrice.amount,
      description: product.description,
      imageUrl: product.featuredImage?.url ?? "",
      tags: product.tags.join(", "),
      collections: product.collections?.join(", ") ?? "",
      availableForSale: product.availableForSale,
    });
  };

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;
    try {
      await deleteProduct(productId);
      await loadProducts();
    } catch (error) {
      console.error(error);
      setStatus("Unable to delete product.");
    }
  };

  const formTitle = useMemo(
    () => (editingId ? "Update product" : "Create product"),
    [editingId]
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Product management</h1>
        <button
          type="button"
          onClick={resetForm}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold"
        >
          New product
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-neutral-200 p-6">
          <h2 className="mb-4 text-lg font-semibold">{formTitle}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium">
              Title
              <input
                type="text"
                name="title"
                value={formState.title}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Handle (slug)
              <input
                type="text"
                name="handle"
                value={formState.handle}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Price
              <input
                type="number"
                name="price"
                value={formState.price}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                min="0"
                step="0.01"
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Description
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                className="mt-2 min-h-[120px] w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Featured image URL
              <input
                type="url"
                name="imageUrl"
                value={formState.imageUrl}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-medium">
              Tags (comma separated)
              <input
                type="text"
                name="tags"
                value={formState.tags}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-medium">
              Collections (comma separated)
              <input
                type="text"
                name="collections"
                value={formState.collections}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="availableForSale"
                checked={formState.availableForSale}
                onChange={handleChange}
              />
              Available for sale
            </label>
            {status ? (
              <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                {status}
              </p>
            ) : null}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Saving..." : editingId ? "Update product" : "Create product"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-neutral-200 p-6">
          <h2 className="mb-4 text-lg font-semibold">Current products</h2>
          <div className="space-y-4">
            {products.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No products yet. Add one on the left.
              </p>
            ) : null}
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-md border border-neutral-100 p-3"
              >
                <p className="text-sm font-semibold">{product.title}</p>
                <p className="text-xs text-neutral-500">
                  /product/{product.handle}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="rounded-md border border-neutral-300 px-3 py-1 text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="rounded-md border border-red-300 px-3 py-1 text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
