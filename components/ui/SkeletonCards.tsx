"use client";

import React from "react";

export function SkeletonSummaryCard() {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm flex flex-col justify-between h-full animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 bg-border-default rounded w-1/2"></div>
        <div className="w-10 h-10 rounded-2xl bg-border-default"></div>
      </div>
      <div className="flex items-center gap-3 mb-6 mt-4">
        <div className="h-8 bg-border-default rounded w-3/4"></div>
        <div className="h-5 bg-border-default rounded w-16"></div>
      </div>
      <div className="border-t border-border-soft pt-4 mt-auto flex justify-between items-center">
        <div className="h-4 bg-border-default rounded w-1/3"></div>
        <div className="w-4 h-4 rounded-full bg-border-default"></div>
      </div>
    </div>
  );
}

export function SkeletonBarChart() {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm h-full flex flex-col animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="h-4 bg-border-default rounded w-32 mb-2"></div>
          <div className="flex items-center gap-3">
            <div className="h-8 bg-border-default rounded w-48"></div>
            <div className="h-5 bg-border-default rounded w-16"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 mt-4 relative min-h-[150px] flex items-end justify-between sm:justify-around gap-2 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center flex-1 min-w-[32px] max-w-[48px] h-full justify-end">
            <div className="w-full bg-border-default rounded-t-xl" style={{ height: `${20 + Math.random() * 80}%` }}></div>
            <div className="h-4 bg-border-default rounded-full w-8 mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm animate-pulse w-full overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="h-5 bg-border-default rounded w-40 mb-2"></div>
          <div className="h-3 bg-border-default rounded w-64"></div>
        </div>
        <div className="w-24 h-8 bg-border-default rounded-full"></div>
      </div>
      
      <div className="w-full">
        <div className="flex gap-4 border-b border-border-soft pb-4 mb-4">
          <div className="h-4 bg-border-default rounded w-16"></div>
          <div className="h-4 bg-border-default rounded flex-1"></div>
          <div className="h-4 bg-border-default rounded w-24 hidden md:block"></div>
          <div className="h-4 bg-border-default rounded w-24"></div>
          <div className="h-4 bg-border-default rounded w-20 hidden sm:block"></div>
        </div>
        
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center border-b border-border-soft/50 py-4 last:border-0">
            <div className="h-4 bg-border-default rounded w-16"></div>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-border-default shrink-0"></div>
              <div className="h-4 bg-border-default rounded w-3/4"></div>
            </div>
            <div className="h-4 bg-border-default rounded w-24 hidden md:block"></div>
            <div className="h-4 bg-border-default rounded w-24"></div>
            <div className="h-6 bg-border-default rounded-full w-20 hidden sm:block"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-2xl flex flex-col overflow-hidden border border-border-soft animate-pulse">
      <div className="aspect-[4/3] w-full bg-border-default rounded-t-2xl"></div>
      <div className="p-3 bg-sidebar flex flex-col flex-1 h-[88px] relative">
        <div className="h-4 bg-border-default/30 rounded w-full mb-1"></div>
        <div className="h-4 bg-border-default/30 rounded w-2/3 mb-2"></div>
        <div className="mt-auto h-5 bg-border-default/30 rounded w-1/2"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-border-default/30"></div>
      </div>
    </div>
  );
}

export function SkeletonProfileHeader() {
  return (
    <div className="bg-sidebar p-8 md:p-12 relative overflow-hidden rounded-t-[32px] md:rounded-[40px] animate-pulse">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-border-default/30 border-4 border-black border-opacity-40"></div>
        </div>
        <div className="flex flex-col items-center md:items-start flex-1 gap-3 w-full max-w-sm">
          <div className="h-8 bg-border-default/30 rounded w-3/4 mb-1"></div>
          <div className="h-4 bg-border-default/30 rounded w-1/2 mb-2"></div>
          <div className="flex items-center gap-3 w-full">
            <div className="h-10 bg-border-default/30 rounded-xl w-32"></div>
            <div className="h-10 bg-border-default/30 rounded-xl w-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonProfileForm() {
  return (
    <div className="p-6 md:p-10 flex-1 animate-pulse max-w-4xl mx-auto w-full">
      <div className="h-6 bg-border-default rounded w-48 mb-8"></div>
      
      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 bg-border-default rounded w-24"></div>
            <div className="h-12 bg-border-default rounded-xl w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-border-default rounded w-24"></div>
            <div className="h-12 bg-border-default rounded-xl w-full"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-border-default rounded w-24"></div>
          <div className="h-12 bg-border-default rounded-xl w-full"></div>
        </div>
        
        <div className="border-t border-border-soft pt-6 mt-6 flex justify-end">
          <div className="h-12 bg-border-default rounded-xl w-full md:w-32"></div>
        </div>
      </div>
    </div>
  );
}
