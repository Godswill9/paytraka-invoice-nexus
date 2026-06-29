"use client";

import {
  BadgeCheck,
  Barcode,
  Boxes,
  Download,
  Edit3,
  Eye,
  FileText,
  PackageCheck,
  Plus,
  Tags,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { Pagination } from "@/components/ui/Pagination";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { getApiErrorMessage } from "@/lib/api/client";
import { downloadCsv, parseCsv } from "@/lib/csv";
import {
  Product,
  ProductCategory,
  ProductCategoryRequest,
  ProductRequest,
} from "@/types/api";
import {
  Button,
  Card,
  ComplianceAlert,
  DataTable,
  MetricCard,
  notifyDashboard,
  PageHeader,
  StatusBadge,
  rowActions,
} from "../ui";

function productToValues(
  product: Product,
  categories: ProductCategory[],
): Record<string, string> {
  const category = product.category_id
    ? categories.find((item) => item.id === product.category_id)
    : undefined;
  return {
    Name: product.name,
    SKU: product.sku ?? "",
    "HSN code": product.hsn_code ?? "",
    Description: product.description ?? "",
    "Product type": product.product_type,
    "Unit price": String(product.unit_price ?? 0),
    "Cost price": product.cost_price == null ? "" : String(product.cost_price),
    "Tax/VAT rate": product.tax_rate == null ? "" : String(product.tax_rate),
    Currency: product.currency ?? "NGN",
    "Stock quantity":
      product.stock_quantity == null ? "" : String(product.stock_quantity),
    "Track inventory": product.track_inventory ? "yes" : "no",
    Status: product.status,
    Category: category?.name ?? product.category_id ?? "",
  };
}

function productPayload(
  data: Record<string, string>,
  categories: ProductCategory[],
): ProductRequest {
  const name = data.Name?.trim();
  if (!name) throw new Error("Item name is required.");
  const unitPrice = Number(data["Unit price"] || 0);
  if (!Number.isFinite(unitPrice) || unitPrice < 0)
    throw new Error("Unit price must be a valid amount.");
  const categoryInput = data.Category?.trim();
  const category = categoryInput
    ? categories.find(
        (item) =>
          item.id === categoryInput ||
          item.name.toLowerCase() === categoryInput.toLowerCase(),
      )
    : undefined;
  const costPrice = data["Cost price"] ? Number(data["Cost price"]) : undefined;
  const taxRate = data["Tax/VAT rate"]
    ? Number(data["Tax/VAT rate"])
    : undefined;
  const stockQuantity = data["Stock quantity"]
    ? Number(data["Stock quantity"])
    : undefined;

  return {
    name,
    sku: data.SKU?.trim() || undefined,
    hsn_code: data["HSN code"]?.trim() || undefined,
    description: data.Description?.trim() || undefined,
    product_type: data["Product type"]?.toLowerCase().includes("service")
      ? "service"
      : "product",
    unit_price: unitPrice,
    cost_price: Number.isFinite(costPrice) ? costPrice : undefined,
    tax_rate: Number.isFinite(taxRate) ? taxRate : undefined,
    currency: data.Currency?.trim() || "NGN",
    stock_quantity: Number.isFinite(stockQuantity) ? stockQuantity : undefined,
    track_inventory:
      data["Track inventory"]?.toLowerCase() === "true" ||
      data["Track inventory"]?.toLowerCase() === "yes",
    status: data.Status?.toLowerCase().includes("inactive")
      ? "inactive"
      : "active",
    category_id: category?.id,
  };
}

export function ProductsPage() {
  const { user } = useAuth();
  const { company } = useCompany(user?.company_id);
  const companyName = company?.company_name || user?.company_name || user?.trading_name || "Company";
  const {
    products,
    categories,
    pagination,
    pager,
    loading,
    error,
    create,
    createCategory,
    update,
    remove,
  } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const filteredProducts = products.filter((product) => {
    if (activeTab === "Products") return product.product_type === "product";
    if (activeTab === "Services") return product.product_type === "service";
    return true;
  });
  const categoryById = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  async function createCatalogItem(payload: ProductRequest) {
    try {
      await create(payload);
      setModalOpen(false);
    } catch (requestError) {
      throw new Error(
        getApiErrorMessage(requestError, "Unable to create catalog item."),
      );
    }
  }

  async function updateCatalogItem(payload: ProductRequest) {
    if (!editingProduct) return;
    try {
      await update(editingProduct.id, payload);
      setEditingProduct(null);
    } catch (requestError) {
      throw new Error(
        getApiErrorMessage(requestError, "Unable to update catalog item."),
      );
    }
  }

  async function deleteCatalogItem(product: Product) {
    if (
      !window.confirm(`Delete ${product.name}? This action cannot be undone.`)
    )
      return;
    try {
      await remove(product.id);
      notifyDashboard(`${product.name} deleted`);
    } catch (requestError) {
      notifyDashboard(
        getApiErrorMessage(requestError, "Unable to delete catalog item."),
      );
    }
  }

  function exportProducts() {
    downloadCsv(
      "products-and-services-full-export.csv",
      products.map((product) => ({
        company_name: companyName,
        name: product.name,
        sku: product.sku,
        hsn_code: product.hsn_code,
        description: product.description,
        product_type: product.product_type,
        category: product.category_id
          ? (categoryById.get(product.category_id) ?? product.category_id)
          : "",
        unit_price: product.unit_price,
        cost_price: product.cost_price,
        tax_rate: product.tax_rate,
        currency: product.currency,
        stock_quantity: product.stock_quantity,
        track_inventory: product.track_inventory ? "yes" : "no",
        status: product.status,
        generated_from: "PayTraka",
      })),
    );
  }

  async function importProducts(file?: File) {
    if (!file) return;
    try {
      if (!file.name.toLowerCase().endsWith(".csv"))
        throw new Error("Product imports currently support CSV files.");
      const rows = parseCsv(await file.text());
      for (const row of rows) {
        await create(
          productPayload(
            {
              Name: row.name,
              SKU: row.sku,
              "HSN code": row.hsn_code,
              Description: row.description,
              "Product type": row.product_type || row.type,
              "Unit price": row.unit_price,
              "Cost price": row.cost_price,
              "Tax/VAT rate": row.tax_rate || row.vat_rate,
              Currency: row.currency || "NGN",
              "Stock quantity": row.stock_quantity,
              "Track inventory": row.track_inventory,
              Status: row.status || "active",
              Category: row.category,
            },
            categories,
          ),
        );
      }
      notifyDashboard("Products and services imported successfully");
    } catch (requestError) {
      notifyDashboard(
        getApiErrorMessage(
          requestError,
          "Unable to import products and services.",
        ),
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Products & Services"
        subtitle="Inventory > Catalog Management"
        action={
          <>
            <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#C5C4DA] bg-white px-4 text-sm font-bold text-[#0001B1] hover:border-[#1117E8]">
              <Upload className="h-4 w-4" /> Import CSV
              <input
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={(event) =>
                  void importProducts(event.target.files?.[0])
                }
              />
            </label>
            <Button variant="secondary" onClick={exportProducts}>
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> Add New Item
            </Button>
          </>
        }
      />
      {modalOpen ? (
        <ProductFormDialog
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSave={createCatalogItem}
          onCreateCategory={async (data) => (await createCategory(data)).data}
        />
      ) : null}
      {editingProduct ? (
        <ProductFormDialog
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSave={updateCatalogItem}
          onCreateCategory={async (data) => (await createCategory(data)).data}
        />
      ) : null}
      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <MetricCard
          label="Total Items"
          value={String(pagination?.total ?? products.length)}
          meta="Catalog records"
        />
        <MetricCard
          label="Active Services"
          value={String(
            products.filter(
              (product) =>
                product.product_type === "service" &&
                product.status === "active",
            ).length,
          )}
          meta="Loaded service records"
        />
        <MetricCard
          label="Active Products"
          value={String(
            products.filter(
              (product) =>
                product.product_type === "product" &&
                product.status === "active",
            ).length,
          )}
          meta="Loaded product records"
        />
      </div>
      <Card className="mb-6 p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] sm:items-center">
          <input
            aria-label="Search products"
            value={pager.search}
            onChange={(event) => pager.setSearch(event.target.value)}
            placeholder="Search products, services, SKU or HSN"
            className="h-11 w-full rounded-xl border border-[#C5C4DA] px-4 text-sm outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]"
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", "Products", "Services"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${activeTab === tab ? "bg-[#1117E8] text-white" : "bg-[#F1F4F8] text-[#454557] hover:bg-[#DADEFD]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </Card>
      {error ? (
        <ComplianceAlert title="Unable to load products" text={error} />
      ) : null}
      <DataTable
        title="Inventory List"
        columns={[
          "Item Name",
          "SKU",
          "Type",
          "Category",
          "Unit Price",
          "Cost Price",
          "VAT Rate",
          "Stock",
          "Status",
          "Actions",
        ]}
        rows={filteredProducts.map((product) => ({
          "Item Name": <b>{product.name}</b>,
          SKU: product.sku ?? "-",
          Type: (
            <StatusBadge tone="primary">{product.product_type}</StatusBadge>
          ),
          Category: product.category_id
            ? (categoryById.get(product.category_id) ?? product.category_id)
            : "-",
          "Unit Price": (
            <b>
              <CurrencyAmount
                amount={product.unit_price}
                currency={product.currency}
              />
            </b>
          ),
          "Cost Price": (
            <CurrencyAmount
              amount={product.cost_price ?? 0}
              currency={product.currency}
            />
          ),
          "VAT Rate": product.tax_rate == null ? "-" : `${product.tax_rate}%`,
          Stock: product.track_inventory
            ? String(product.stock_quantity ?? 0)
            : "Not tracked",
          Status: <StatusBadge>{product.status}</StatusBadge>,
          Actions: rowActions(undefined, product.name, [
            {
              label: "View item",
              icon: Eye,
              onSelect: () => setViewingProduct(product),
            },
            {
              label: "Edit item",
              icon: Edit3,
              onSelect: () => setEditingProduct(product),
            },
            {
              label: "Delete item",
              icon: Trash2,
              tone: "danger",
              onSelect: () => void deleteCatalogItem(product),
            },
          ]),
        }))}
        footer={
          loading
            ? "Loading records..."
            : `Showing ${filteredProducts.length} of ${pagination?.total ?? products.length} items`
        }
        footerActions={
          <Pagination pagination={pagination} onPageChange={pager.setPage} />
        }
        loading={loading}
        hideDefaultActions
      />
      {viewingProduct ? (
        <ProductDetailsModal
          product={viewingProduct}
          categories={categories}
          onClose={() => setViewingProduct(null)}
        />
      ) : null}
    </>
  );
}

type ProductFormState = {
  name: string;
  sku: string;
  hsnCode: string;
  description: string;
  productType: "product" | "service";
  categoryId: string;
  unitPrice: string;
  costPrice: string;
  taxRate: string;
  currency: string;
  trackInventory: boolean;
  stockQuantity: string;
  status: "active" | "inactive";
};

function ProductFormDialog({
  product,
  categories,
  onClose,
  onSave,
  onCreateCategory,
}: {
  product?: Product;
  categories: ProductCategory[];
  onClose: () => void;
  onSave: (payload: ProductRequest) => Promise<void>;
  onCreateCategory: (
    payload: ProductCategoryRequest,
  ) => Promise<ProductCategory>;
}) {
  const [form, setForm] = useState<ProductFormState>({
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    hsnCode: product?.hsn_code ?? "",
    description: product?.description ?? "",
    productType: product?.product_type ?? "product",
    categoryId: product?.category_id ?? "",
    unitPrice: String(product?.unit_price ?? ""),
    costPrice: product?.cost_price == null ? "" : String(product.cost_price),
    taxRate: product?.tax_rate == null ? "7.5" : String(product.tax_rate),
    currency: product?.currency ?? "NGN",
    trackInventory: product?.track_inventory ?? false,
    stockQuantity:
      product?.stock_quantity == null ? "" : String(product.stock_quantity),
    status: product?.status ?? "active",
  });
  const [categoryMode, setCategoryMode] = useState(categories.length === 0);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function patch(values: Partial<ProductFormState>) {
    setForm((current) => ({ ...current, ...values }));
  }

  async function createNewCategory() {
    if (!categoryName.trim()) {
      setError("Enter a category name.");
      return;
    }
    setCreatingCategory(true);
    setError("");
    try {
      const category = await onCreateCategory({
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
      });
      patch({ categoryId: category.id });
      setCategoryName("");
      setCategoryDescription("");
      setCategoryMode(false);
      notifyDashboard(`${category.name} category created`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to create category."));
    } finally {
      setCreatingCategory(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const unitPrice = Number(form.unitPrice);
    const costPrice =
      form.costPrice === "" ? undefined : Number(form.costPrice);
    const taxRate = form.taxRate === "" ? undefined : Number(form.taxRate);
    const stockQuantity =
      form.stockQuantity === "" ? 0 : Number(form.stockQuantity);

    if (!form.name.trim()) return setError("Item name is required.");
    if (!form.categoryId) return setError("Select or create a category.");
    if (!Number.isFinite(unitPrice) || unitPrice < 0)
      return setError("Enter a valid unit price.");
    if (costPrice != null && (!Number.isFinite(costPrice) || costPrice < 0))
      return setError("Enter a valid cost price.");
    if (
      taxRate != null &&
      (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100)
    )
      return setError("VAT rate must be between 0 and 100.");
    if (
      form.trackInventory &&
      (!Number.isFinite(stockQuantity) || stockQuantity < 0)
    )
      return setError("Enter a valid stock quantity.");

    setSaving(true);
    setError("");
    try {
      await onSave({
        name: form.name.trim(),
        sku: form.sku.trim() || undefined,
        hsn_code: form.hsnCode.trim() || undefined,
        description: form.description.trim() || undefined,
        product_type: form.productType,
        category_id: form.categoryId,
        unit_price: unitPrice,
        cost_price: costPrice,
        tax_rate: taxRate,
        currency: form.currency,
        track_inventory: form.productType === "product" && form.trackInventory,
        stock_quantity:
          form.productType === "product" && form.trackInventory
            ? stockQuantity
            : undefined,
        status: form.status,
      });
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          `Unable to ${product ? "update" : "create"} item.`,
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-[#C5C4DA] bg-white px-3 text-sm text-[#191C1E] outline-none focus:border-[#1117E8] focus:ring-4 focus:ring-[#DADEFD]";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center overflow-hidden bg-[#191C1E]/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
      onMouseDown={onClose}
    >
      <Card
        className="flex max-h-[95dvh] w-full max-w-4xl flex-col overflow-hidden rounded-b-none shadow-2xl sm:rounded-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#C5C4DA] bg-[#F7F9FB] p-4 sm:p-6">
            <div>
              <h2
                id="product-form-title"
                className="text-xl font-extrabold sm:text-2xl"
              >
                {product ? "Edit Item" : "Add Product or Service"}
              </h2>
              <p className="mt-1 text-sm text-[#454557]">
                Set pricing, tax, category, and inventory behavior.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product form"
              className="rounded-lg p-2 text-[#454557] hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <Card className="p-4 sm:p-5">
                <h3 className="font-bold">Item details</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-bold text-[#454557] sm:col-span-2">
                    Name <span className="text-red-600">*</span>
                    <input
                      value={form.name}
                      onChange={(event) => patch({ name: event.target.value })}
                      placeholder="e.g. Website design"
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-bold text-[#454557]">
                    Product type <span className="text-red-600">*</span>
                    <select
                      value={form.productType}
                      onChange={(event) =>
                        patch({
                          productType: event.target
                            .value as ProductFormState["productType"],
                          trackInventory:
                            event.target.value === "service"
                              ? false
                              : form.trackInventory,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="product">Product</option>
                      <option value="service">Service</option>
                    </select>
                  </label>
                  {/* <label className="text-sm font-bold text-[#454557]">Status<select value={form.status} onChange={(event) => patch({ status: event.target.value as ProductFormState["status"] })} className={inputClass}><option value="active">Active</option><option value="inactive">Inactive</option></select></label> */}
                  {/* <label className="text-sm font-bold text-[#454557]">
                    SKU
                    <input
                      value={form.sku}
                      onChange={(event) => patch({ sku: event.target.value })}
                      placeholder="Optional stock code"
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-bold text-[#454557]">
                    HSN code
                    <input
                      value={form.hsnCode}
                      onChange={(event) =>
                        patch({ hsnCode: event.target.value })
                      }
                      placeholder="Tax classification code"
                      className={inputClass}
                    />
                  </label> */}
                  <label className="text-sm font-bold text-[#454557] sm:col-span-2">
                    Description
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        patch({ description: event.target.value })
                      }
                      rows={3}
                      placeholder="Describe the product or service"
                      className={`${inputClass} h-auto resize-none py-3`}
                    />
                  </label>
                </div>
              </Card>

              <Card className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold">Category</h3>
                  <button
                    type="button"
                    onClick={() => setCategoryMode((current) => !current)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0001B1]"
                  >
                    <Plus className="h-4 w-4" /> New category
                  </button>
                </div>
                {categories.length ? (
                  <label className="mt-4 block text-sm font-bold text-[#454557]">
                    Business category <span className="text-red-600">*</span>
                    <select
                      value={form.categoryId}
                      onChange={(event) =>
                        patch({ categoryId: event.target.value })
                      }
                      className={inputClass}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    <p className="font-bold">No categories yet</p>
                    <p className="mt-1">
                      Create your first business category below before saving
                      this item.
                    </p>
                  </div>
                )}
                {categoryMode ? (
                  <div className="mt-4 rounded-xl border border-[#C5C4DA] bg-[#F7F9FB] p-4">
                    <p className="flex items-center gap-2 font-bold">
                      <Tags className="h-4 w-4 text-[#1117E8]" /> Create
                      category
                    </p>
                    <label className="mt-3 block text-sm font-bold text-[#454557]">
                      Name <span className="text-red-600">*</span>
                      <input
                        value={categoryName}
                        onChange={(event) =>
                          setCategoryName(event.target.value)
                        }
                        placeholder="e.g. Consulting"
                        className={inputClass}
                      />
                    </label>
                    <label className="mt-3 block text-sm font-bold text-[#454557]">
                      Description
                      <textarea
                        value={categoryDescription}
                        onChange={(event) =>
                          setCategoryDescription(event.target.value)
                        }
                        rows={2}
                        placeholder="Optional category description"
                        className={`${inputClass} h-auto resize-none py-3`}
                      />
                    </label>
                    <Button
                      variant="secondary"
                      onClick={() => void createNewCategory()}
                      disabled={creatingCategory}
                      className="mt-3 w-full"
                    >
                      {creatingCategory ? "Creating…" : "Create Category"}
                    </Button>
                  </div>
                ) : null}
              </Card>

              <Card className="p-4 sm:p-5">
                <h3 className="font-bold">Pricing and tax</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-bold text-[#454557]">
                    Unit price <span className="text-red-600">*</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.unitPrice}
                      onChange={(event) =>
                        patch({ unitPrice: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-bold text-[#454557]">
                    Cost price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.costPrice}
                      onChange={(event) =>
                        patch({ costPrice: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-bold text-[#454557]">
                    VAT rate (%)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={form.taxRate}
                      onChange={(event) =>
                        patch({ taxRate: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-bold text-[#454557]">
                    Currency
                    <select
                      value={form.currency}
                      onChange={(event) =>
                        patch({ currency: event.target.value })
                      }
                      className={inputClass}
                    >
                      {["NGN", "USD", "GBP", "EUR"].map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </Card>

              <Card className="p-4 sm:p-5">
                <h3 className="font-bold">Inventory</h3>
                {form.productType === "service" ? (
                  <p className="mt-4 rounded-xl bg-[#F1F4F8] p-4 text-sm text-[#454557]">
                    Inventory tracking is unavailable for services.
                  </p>
                ) : (
                  <>
                    <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#C5C4DA] p-4">
                      <span>
                        <span className="block font-bold">Track inventory</span>
                        <span className="mt-1 block text-xs text-[#757588]">
                          Maintain an available stock quantity for this product.
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={form.trackInventory}
                        onChange={(event) =>
                          patch({ trackInventory: event.target.checked })
                        }
                        className="h-5 w-5 shrink-0 accent-[#1117E8]"
                      />
                    </label>
                    {form.trackInventory ? (
                      <label className="mt-4 block text-sm font-bold text-[#454557]">
                        Opening stock quantity
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={form.stockQuantity}
                          onChange={(event) =>
                            patch({ stockQuantity: event.target.value })
                          }
                          className={inputClass}
                        />
                      </label>
                    ) : null}
                  </>
                )}
              </Card>
            </div>
            {error ? (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#C5C4DA] bg-white p-4 sm:flex-row sm:justify-end sm:p-6">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || creatingCategory}>
              {saving ? "Saving…" : product ? "Update Item" : "Save Item"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function ProductDetailsModal({
  product,
  categories,
  onClose,
}: {
  product: Product;
  categories: ProductCategory[];
  onClose: () => void;
}) {
  const values = productToValues(product, categories);
  const category = values.Category || "Uncategorized";
  const isService = product.product_type === "service";
  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center overflow-hidden bg-[#191C1E]/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-details-title"
      onMouseDown={onClose}
    >
      <Card
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-b-none shadow-2xl sm:rounded-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#C5C4DA] bg-[#F7F9FB] p-4 sm:p-6">
          <div className="flex min-w-0 gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DADEFD] text-[#0001B1] sm:flex">
              {isService ? <FileText className="h-6 w-6" aria-hidden="true" /> : <PackageCheck className="h-6 w-6" aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-[#757588]">
                {isService ? "Service profile" : "Product profile"}
              </p>
              <h2 id="product-details-title" className="mt-1 break-words text-2xl font-extrabold">
                {product.name}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge tone={product.status === "active" ? "success" : "neutral"}>
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  {product.status}
                </StatusBadge>
                <StatusBadge tone="primary">{product.product_type}</StatusBadge>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="rounded-lg p-2 text-[#454557] hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#DCE0E8] bg-white p-4">
              <Tags className="h-5 w-5 text-[#1117E8]" aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase text-[#757588]">Category</p>
              <p className="mt-1 break-words text-sm font-bold">{category}</p>
            </div>
            <div className="rounded-xl border border-[#DCE0E8] bg-white p-4">
              <Barcode className="h-5 w-5 text-[#1117E8]" aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase text-[#757588]">SKU / HSN</p>
              <p className="mt-1 break-words text-sm font-bold">
                {[values.SKU, values["HSN code"]].filter(Boolean).join(" / ") || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-[#DCE0E8] bg-white p-4">
              <Boxes className="h-5 w-5 text-[#1117E8]" aria-hidden="true" />
              <p className="mt-4 text-xs font-bold uppercase text-[#757588]">Inventory</p>
              <p className="mt-1 break-words text-sm font-bold">
                {values["Track inventory"] === "yes" ? `${values["Stock quantity"] || 0} in stock` : "Not tracked"}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-[#DCE0E8] bg-[#F7F9FB] p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-[#191C1E]">
              <FileText className="h-4 w-4 text-[#1117E8]" aria-hidden="true" />
              Description
            </p>
            <p className="mt-2 text-sm leading-6 text-[#454557]">
              {values.Description || "No description provided for this catalog item."}
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <section className="rounded-xl border border-[#DCE0E8] bg-white p-4">
              <h3 className="font-bold text-[#191C1E]">Pricing and tax</h3>
              <dl className="mt-4 divide-y divide-[#DCE0E8]">
                {[
                  ["Unit price", `${values.Currency} ${Number(values["Unit price"] || 0).toLocaleString("en-NG")}`],
                  ["Cost price", values["Cost price"] ? `${values.Currency} ${Number(values["Cost price"]).toLocaleString("en-NG")}` : "-"],
                  ["VAT rate", values["Tax/VAT rate"] ? `${values["Tax/VAT rate"]}%` : "-"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="font-semibold text-[#757588]">{label}</dt>
                    <dd className="text-right font-bold text-[#191C1E]">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="rounded-xl border border-[#DCE0E8] bg-white p-4">
              <h3 className="font-bold text-[#191C1E]">Metadata</h3>
              <dl className="mt-4 space-y-3">
                {[
                  ["Type", values["Product type"]],
                  ["Status", values.Status],
                  ["Currency", values.Currency],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-[#757588]">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-[#191C1E]">{value || "-"}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-[#C5C4DA] p-4 sm:flex-row sm:justify-end sm:p-6">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  );
}
