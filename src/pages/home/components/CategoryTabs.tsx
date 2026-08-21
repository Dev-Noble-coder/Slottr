interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const LISTING_TYPES = [
    "EVENT",
    "ROOM",
    "RIDE",
    "ITEM",
    "SERVICE",
    "ITEMS",
    "VENUE",
    "RIDES",
    "PROPERTY",
    "OTHERS",
];

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 mt-8">
      {/* Container for scrolling if needed on smaller screens */}
      <div className="flex w-full gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {LISTING_TYPES.map((category, index) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={index}
              onClick={() => onCategoryChange(category)}
              className={`flex-1 min-w-[140px] px-2 py-2.5 rounded-full text-sm font-semibold border transition-colors overflow-hidden truncate capitalize ${
                isActive
                  ? 'bg-button-dark text-white border-button-dark'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {category.toLowerCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
