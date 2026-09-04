import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderHome, useProviderBookings } from '../../hooks/useProvider';
import { useMyListings } from '../../hooks/useListing';
import { Loader2, Calendar, List, Clock, MapPin, Phone, Mail, Navigation, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { data: homeData, isLoading: isProfileLoading } = useProviderHome();
    const { data: bookingsData, isLoading: isBookingsLoading } = useProviderBookings();
    const { data: listingsData, isLoading: isListingsLoading } = useMyListings();

    const isLoading = isProfileLoading || isBookingsLoading || isListingsLoading;
    const provider = homeData?.provider;

    const bookings = Array.isArray(bookingsData?.data) ? bookingsData.data : (Array.isArray(bookingsData) ? bookingsData : []);
    const listings = Array.isArray(listingsData?.data) ? listingsData.data : (Array.isArray(listingsData) ? listingsData : []);

    const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING');
    const confirmedBookings = bookings.filter((b: any) => b.status === 'CONFIRMED');

    const displayName = provider?.fullName || provider?.username || 'Provider';

    return (
        <ProviderLayout>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Welcome back, {displayName}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Overview of your performance, listings, and bookings.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/provider/listings"
                        className="bg-blue hover:bg-button-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                        <List className="w-4 h-4" />
                        Manage Listings
                    </Link>
                    <Link
                        to="/provider/bookings"
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                        <Calendar className="w-4 h-4" />
                        View Bookings
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Provider Quick Profile Card (sharp borders, no shadow) */}
                    {provider && (
                        <div className="bg-white rounded-md border border-slate-200 p-5">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                <div className="flex items-center gap-4">
                                    {provider.avatarUrl ? (
                                        <img 
                                            src={provider.avatarUrl} 
                                            alt={displayName} 
                                            className="w-14 h-14 rounded-md object-cover border border-slate-300"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-md bg-blue/10 border border-blue/20 text-blue font-bold text-xl flex items-center justify-center">
                                            {displayName.slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
                                            <span className="text-xs px-2 py-0.5 rounded-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                @{provider.username}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded-sm font-medium bg-blue/10 text-blue border border-blue/20">
                                                {provider.role || 'PROVIDER'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                {provider.email}
                                            </span>
                                            {provider.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    {provider.phone}
                                                </span>
                                            )}
                                            {(provider.city || provider.state) && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                    {[provider.city, provider.state].filter(Boolean).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    {provider.categories && provider.categories.length > 0 ? (
                                        provider.categories.map((cat: string) => (
                                            <span key={cat} className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-sm text-xs font-semibold uppercase tracking-wider">
                                                {cat}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400">No categories assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid (sharp borders, no shadow) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-md border border-slate-200 flex items-center gap-3.5">
                            <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue rounded-md flex items-center justify-center shrink-0">
                                <List className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Listings</p>
                                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{listings.length}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-md border border-slate-200 flex items-center gap-3.5">
                            <div className="w-10 h-10 bg-amber-50 border border-amber-100 text-amber-600 rounded-md flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Bookings</p>
                                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{pendingBookings.length}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-md border border-slate-200 flex items-center gap-3.5">
                            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-md flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Confirmed Bookings</p>
                                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{confirmedBookings.length}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-md border border-slate-200 flex items-center gap-3.5">
                            <div className="w-10 h-10 bg-purple-50 border border-purple-100 text-purple-600 rounded-md flex items-center justify-center shrink-0">
                                <Navigation className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Service Radius</p>
                                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{provider?.serviceRadius ?? 0} km</h3>
                            </div>
                        </div>
                    </div>

                    {/* Content Columns (sharp borders, no shadow) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bookings Overview */}
                        <div className="bg-white rounded-md border border-slate-200 p-5">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-accent" />
                                    Recent Bookings
                                </h3>
                                <Link to="/provider/bookings" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                                    View All <ArrowUpRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {bookings.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {bookings.slice(0, 5).map((booking: any) => (
                                        <div key={booking.id} className="py-3 flex items-center justify-between">
                                            <div className="min-w-0 pr-4">
                                                <p className="font-medium text-sm text-slate-800 truncate">
                                                    {booking.listing?.title || 'Listing Request'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Customer: {booking.attendeeFirstName || 'User'} {booking.attendeeLastName || ''}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold shrink-0 border ${
                                                booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                booking.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <p className="text-xs">No bookings yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Listings Overview */}
                        <div className="bg-white rounded-md border border-slate-200 p-5">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <List className="w-4 h-4 text-accent" />
                                    My Listings
                                </h3>
                                <Link to="/provider/listings" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                                    View All <ArrowUpRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {listings.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {listings.slice(0, 5).map((listing: any) => (
                                        <div key={listing.id} className="py-3 flex items-center justify-between">
                                            <div className="min-w-0 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-sm text-slate-800 truncate">
                                                        {listing.title}
                                                    </p>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                                                        {listing.status || 'draft'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {listing.state + ' , '+ listing.country || 'Location not set'} • Type: {listing.type || 'N/A'}
                                                </p>
                                            </div>
                                            <span className="font-bold text-sm text-slate-900 shrink-0">
                                                ${listing.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <p className="text-xs">No listings created yet.</p>
                                    <Link to="/provider/listings" className="text-xs font-semibold text-accent hover:underline mt-2 inline-block">
                                        + Create your first listing
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ProviderLayout>
    );
};

export default Dashboard;
