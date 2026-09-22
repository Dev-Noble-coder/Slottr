import { useState, useEffect } from 'react';
import ListingCard from '../../../components/ui/ListingCard';
import { Link } from 'react-router-dom';
import { useListings } from '../../../hooks/useListing';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedListingsProps {
  activeCategory: string;
}

const ITEMS_PER_PAGE = 8;

const FeaturedListings = ({ activeCategory }: FeaturedListingsProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const { data: listings, isLoading, isError } = useListings({ 
    type: activeCategory, 
    page: currentPage, 
    limit: ITEMS_PER_PAGE 
  });

  // Handle nested data structures gracefully (backend paginated { data: [...], pagination: {...} } or flat array)
  const listingsArray = Array.isArray(listings?.data) ? listings.data : (Array.isArray(listings) ? listings : []);
  const filteredListings = listingsArray.filter((listing: any) => {
    if (!activeCategory) return true;
    return (listing.type || '').toUpperCase() === activeCategory.toUpperCase() || 
           (listing.category || '').toUpperCase() === activeCategory.toUpperCase();
  });

  // Determine pagination metadata from backend or client fallback
  const backendPagination = listings?.pagination;
  const isServerPaginated = Boolean(backendPagination && backendPagination.totalPages !== undefined);

  const totalPages = isServerPaginated 
    ? Math.max(Number(backendPagination?.totalPages) || 1, 1)
    : Math.ceil(filteredListings.length / ITEMS_PER_PAGE) || 1;

  // If server paginated, data is already sliced. Otherwise slice locally
  const displayedListings = isServerPaginated 
    ? filteredListings 
    : filteredListings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 mt-16 mb-24 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 mt-16 mb-24 min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load listings.</p>
      </div>
    );
  }

  // Generate visible page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
      pageNumbers.push('...');
    }
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 mt-16 mb-24 min-h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-blue">
          Featured in {activeCategory}
        </h2>
        {filteredListings.length > 0 && (
          <span className="text-xs text-slate-500 font-medium px-3 py-1 bg-white border border-slate-200 rounded-full">
            Showing Page {currentPage} of {totalPages}
          </span>
        )}
      </div>
      
      {displayedListings.length > 0 ? (
        <div className="flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedListings.map((listing: any) => {
              // Extract first image if it's an array, or use directly if it's a string, else fallback
              let imageSrc = "https://placehold.co/600x400/eeeeee/1E293B?text=No+Image";
              if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
                imageSrc = listing.images[0];
              } else if (typeof listing.images === 'string') {
                imageSrc = listing.images;
              }

              const locationText = [listing.streetAddress, listing.state, listing.country].filter(Boolean).join(', ') 
                || listing.location 
                || 'Location not specified';

              const pricingUnitText = listing.pricingUnit 
                ? listing.pricingUnit.toLowerCase() 
                : (listing.unit || 'slot');

              return (
                <Link to={`/listing/${listing.id}`} key={listing.id} className="block group">
                  <div className="h-full transition-transform duration-300 group-hover:-translate-y-1">
                    <ListingCard
                      title={listing.title}
                      location={locationText}
                      price={listing.price}
                      unit={pricingUnitText}
                      type={listing.type}
                      imageSrc={imageSrc}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Interactive Pagination UI */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent font-medium text-xs sm:text-sm transition-all inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5 mx-1">
                {pageNumbers.map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="text-slate-400 px-2 font-bold text-xs">
                        ...
                      </span>
                    );
                  }

                  const isCurrent = currentPage === p;
                  return (
                    <button
                      key={`page-${p}`}
                      onClick={() => handlePageChange(Number(p))}
                      className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold text-xs transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-button-dark text-white shadow-xs'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-200 rounded-full text-blue hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent font-medium text-xs sm:text-sm transition-all inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 bg-white border border-slate-200 rounded-3xl text-slate-500 shadow-xs">
          <p className="font-bold text-lg text-blue mb-1">No listings found</p>
          <p className="text-xs text-slate-400">We couldn't find any active spaces for this category.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedListings;
