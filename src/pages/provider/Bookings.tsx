import { useState } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderBookings, useRespondToBooking, useCompleteBooking } from '../../hooks/useProvider';
import { 
    Loader2, 
    Calendar, 
    Check, 
    X, 
    CheckCircle2, 
    Clock, 
    Mail, 
    Phone, 
    Globe 
} from 'lucide-react';
import { toast } from 'sonner';
import { formatReadableDate, formatBookingTimeRange, formatCurrency } from '../../lib/formatters';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'DECLINED'] as const;
type StatusTab = typeof STATUS_TABS[number];

const ProviderBookings = () => {
    const [selectedStatus, setSelectedStatus] = useState<StatusTab>('ALL');
    const statusParam = selectedStatus === 'ALL' ? undefined : selectedStatus;

    const { data: bookingsData, isLoading } = useProviderBookings(statusParam);
    const { mutateAsync: respondToBooking } = useRespondToBooking();
    const { mutateAsync: completeBooking } = useCompleteBooking();

    const [isResponding, setIsResponding] = useState<string | number | null>(null);

    const bookings = Array.isArray(bookingsData?.data) ? bookingsData.data : (Array.isArray(bookingsData) ? bookingsData : []);

    const handleResponse = async (id: string | number, action: 'accept' | 'decline') => {
        try {
            setIsResponding(id);
            await respondToBooking({ id, action });
            toast.success(`Booking ${action}ed successfully.`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || `Failed to ${action} booking.`);
        } finally {
            setIsResponding(null);
        }
    };

    const handleComplete = async (id: string | number) => {
        try {
            setIsResponding(id);
            await completeBooking({ id });
            toast.success("Booking marked as completed! Payout record created (status: ELIGIBLE).");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to complete booking.");
        } finally {
            setIsResponding(null);
        }
    };

    return (
        <ProviderLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Bookings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage requests, confirm schedules, and finalize completed services.</p>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-200 overflow-x-auto">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedStatus(tab)}
                            className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors shrink-0 ${
                                selectedStatus === tab
                                    ? 'bg-blue text-white'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            {tab === 'ALL' ? 'All Bookings' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {bookings.map((booking: any) => {
                        const dateFormatted = formatReadableDate(booking.bookingDate || booking.date || booking.createdAt);
                        
                        const timeFormatted = formatBookingTimeRange(
                            booking.startAt || booking.bookingDate || booking.startTime,
                            booking.endAt || booking.endTime,
                            booking.durationHours
                        );

                        const bookingPrice = booking.amount ?? booking.totalPrice ?? booking.price;

                        return (
                            <div key={booking.id} className="bg-white p-5 rounded-md border border-slate-200 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-3">
                                        <h3 className="font-bold text-base text-slate-900 truncate" title={booking.listing?.title}>
                                            {booking.listing?.title || 'Listing Booking'}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider shrink-0 border ${
                                            booking.status === 'PENDING' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                            booking.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                            booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                            booking.status === 'DECLINED' ? 'bg-red-50 text-red-800 border-red-300' :
                                            'bg-slate-100 text-slate-700 border-slate-300'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    
                                    {/* Booking Metadata */}
                                    <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-md border border-slate-100 text-xs text-slate-600">
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
                                        {bookingPrice !== undefined && bookingPrice !== null && (
                                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                                                <span className="text-slate-500 font-medium">Total Price</span>
                                                <span className="font-bold text-slate-900 text-sm">{formatCurrency(bookingPrice)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Attendee Details */}
                                    <div className="space-y-1.5 mb-5 text-xs text-slate-600">
                                        <div className="font-semibold text-slate-800 flex items-center justify-between">
                                            <span>Customer</span>
                                            <span>{booking.attendeeFirstName} {booking.attendeeLastName}</span>
                                        </div>
                                        {booking.attendeeEmail && (
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> Email</span>
                                                <span className="truncate max-w-[180px]">{booking.attendeeEmail}</span>
                                            </div>
                                        )}
                                        {booking.attendeePhone && (
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> Phone</span>
                                                <span>{booking.attendeePhone}</span>
                                            </div>
                                        )}
                                        {booking.attendeeCountry && (
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-400" /> Country</span>
                                                <span className="font-mono uppercase">{booking.attendeeCountry}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    {booking.status === 'PENDING' && (
                                        <>
                                            <button 
                                                onClick={() => handleResponse(booking.id, 'accept')}
                                                disabled={!!isResponding}
                                                className="flex-1 bg-accent text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Accept
                                            </button>
                                            <button 
                                                onClick={() => handleResponse(booking.id, 'decline')}
                                                disabled={!!isResponding}
                                                className="flex-1 bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 hover:bg-red-50 disabled:opacity-50 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" /> Decline
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'CONFIRMED' && (
                                        <button 
                                            onClick={() => handleComplete(booking.id)}
                                            disabled={!!isResponding}
                                            className="w-full bg-emerald-600 text-white px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Completed
                                        </button>
                                    )}
                                    {booking.status === 'COMPLETED' && (
                                        <div className="w-full py-1 text-center text-xs text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200 font-medium flex items-center justify-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed • Payout Eligible
                                        </div>
                                    )}
                                    {booking.status === 'DECLINED' && (
                                        <div className="w-full py-1 text-center text-xs text-slate-500 bg-slate-100 rounded-md border border-slate-200 font-medium">
                                            Declined
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-md border border-slate-200 p-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No bookings found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {selectedStatus === 'ALL' 
                            ? "You don't have any booking requests right now." 
                            : `You don't have any bookings with status "${selectedStatus}".`}
                    </p>
                </div>
            )}
        </ProviderLayout>
    );
};

export default ProviderBookings;

