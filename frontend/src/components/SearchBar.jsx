import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  "All Categories",
  "Fashion",
  "Electronics",
  "Home & Living",
  "Beauty",
];

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function SearchBar({ activeCategory, onSearch, onCategoryChange, onSortChange }) {
  const [searchText, setSearchText] = useState("");
  const debounceRef = useRef(null);

  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchRef.current?.(searchText.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchText]); 

  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d7] shadow-xs p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#191716] transition-colors duration-200">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by keyword, item, or silhouette..."
            className="w-full bg-[#fbf9f5] hover:bg-white border border-[#e8e2d7] rounded-xl py-2.5 pl-10 pr-9 text-[#191716] placeholder-stone-400 text-sm transition-all duration-200 input-focus-ring focus:bg-white"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-[#191716]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative sm:w-48 shrink-0">
          <select
            onChange={(e) => onSortChange(e.target.value)}
            defaultValue=""
            className="w-full appearance-none bg-[#fbf9f5] hover:bg-white border border-[#e8e2d7] rounded-xl py-2.5 pl-4 pr-9 text-xs uppercase tracking-wider font-semibold text-[#191716] transition-all duration-200 input-focus-ring focus:bg-white cursor-pointer"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mr-1 hidden sm:inline">
          Filter:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = (cat === "All Categories" && !activeCategory) || activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat === "All Categories" ? "" : cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200
                ${isSelected
                  ? "bg-[#191716] text-white shadow-xs"
                  : "bg-[#f4efe6] text-stone-600 hover:text-[#191716] hover:bg-[#ebe5db]"
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
