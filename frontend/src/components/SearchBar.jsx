import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
];

const SORT_OPTIONS = [
  { value: "", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function SearchBar({ onSearch, onCategoryChange, onSortChange }) {
  const [searchText, setSearchText] = useState("");
  const debounceRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(searchText.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors duration-200">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 text-stone-900 placeholder-stone-400 text-sm transition-all duration-200 input-focus-ring focus:bg-white"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <select
            onChange={(e) => onCategoryChange(e.target.value === "All Categories" ? "" : e.target.value)}
            defaultValue="All Categories"
            className="w-full sm:w-44 appearance-none bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-4 pr-9 text-stone-700 text-sm font-medium transition-all duration-200 input-focus-ring focus:bg-white cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            onChange={(e) => onSortChange(e.target.value)}
            defaultValue=""
            className="w-full sm:w-44 appearance-none bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-4 pr-9 text-stone-700 text-sm font-medium transition-all duration-200 input-focus-ring focus:bg-white cursor-pointer"
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
    </div>
  );
}
