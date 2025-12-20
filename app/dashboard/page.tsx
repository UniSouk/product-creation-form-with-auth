"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Plus, LayoutDashboard, Package, TrendingUp, ArrowRight, Menu, X } from "lucide-react";
import { api } from "@/lib/axios";
import ProductInventoryDataTable from "@/component/ProductInventoryDataTable";
import { ProcessedInventory } from "@/utils/InventoryDataConventer";

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<ProcessedInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openRow, setOpenRow] = useState<string | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/products");
        const data = res.data.data;
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (error) {
        if (error.response) {
          console.error(
            "Failed to fetch products:",
            error.response.data?.message || error.response.status
          );
        } else {
          console.error("Failed to fetch products:", error.message);
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <main className="flex-1 pb-12">
        {/* Header Section */}
        <div className="mb-8 md:mb-12 md:pt-8 px-0 sm:px-6 md:px-8 max-md:mt-4">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2 md:mb-3">
              Welcome back, {session?.user?.name?.split(" ")[0]}
            </h1>
            <p className="text-base md:text-lg text-gray-500">
              Manage and organize your product catalog with ease
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-0 sm:px-6 md:px-8 mb-8 md:mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {/* Total Products Card */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-6 md:p-8 hover:border-brand-600-orange-p-1/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-brand-600-orange-p-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-brand-600-orange-p-1/10 group-hover:bg-brand-600-orange-p-1/20 transition-colors">
                    <Package className="w-6 h-6 text-brand-600-orange-p-1" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Products</p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{products.length}</p>
                <p className="text-xs text-gray-500 mt-3">Across all channels</p>
              </div>
            </div>

            {/* Active Channels Card */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-6 md:p-8 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <LayoutDashboard className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">Active Channels</p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">5</p>
                <p className="text-xs text-gray-500 mt-3">Connected integrations</p>
              </div>
            </div>

          </div>
        </div>

        {/* Products Section */}
        <div className="px-0 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-0 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Products</h2>
              <p className="text-sm text-gray-500 mt-1">
                {products.length} {products.length === 1 ? "product" : "products"} in your catalog
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/product-create")}
              className="w-full hidden sm:w-auto md:inline-flex items-center justify-center sm:justify-start gap-2 bg-brand-600-orange-p-1 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-[#e15123] hover:shadow-lg hover:shadow-brand-600-orange-p-1/20 transition-all duration-200 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="hidden sm:inline">New Product</span>
              <span className="sm:hidden">Add Product</span>
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600-orange-p-1 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium text-center px-4">Loading products...</p>
            </div>
          ) : products?.length === 0 ? (
            <EmptyState router={router} />
          ) : (
            <div className="md:bg-white rounded-2xl md:border md:border-gray-200 overflow-hidden md:shadow-sm hover:shadow-md transition-shadow">
              <ProductInventoryDataTable products={products} />
            </div>
          )}
        </div>

        {/* Mobile Floating Action Button */}
        <button
          onClick={() => router.push("/dashboard/product-create")}
          className="md:hidden fixed bottom-6 right-6 bg-brand-600-orange-p-1 text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:bg-[#e15123] transition-all duration-200 z-40"
        >
          <Plus className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
}

function EmptyState({ router }: { router: any }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 p-8 sm:p-12 md:p-16 text-center bg-linear-to-br from-gray-50 to-gray-50 hover:border-brand-600-orange-p-1/40 transition-colors duration-200 group">
      <div className="absolute inset-0 bg-linear-to-br from-brand-600-orange-p-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-brand-600-orange-p-1/10 mb-4 sm:mb-6 group-hover:bg-brand-600-orange-p-1/20 transition-colors">
          <Package className="w-8 sm:w-10 h-8 sm:h-10 text-brand-600-orange-p-1" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No products yet</h3>
        <p className="text-gray-600 text-sm sm:text-base mb-8 sm:mb-10 max-w-sm mx-auto leading-relaxed px-2">
          Your product catalog is empty. Create your first product.
        </p>
      </div>
    </div>
  );
}