import { MapPin, Calendar, LayoutGrid, ChevronDown, Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="bg-white rounded-xl md:rounded-full shadow-lg p-4 md:p-2 flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto w-full border border-slate-100 gap-2 md:gap-0">
      
      {/* Where Input */}
      <div className="w-full md:flex-1 flex items-center px-2 md:px-6 py-2 md:py-0 gap-3">
        <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <input 
          type="text" 
          placeholder="Where?" 
          className="w-full bg-transparent outline-none text-blue placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Separator - Desktop */}
      <div className="hidden md:block w-[1px] h-10 bg-slate-200"></div>
      {/* Separator - Mobile */}
      <div className="md:hidden w-full h-[1px] bg-slate-100"></div>

      {/* Category Dropdown */}
      <div className="w-full md:flex-1 flex items-center px-2 md:px-6 py-2 md:py-0 justify-between cursor-pointer group">
        <div className="flex items-center gap-3">
          <LayoutGrid className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
          <span className="text-slate-600 font-medium group-hover:text-blue transition-colors">Category</span>
        </div>
        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
      </div>

      {/* Separator - Desktop */}
      <div className="hidden md:block w-[1px] h-10 bg-slate-200"></div>
      {/* Separator - Mobile */}
      <div className="md:hidden w-full h-[1px] bg-slate-100"></div>

      {/* Add Dates Input & Button Container */}
      <div className="w-full md:flex-1 flex flex-col md:flex-row items-center md:pl-6 md:pr-2 gap-4 md:gap-3 justify-between mt-2 md:mt-0">
        <div className="flex items-center px-2 md:px-0 gap-3 w-full cursor-text py-2 md:py-0">
          <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Add dates" 
            className="w-full bg-transparent outline-none text-blue placeholder:text-slate-400 font-medium"
          />
        </div>
        
        {/* Search Button */}
        <button className="w-full md:w-auto bg-button-dark hover:bg-button-dark-hover text-white p-4 rounded-xl md:rounded-full flex-shrink-0 transition-colors shadow-md flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          <span className="md:hidden font-semibold">Search</span>
        </button>
      </div>

    </div>
  );
};

export default SearchBar;
