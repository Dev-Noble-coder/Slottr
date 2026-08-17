import ListingCard from '../../../components/ui/ListingCard';

const featuredData = [
  {
    id: 1,
    title: 'The Cyber Suite Loft',
    location: 'Downtown Metropolis',
    price: 150,
    unit: 'day',
    type: 'Room',
    category: 'Rooms & Apartments',
    imageSrc: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=500' // Working bright apartment
  },
  {
    id: 2,
    title: 'Whispering Pines Retreat',
    location: 'Northwood Valley',
    price: 280,
    unit: 'day',
    type: 'Cabin',
    category: 'Rooms & Apartments',
    imageSrc: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800&h=500' // Cabin
  },
  {
    id: 3,
    title: 'Nexus Open Desk',
    location: 'Tech District',
    price: 35,
    unit: 'day',
    type: 'Coworking',
    category: 'Coworking',
    imageSrc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&h=500' // Coworking office
  },
  {
    id: 4,
    title: 'Lumina Studio Space',
    location: 'Arts Quarter',
    price: 75,
    unit: 'hour',
    type: 'Studio',
    category: 'Rooms & Apartments',
    imageSrc: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800&h=500' // Photo studio
  },
  {
    id: 5,
    title: 'Urban Conference Room',
    location: 'Business Center',
    price: 50,
    unit: 'hour',
    type: 'Room',
    category: 'Meeting Rooms',
    imageSrc: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800&h=500'
  },
  {
    id: 6,
    title: 'Luxury SUV Rental',
    location: 'Airport Pickup',
    price: 120,
    unit: 'day',
    type: 'Vehicle',
    category: 'Cars & Vehicles',
    imageSrc: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800&h=500'
  },
  {
    id: 7,
    title: 'Professional Camera Gear',
    location: 'Downtown Pickup',
    price: 85,
    unit: 'day',
    type: 'Equipment',
    category: 'Equipment',
    imageSrc: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800&h=500'
  }
];

interface FeaturedListingsProps {
  activeCategory: string;
}

const FeaturedListings = ({ activeCategory }: FeaturedListingsProps) => {
  const filteredListings = featuredData.filter(listing => listing.category === activeCategory);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 mt-16 mb-24 min-h-[400px]">
      <h2 className="text-2xl font-bold text-blue mb-8">
        Featured in {activeCategory}
      </h2>
      
      {filteredListings.length > 0 ? (
        <div className="flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                title={listing.title}
                location={listing.location}
                price={listing.price}
                unit={listing.unit}
                type={listing.type}
                imageSrc={listing.imageSrc}
              />
            ))}
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
