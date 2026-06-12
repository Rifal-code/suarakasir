"use client";

import { useState } from "react";

export default function CategoryFilter() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const filters = ["All", "Trending", "Newest", "Recent Sales"];

  return (
    <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar pb-2">
      <div className="flex gap-2 min-w-max">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === filter 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-card text-text-secondary hover:text-primary border border-border-soft hover:border-primary/30"
            }`}
          >
            {filter}
          </button>
        ))}
        <button className="px-3 py-2 rounded-full bg-card border border-border-soft text-text-secondary hover:text-primary transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>
      
      <div className="hidden md:flex gap-2 bg-background p-1 rounded-xl border border-border-soft ml-4">
        <button className="p-2 bg-white rounded-lg shadow-sm text-text-primary">
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
        </button>
        <button className="p-2 text-text-muted hover:text-text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
        </button>
      </div>
    </div>
  );
}
