import ListingCard from '../../../components/ui/ListingCard';
import { Link } from 'react-router-dom';
import { useListings } from '../../../hooks/useListing';

interface FeaturedListingsProps {
  activeCategory: string;
}

const FeaturedListings = ({ activeCategory }: FeaturedListingsProps) => {
  const { data: listings, isLoading, isError } = useListings();

  // Handle nested data structures gracefully
  const listingsArray = Array.isArray(listings?.data) ? listings.data : (Array.isArray(listings) ? listings : []);
  const filteredListings = listingsArray.filter((listing: any) => listing.type === activeCategory || listing.category === activeCategory);

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

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 mt-16 mb-24 min-h-[400px]">
      <h2 className="text-2xl font-bold text-blue mb-8">
        Featured in {activeCategory}
      </h2>
      
      {filteredListings.length > 0 ? (
        <div className="flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredListings.map((listing: any) => {
              // Extract first image if it's an array, or use directly if it's a string, else fallback
              let imageSrc = "https://placehold.co/600x400/eeeeee/1E293B?text=No+Image";
              if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
                imageSrc = listing.images[0];
              } else if (typeof listing.images === 'string') {
                imageSrc = listing.images;
              }

              return (
                <Link to={`/listing/${listing.id}`} key={listing.id} className="block group">
                  <div className="h-full transition-transform duration-300 group-hover:-translate-y-1">
                    <ListingCard
                      title={listing.title}
                      location={listing.location}
                      price={listing.price}
                      unit={listing.unit || 'booking'}
                      type={listing.type}
                      imageSrc={imageSrc}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination UI */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 font-medium text-sm transition-colors" disabled>
              Previous
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-button-dark text-white font-medium text-sm transition-colors">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
              3
            </button>
            <span className="text-slate-400 px-2">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
              8
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-blue hover:bg-slate-50 font-medium text-sm transition-colors">
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 bg-white border border-slate-200 rounded-2xl text-slate-500">
          <p className="font-medium text-lg text-blue mb-1">No listings found</p>
          <p className="text-sm">We couldn't find any active spaces for this category.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedListings;
