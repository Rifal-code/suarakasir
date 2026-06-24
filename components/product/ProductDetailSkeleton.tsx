"use client";

import React from "react";

export default function ProductDetailSkeleton() {
  return (
    <>
      {/* ====== MOBILE SKELETON (< lg) ====== */}
      <div className="lg:hidden animate-pulse">
        {/* Mobile Image */}
        <div className="aspect-[4/3] w-full bg-border-default"></div>

        {/* Mobile Content */}
        <div className="px-4 pt-4 pb-28">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 bg-border-default rounded-full w-20"></div>
            <div className="h-5 bg-border-default rounded-full w-24"></div>
          </div>

          {/* Name */}
          <div className="h-6 bg-border-default rounded w-[75%] mb-2"></div>

          {/* Price */}
          <div className="h-7 bg-border-default rounded w-[45%] mb-4"></div>

          {/* Divider */}
          <div className="h-px bg-border-default mb-4"></div>

          {/* Info rows */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-border-default rounded w-20"></div>
              <div className="h-4 bg-border-default rounded w-16"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-border-default rounded w-24"></div>
              <div className="h-4 bg-border-default rounded w-28"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-border-default rounded w-14"></div>
              <div className="h-5 bg-border-default rounded-full w-20"></div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border-default mb-4"></div>

          {/* Description label */}
          <div className="h-4 bg-border-default rounded w-28 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3.5 bg-border-default rounded w-full"></div>
            <div className="h-3.5 bg-border-default rounded w-[85%]"></div>
            <div className="h-3.5 bg-border-default rounded w-[60%]"></div>
          </div>
        </div>
      </div>

      {/* ====== DESKTOP SKELETON (≥ lg) ====== */}
      <div className="hidden lg:block max-w-[960px] mx-auto pb-10 px-6 animate-pulse">
        {/* Back link */}
        <div className="h-4 bg-border-default rounded-full w-32 mb-5"></div>

        <div className="bg-card rounded-2xl border border-border-soft overflow-hidden flex">
          {/* Left: Image */}
          <div className="w-[380px] shrink-0 bg-background p-6">
            <div className="aspect-square w-full rounded-xl bg-border-default"></div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 p-6">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 bg-border-default rounded-full w-20"></div>
              <div className="h-5 bg-border-default rounded-full w-24"></div>
            </div>

            {/* Name */}
            <div className="h-7 bg-border-default rounded w-[65%] mb-3"></div>

            {/* Price */}
            <div className="h-8 bg-border-default rounded w-[40%] mb-5"></div>

            {/* Divider */}
            <div className="h-px bg-border-default mb-5"></div>

            {/* Info rows */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-border-default rounded w-24"></div>
                <div className="h-4 bg-border-default rounded w-16"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-border-default rounded w-28"></div>
                <div className="h-4 bg-border-default rounded w-32"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-border-default rounded w-16"></div>
                <div className="h-5 bg-border-default rounded-full w-20"></div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border-default mb-5"></div>

            {/* Description */}
            <div className="h-4 bg-border-default rounded w-28 mb-3"></div>
            <div className="space-y-2 mb-6">
              <div className="h-3.5 bg-border-default rounded w-full"></div>
              <div className="h-3.5 bg-border-default rounded w-[90%]"></div>
              <div className="h-3.5 bg-border-default rounded w-[70%]"></div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <div className="h-10 bg-border-default rounded-xl flex-1"></div>
              <div className="h-10 bg-border-default rounded-xl w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
