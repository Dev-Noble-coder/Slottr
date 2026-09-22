import { useState } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { 
    useProviderBookings, 
    useRespondToBooking, 
    useCompleteBooking, 
    useCancelProviderBooking 
} from '../../hooks/useProvider';
import { 
    Loader2, 
    Calendar, 
    Check, 
    X, 
    CheckCircle2, 
    Clock, 
    Mail, 
    Phone, 
    Globe,
    Search,
    Ban,
    AlertTriangle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { formatReadableDate, formatBookingTimeRange, formatCurrency } from '../../lib/formatters';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;
type StatusTab = typeof STATUS_TABS[number];

const ITEMS_PER_PAGE = 9;

const ProviderBookings = () => {
    const [selectedStatus, setSelectedStatus] = useState<StatusTab>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const statusParam = selectedStatus === 'ALL' ? undefined : selectedStatus;

    const { data: bookingsData, isLoading } = useProviderBookings(statusParam);
    const { mutateAsync: respondToBooking } = useRespondToBooking();
    const { mutateAsync: completeBooking } = useCompleteBooking();
    const { mutateAsync: cancelBooking, isPending: isCancelling } = useCancelProviderBooking();

    const [respondingAction, setRespondingAction] = useState<string | null>(null);
    const [cancellingBookingId, setCancellingBookingId] = useState<string | number | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    const rawBookings = Array.isArray(bookingsData?.data) ? bookingsData.data : (Array.isArray(bookingsData) ? bookingsData : []);
    
    // Client-side search and status filter
    const filteredBookings = rawBookings.filter((b: any) => {
        const matchesStatus = selectedStatus === 'ALL' || String(b.status || '').toUpperCase().trim() === selectedStatus;
        if (!matchesStatus) return false;
        
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();
        const customerName = `${b.attendeeFirstName || ''} ${b.attendeeLastName || ''}`.toLowerCase();
        const customerEmail = (b.attendeeEmail || '').toLowerCase();
        const listingTitle = (b.listing?.title || '').toLowerCase();
        return customerName.includes(query) || customerEmail.includes(query) || listingTitle.includes(query);
    });

    const backendPagination = bookingsData?.pagination;
    const isServerPaginated = Boolean(backendPagination && backendPagination.totalPages !== undefined);

    const totalPages = isServerPaginated 
        ? Math.max(Number(backendPagination?.totalPages) || 1, 1)
        : Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1;

    const bookings = isServerPaginated 
        ? filteredBookings 
        : filteredBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleAccept = async (id: string | number) => {
        const actionKey = `${id}-accept`;
        try {
            setRespondingAction(actionKey);
            await respondToBooking({ id, action: 'accept' });
            toast.success("Booking accepted successfully.");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to accept booking.");
        } finally {
            setRespondingAction(null);
        }
    };


    const handleComplete = async (id: string | number) => {
        const actionKey = `${id}-complete`;
        try {
            setRespondingAction(actionKey);
            await completeBooking({ id });
            toast.success("Booking marked as completed! Payout record created (status: ELIGIBLE).");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to complete booking.");
        } finally {
            setRespondingAction(null);
        }
    };

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
        <ProviderLayout>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Bookings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage requests, confirm schedules, and finalize completed services.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search customer or listing..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-slate-200 rounded-full pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue w-full sm:w-64 transition-colors"
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

            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : bookings.length > 0 ? (
                <div className="flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking: any) => {
                        const dateFormatted = formatReadableDate(booking.bookingDate || booking.date || booking.createdAt);
                        
                        const timeFormatted = formatBookingTimeRange(
                            booking.startAt || booking.bookingDate || booking.startTime,
                            booking.endAt || booking.endTime,
                            booking.durationHours
                        );

                        const bookingPrice = booking.amount ?? booking.totalPrice ?? booking.price;
                        const normalizedStatus = String(booking.status || '').toUpperCase().trim();
                        const isPending = normalizedStatus === 'PENDING';
                        const isConfirmed = normalizedStatus === 'CONFIRMED';
                        const isCompleted = normalizedStatus === 'COMPLETED';
                        const isCancelled = normalizedStatus === 'CANCELLED' || normalizedStatus === 'REJECTED';

                        return (
                            <div key={booking.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between transition-all duration-200 hover:border-slate-300">
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-4">
                                        <h3 className="font-bold text-base text-slate-900 truncate" title={booking.listing?.title}>
                                            {booking.listing?.title || 'Listing Booking'}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 border inline-flex items-center gap-1.5 ${
                                            isPending ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                            isConfirmed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                            isCompleted ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                            isCancelled ? 'bg-rose-50 text-rose-800 border-rose-200' :
                                            'bg-slate-100 text-slate-700 border-slate-200'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                isPending ? 'bg-amber-500 animate-pulse' :
                                                isConfirmed ? 'bg-emerald-500' :
                                                isCompleted ? 'bg-blue-500' :
                                                'bg-rose-500'
                                            }`} />
                                            {normalizedStatus || 'PENDING'}
                                        </span>
                                    </div>
                                    
                                    {/* Booking Metadata Card */}
                                    <div className="space-y-2.5 mb-4 bg-slate-50/90 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-blue" /> Date
                                            </span>
                                            <span className="font-semibold text-slate-900">{dateFormatted}</span>
                                        </div>
                                        {timeFormatted && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-blue" /> Time
                                                </span>
                                                <span className="font-semibold text-slate-900">{timeFormatted}</span>
                                            </div>
                                        )}
                                        {booking.durationHours && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Duration</span>
                                                <span className="font-semibold text-slate-900">{booking.durationHours} {booking.durationHours === 1 ? 'hour' : 'hours'}</span>
                                            </div>
                                        )}
                                        {bookingPrice !== undefined && bookingPrice !== null && (
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                                                <span className="text-slate-500 font-medium">Total Price</span>
                                                <span className="font-black text-slate-900 text-base">{formatCurrency(bookingPrice)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Attendee Details */}
                                    <div className="space-y-2 mb-5 text-xs text-slate-600 bg-white p-1">
                                        <div className="font-bold text-slate-900 flex items-center justify-between">
                                            <span className="text-slate-400 font-normal">Customer</span>
                                            <span>{booking.attendeeFirstName} {booking.attendeeLastName}</span>
                                        </div>
                                        {booking.attendeeEmail && (
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> Email</span>
                                                <span className="truncate max-w-[180px] font-medium text-slate-700">{booking.attendeeEmail}</span>
                                            </div>
                                        )}
                                        {booking.attendeePhone && (
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> Phone</span>
                                                <span className="font-medium text-slate-700">{booking.attendeePhone}</span>
                                            </div>
                                        )}
                                        {booking.attendeeCountry && (
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-400" /> Country</span>
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700 uppercase">{booking.attendeeCountry}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cancellation reason if present */}
                                    {booking.cancelReason && (
                                        <div className="mb-4 p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-xs text-rose-800">
                                            <span className="font-bold block mb-0.5 text-rose-900">Cancellation Reason:</span>
                                            <p className="italic">"{booking.cancelReason}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-3 border-t border-slate-100">
                                    {isPending && (
                                         <div className="flex gap-2">
                                             <button 
                                                 onClick={() => handleAccept(booking.id)}
                                                 disabled={!!respondingAction}
                                                 className="flex-1 bg-accent text-white px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                                             >
                                                 {respondingAction === `${booking.id}-accept` ? (
                                                     <>
                                                         <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                         <span>Accepting...</span>
                                                     </>
                                                 ) : (
                                                     <>
                                                         <Check className="w-4 h-4" />
                                                         <span>Accept</span>
                                                     </>
                                                 )}
                                             </button>
                                             <button 
                                                 onClick={() => setCancellingBookingId(booking.id)}
                                                 className="flex-1 bg-white text-rose-600 border border-rose-200 px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-rose-50 transition-all cursor-pointer shadow-2xs"
                                             >
                                                 <Ban className="w-3.5 h-3.5" />
                                                 <span>Cancel</span>
                                             </button>
                                         </div>
                                    )}
                                    {isConfirmed && (
                                         <div className="flex flex-col gap-2">
                                             <button 
                                                 onClick={() => handleComplete(booking.id)}
                                                 disabled={!!respondingAction}
                                                 className="w-full bg-emerald-600 text-white px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                                             >
                                                 {respondingAction === `${booking.id}-complete` ? (
                                                     <>
                                                         <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                         <span>Completing...</span>
                                                     </>
                                                 ) : (
                                                     <>
                                                         <CheckCircle2 className="w-4 h-4" />
                                                         <span>Mark as Completed</span>
                                                     </>
                                                 )}
                                             </button>
                                             <button
                                                 onClick={() => setCancellingBookingId(booking.id)}
                                                 className="w-full text-slate-500 hover:text-rose-600 text-xs font-semibold py-1.5 rounded-full hover:bg-rose-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                             >
                                                 <Ban className="w-3.5 h-3.5" /> Cancel Booking
                                             </button>
                                         </div>
                                    )}
                                    {isCompleted && (
                                         <div className="w-full py-2.5 text-center text-xs text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200 font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                                             <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed • Payout Eligible
                                         </div>
                                    )}
                                    {isCancelled && (
                                         <div className="w-full py-2 text-center text-xs text-slate-500 bg-slate-100 rounded-full border border-slate-200 font-semibold flex items-center justify-center gap-1.5">
                                             <Ban className="w-3.5 h-3.5 text-slate-400" /> Cancelled
                                         </div>
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
                <div className="bg-white rounded-md border border-slate-200 p-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No bookings found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {searchQuery 
                            ? `No bookings matching "${searchQuery}".` 
                            : (selectedStatus === 'ALL' 
                                ? "You don't have any booking requests right now." 
                                : `You don't have any bookings with status "${selectedStatus}".`)}
                    </p>
                </div>
            )}

            {/* Cancel Booking Modal (POST /api/booking/:id/cancel) */}
            {cancellingBookingId && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-300 rounded-md w-full max-w-md shadow-xl p-6">
                        <div className="flex items-center gap-3 text-red-600 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Cancel Reservation</h3>
                                <p className="text-xs text-slate-500">Are you sure you want to cancel this booking?</p>
                            </div>
                        </div>

                        <form onSubmit={handleConfirmCancel} className="space-y-4 mt-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-700">Cancellation Reason (Optional)</label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Provide a reason for the customer..."
                                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs outline-none focus:border-red-500 min-h-[80px]"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCancellingBookingId(null);
                                        setCancelReason('');
                                    }}
                                    className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Keep Booking
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCancelling}
                                    className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
        </ProviderLayout>
    );
};

export default ProviderBookings;


