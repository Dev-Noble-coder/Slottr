import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import { useCustomerBookings } from '../../hooks/useCustomer';
import { useCancelBooking } from '../../hooks/useBooking';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Search, 
    X, 
    Ban, 
    AlertTriangle, 
    Loader2, 
    CheckCircle2, 
    ExternalLink,
    ShoppingBag,
    Compass,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { formatReadableDate, formatBookingTimeRange, formatCurrency } from '../../lib/formatters';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;
type StatusTab = typeof STATUS_TABS[number];

const ITEMS_PER_PAGE = 9;

const CustomerBookings = () => {
    const [selectedStatus, setSelectedStatus] = useState<StatusTab>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [cancellingBookingId, setCancellingBookingId] = useState<string | number | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    const statusParam = selectedStatus === 'ALL' ? undefined : selectedStatus;
    const { data: bookingsData, isLoading } = useCustomerBookings(statusParam);
    const { mutateAsync: cancelBooking, isPending: isCancelling } = useCancelBooking();

    const rawBookings = Array.isArray(bookingsData?.data) ? bookingsData.data : (Array.isArray(bookingsData) ? bookingsData : []);

    const filteredBookings = rawBookings.filter((b: any) => {
        const normalizedStatus = String(b.status || '').toUpperCase().trim();
        const matchesStatus = selectedStatus === 'ALL' || normalizedStatus === selectedStatus;
        if (!matchesStatus) return false;

        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();
        const listingTitle = (b.listing?.title || b.Listing?.title || '').toLowerCase();
        const location = (b.listing?.city || b.listing?.state || b.Listing?.location || '').toLowerCase();
        return listingTitle.includes(query) || location.includes(query);
    });

    const backendPagination = bookingsData?.pagination;
    const isServerPaginated = Boolean(backendPagination && backendPagination.totalPages !== undefined);

    const totalPages = isServerPaginated 
        ? Math.max(Number(backendPagination?.totalPages) || 1, 1)
        : Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1;

    const bookings = isServerPaginated 
        ? filteredBookings 
        : filteredBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleConfirmCancel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cancellingBookingId) return;

        try {
            await cancelBooking({ id: cancellingBookingId, reason: cancelReason.trim() || undefined });
            toast.success("Booking cancelled successfully.");
            setCancellingBookingId(null);
            setCancelReason('');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to cancel booking.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-grow max-w-[1440px] w-full mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                            <ShoppingBag className="w-3.5 h-3.5" /> My Reservations
                        </div>
                        <h1 className="text-3xl font-extrabold text-blue tracking-tight">My Bookings</h1>
                        <p className="text-sm text-slate-500 mt-1">Track your upcoming reservations, confirmed slots, and booking history.</p>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by listing or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border border-slate-200 rounded-full pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent w-full sm:w-64 transition-colors shadow-2xs"
                            />
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-slate-200 overflow-x-auto shadow-2xs">
                            {STATUS_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedStatus(tab)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                                        selectedStatus === tab
                                            ? 'bg-blue text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {tab === 'ALL' ? 'All' : tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-28">
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="flex flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.map((booking: any) => {
                            const listing = booking.listing || booking.Listing || {};
                            const normalizedStatus = String(booking.status || '').toUpperCase().trim();
                            const dateFormatted = formatReadableDate(booking.bookingDate || booking.date || booking.createdAt);
                            const timeFormatted = formatBookingTimeRange(
                                booking.startAt || booking.bookingDate || booking.startTime,
                                booking.endAt || booking.endTime,
                                booking.durationHours
                            );
                            const price = booking.amount ?? booking.totalPrice ?? booking.price ?? listing.price;

                            return (
                                <div key={booking.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200">
                                    <div>
                                        {/* Image / Header Thumbnail */}
                                        <div className="h-40 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                                            {listing.images && listing.images.length > 0 ? (
                                                <img 
                                                    src={listing.images[0]} 
                                                    alt={listing.title || 'Listing'} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue/5 to-accent/10 text-slate-400">
                                                    <Calendar className="w-10 h-10 opacity-30" />
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs border ${
                                                    normalizedStatus === 'PENDING' ? 'bg-amber-100/90 text-amber-800 border-amber-300' :
                                                    normalizedStatus === 'CONFIRMED' ? 'bg-blue-600 text-white border-blue-700' :
                                                    normalizedStatus === 'COMPLETED' ? 'bg-emerald-600 text-white border-emerald-700' :
                                                    'bg-slate-200/90 text-slate-700 border-slate-300'
                                                }`}>
                                                    {normalizedStatus || 'PENDING'}
                                                </span>
                                            </div>

                                            {/* Type Badge */}
                                            {listing.type && (
                                                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                    {listing.type}
                                                </div>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div className="p-5">
                                            <h3 className="font-bold text-base text-slate-900 truncate mb-1">
                                                {listing.title || 'Reserved Service'}
                                            </h3>

                                            {(listing.streetAddress || listing.city || listing.state) && (
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3 truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    {[listing.streetAddress, listing.city, listing.state].filter(Boolean).join(', ')}
                                                </p>
                                            )}

                                            {/* Slot info */}
                                            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs text-slate-600 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400 flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" /> Date
                                                    </span>
                                                    <span className="font-semibold text-slate-800">{dateFormatted}</span>
                                                </div>
                                                {timeFormatted && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400 flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" /> Time
                                                        </span>
                                                        <span className="font-semibold text-slate-800">{timeFormatted}</span>
                                                    </div>
                                                )}
                                                {booking.durationHours && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400">Duration</span>
                                                        <span className="font-semibold text-slate-800">{booking.durationHours} {booking.durationHours === 1 ? 'hour' : 'hours'}</span>
                                                    </div>
                                                )}
                                                {price !== undefined && price !== null && (
                                                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                                                        <span className="text-slate-500 font-medium">Total Paid</span>
                                                        <span className="font-bold text-slate-900 text-sm">{formatCurrency(price)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Cancellation reason if present */}
                                            {booking.cancelReason && (
                                                <div className="mb-3 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600">
                                                    <span className="font-semibold text-slate-700 block mb-0.5">Cancellation Reason:</span>
                                                    <p className="italic">"{booking.cancelReason}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                                        {listing.id ? (
                                            <Link
                                                to={`/listing/${listing.id}`}
                                                className="text-xs font-semibold text-accent hover:text-accent/80 inline-flex items-center gap-1 py-1.5 px-3 rounded-full hover:bg-accent/10 transition-colors"
                                            >
                                                <span>View Listing</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                        ) : <div />}

                                        {(normalizedStatus === 'PENDING' || normalizedStatus === 'CONFIRMED') && (
                                            <button
                                                onClick={() => setCancellingBookingId(booking.id)}
                                                className="text-xs font-semibold text-red-600 hover:text-red-700 bg-white hover:bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                                            >
                                                <Ban className="w-3.5 h-3.5" />
                                                <span>Cancel Booking</span>
                                            </button>
                                        )}

                                        {normalizedStatus === 'COMPLETED' && (
                                            <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-slate-200 bg-white rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-medium text-xs transition-all inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>Previous</span>
                            </button>

                            <span className="text-xs font-semibold text-slate-600 px-3 py-1 bg-white border border-slate-200 rounded-full">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-slate-200 bg-white rounded-full text-blue hover:bg-slate-100 disabled:opacity-40 font-medium text-xs transition-all inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                            >
                                <span>Next</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-xs">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings found</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            {searchQuery 
                                ? `No bookings matching "${searchQuery}".` 
                                : (selectedStatus === 'ALL' 
                                    ? "You don't have any bookings yet. Discover spaces and services to make your first reservation!" 
                                    : `You have no bookings with status "${selectedStatus}".`)}
                        </p>
                        <Link
                            to="/"
                            className="bg-button-dark hover:bg-button-dark-hover text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                            <Compass className="w-4 h-4" />
                            Explore Listings
                        </Link>
                    </div>
                )}

                {/* Cancel Booking Modal */}
                {cancellingBookingId && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md shadow-xl p-6">
                            <div className="flex items-center gap-3 text-red-600 mb-3">
                                <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Cancel Booking</h3>
                                    <p className="text-xs text-slate-500">Are you sure you want to cancel this reservation?</p>
                                </div>
                            </div>

                            <form onSubmit={handleConfirmCancel} className="space-y-4 mt-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Cancellation Reason (Optional)</label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="Reason for cancellation..."
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-red-500 min-h-[80px]"
                                    />
                                </div>

                                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCancellingBookingId(null);
                                            setCancelReason('');
                                        }}
                                        className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                                    >
                                        Keep Booking
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCancelling}
                                        className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                                    >
                                        {isCancelling ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                Cancelling...
                                            </>
                                        ) : 'Confirm Cancellation'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default CustomerBookings;
