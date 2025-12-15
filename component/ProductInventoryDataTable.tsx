/* eslint-disable */
// @ts-nocheck
"use client";

import TrashIcon from "@/assets/icons/TrashIcon";
import EditIcon from "@/assets/images/edit-01.svg";
import InputCheckbox from "@/ui/InputCheckbox";
import ShopifyIcon from "@/assets/images/shopify-black-logotic.png";
import WixIcon from "@/assets/images/wix.svg";
import AmazoIcon from "@/assets/images/amazon.svg";
import FlipkartIcon from "@/assets/images/simple-icons_flipkart.svg";
import DefaultIcon from "@/assets/images/ri_building-fill.svg";
import WooCommerceIcon from "@/assets/images/wooIcon.png";
import ONDCIcon from "@/assets/images/Ondc icon.svg";
import InfoCircle from "@/assets/images/info-circle.svg";
import { useEffect, useState } from "react";
import { cn } from "@/lib/helper";
import { ProcessedInventory } from "@/utils/InventoryDataConventer";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProductDataTableType = {
  products: ProcessedInventory[];
};

export function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

function ProductInventoryDataTable({ products }: ProductDataTableType) {
  const router = useRouter();
  return (
    <div className="w-full overflow-x-auto">
      {/* Desktop View */}
      <table className="hidden md:table table-auto w-full">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th
              className="text-gray-600 text-xs font-medium p-3 text-start cursor-pointer"
              onClick={() => handleSort("title")}
            ></th>
            <th className="text-gray-600 text-xs font-medium p-3 gap-1 text-start">
              <div className="flex items-center gap-2">Product Status</div>
            </th>
            <th className="text-gray-600 text-xs font-medium p-3 gap-1 text-start">
              <div className="flex items-center gap-2">Sales Channel</div>
            </th>
            <th className="text-gray-600 text-xs font-medium p-3 gap-1 text-start">
              <div className="flex items-center gap-2">Category</div>
            </th>
            <th className="text-gray-600 text-xs font-medium p-3 gap-1 text-start"></th>
          </tr>
        </thead>
        <tbody>
          {products?.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
                  No Product found.
                </div>
              </td>
            </tr>
          ) : (
            products.map((item, idx) => (
              <tr
                className="h-[72px] border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 ease-in-out cursor-pointer"
                key={idx}
              >
                <td className="flex items-center gap-3 px-2 ps-6 py-4 w-fit">
                  <div className="flex gap-2 items-center">
                    <div className="relative w-10 h-10 flex justify-center items-center">
                      <Image
                        src={item.assets[0]?.assetUrl || "/placeholder.png"}
                        alt={item.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-900">
                        {truncateText(item.title, 60)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.variants.sku}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div
                    className={cn(
                      "px-3 py-1 border text-sm font-medium rounded-2xl w-fit flex items-center",
                      {
                        "border-Success-200 bg-Success-50 text-Success-700":
                          item.status === "ACTIVE",
                      },
                      {
                        "border-Warning-200 bg-Warning-50 text-Warning-700":
                          item.status === "DRAFT",
                      }
                    )}
                  >
                    {item.status}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-4 items-center flex-wrap">
                    {item.variants[0]?.channels.includes("AMAZON_IN") && (
                      <Image
                        src={AmazoIcon}
                        alt="amazon-icon"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                        unoptimized
                      />
                    )}
                    {item.variants[0]?.channels.includes("FLIPKART") && (
                      <Image
                        src={FlipkartIcon}
                        alt="flipkart-icon"
                        width={20}
                        height={20}
                        className="w-10 h-10"
                      />
                    )}
                    {item.variants[0]?.channels.includes("DEFAULT") && (
                      <Image
                        src={DefaultIcon}
                        alt="default-icon"
                        width={20}
                        height={20}
                        className="w-10 h-10"
                      />
                    )}
                    {item.variants[0]?.channels.includes("ONDC") && (
                      <Image
                        src={ONDCIcon}
                        alt="ondc-icon"
                        width={20}
                        height={20}
                        className="w-10 h-10"
                      />
                    )}
                    {item.variants[0]?.channels.includes("WOOCOMMERCE") && (
                      <Image
                        src={WooCommerceIcon}
                        alt="woocommerce-icon"
                        width={20}
                        height={20}
                        className="w-10"
                      />
                    )}
                    {item.variants[0]?.channels.includes("SHOPIFY") && (
                      <Image
                        src={ShopifyIcon}
                        alt="shopify-icon"
                        width={20}
                        height={20}
                        className="w-10"
                        priority
                      />
                    )}
                    {item.variants[0]?.channels.includes("WIX") && (
                      <Image
                        src={WixIcon}
                        width={20}
                        height={20}
                        alt="wix-icon"
                        className="w-10"
                      />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600">
                    {item.categoryName}
                  </div>
                </td>
                <td className="p-4">
                  {!item.isReviewed && (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/dashboard/feedback-form?productId=${item.id}`
                        )
                      }
                      className="w-full text-center text-sm font-medium text-orange-600 border border-orange-300 bg-orange-50 hover:bg-orange-100 active:scale-[0.97] transition-all rounded-lg py-2"
                    >
                      Give Feedback
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile View - Card Layout */}
      <div className="md:hidden space-y-4">
        {products?.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            No Product found.
          </div>
        ) : (
          products.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow duration-300"
            >
              {/* Product Header */}
              <div className="flex gap-3">
                <div className="relative w-12 h-12 shrink-0">
                  <Image
                    src={item.assets[0]?.assetUrl || "/placeholder.png"}
                    alt={item.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover rounded"
                    sizes="100vw"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {truncateText(item.title, 40)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {item.variants[0].sku}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Product Status */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Product Status</p>
                <div
                  className={cn(
                    "px-3 py-1 border text-xs font-medium rounded-2xl w-fit flex items-center",
                    {
                      "border-Success-200 bg-Success-50 text-Success-700":
                        item.status === "ACTIVE",
                    },
                    {
                      "border-Warning-200 bg-Warning-50 text-Warning-700":
                        item.status === "DRAFT",
                    }
                  )}
                >
                  {item.status}
                </div>
              </div>

              {/* Sales Channels */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Sales Channels</p>
                <div className="flex gap-2 flex-wrap items-center">
                  {item.variants[0]?.channels.includes("AMAZON_IN") && (
                    <Image
                      src={AmazoIcon}
                      alt="amazon-icon"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                      unoptimized
                    />
                  )}
                  {item.variants[0]?.channels.includes("FLIPKART") && (
                    <Image
                      src={FlipkartIcon}
                      alt="flipkart-icon"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                  )}
                  {item.variants[0]?.channels.includes("DEFAULT") && (
                    <Image
                      src={DefaultIcon}
                      alt="default-icon"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                  )}
                  {item.variants[0]?.channels.includes("ONDC") && (
                    <Image
                      src={ONDCIcon}
                      alt="ondc-icon"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                  )}
                  {item.variants[0]?.channels.includes("WOOCOMMERCE") && (
                    <Image
                      src={WooCommerceIcon}
                      alt="woocommerce-icon"
                      width={20}
                      height={20}
                      className="w-7 h-7"
                    />
                  )}
                  {item.variants[0]?.channels.includes("SHOPIFY") && (
                    <Image
                      src={ShopifyIcon}
                      alt="shopify-icon"
                      width={20}
                      height={20}
                      className="w-7 h-7"
                      priority
                    />
                  )}
                  {item.variants[0]?.channels.includes("WIX") && (
                    <Image
                      src={WixIcon}
                      width={20}
                      height={20}
                      alt="wix-icon"
                      className="w-7 h-7"
                    />
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-sm text-gray-700">{item.categoryName}</p>
              </div>
              {!item.isReviewed && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/feedback-form?productId=${item.id}`
                      )
                    }
                    className="w-full text-center text-sm font-medium text-orange-600 
               border border-orange-300 bg-orange-50 
               hover:bg-orange-100 active:scale-[0.97]
               transition-all rounded-lg py-2"
                  >
                    Give Feedback
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductInventoryDataTable;
