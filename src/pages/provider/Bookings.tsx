import { useState } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderBookings, useRespondToBooking, useCompleteBooking } from '../../hooks/useProvider';
import { Loader2, Calendar, Check, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const ProviderBookings = () => {
    const { data: bookingsData, isLoading } = useProviderBookings();
    const { mutateAsync: respondToBooking } = useRespondToBooking();
    const { mutateAsync: completeBooking } = useCompleteBooking();

    const [isResponding, setIsResponding] = useState<string | null>(null);

    const bookings = Array.isArray(bookingsData?.data) ? bookingsData.data : (Array.isArray(bookingsData) ? bookingsData : []);

    const handleResponse = async (id: string, action: 'accept' | 'decline') => {
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

    const handleComplete = async (id: string) => {
        try {
            setIsResponding(id);
            await completeBooking({ id });
            toast.success("Booking completed successfully. Payout initiated.");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to complete booking.");
        } finally {
            setIsResponding(null);
        }
    };

    return (
        <ProviderLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Bookings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage requests, confirm schedules, and finalize completed services.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {bookings.map((booking: any) => (
                        <div key={booking.id} className="bg-white p-5 rounded-md border border-slate-200 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start gap-2 mb-3">
                                    <h3 className="font-bold text-base text-slate-900 truncate">{booking.listing?.title || 'Listing'}</h3>
                                    <span className={`px-2 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider shrink-0 border ${
                                        booking.status === 'PENDING' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                        booking.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                        booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                        'bg-slate-100 text-slate-700 border-slate-300'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-5">
                                    <div className="text-xs text-slate-600 flex items-center justify-between">
                                        <span className="text-slate-400">Customer</span>
                                        <span className="font-medium text-slate-800">{booking.attendeeFirstName} {booking.attendeeLastName}</span>
                                    </div>
                                    <div className="text-xs text-slate-600 flex items-center justify-between">
                                        <span className="text-slate-400">Date</span>
                                        <span className="font-medium text-slate-800">{booking.date || booking.createdAt}</span>
                                    </div>
                                    {booking.startAt && (
                                        <div className="text-xs text-slate-600 flex items-center justify-between">
                                            <span className="text-slate-400">Time Slot</span>
                                            <span className="font-medium text-slate-800">{booking.startAt} - {booking.endAt}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                                {booking.status === 'PENDING' && (
                                    <>
                                        <button 
                                            onClick={() => handleResponse(booking.id, 'accept')}
                                            disabled={!!isResponding}
                                            className="flex-1 bg-accent text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Accept
                                        </button>
                                        <button 
                                            onClick={() => handleResponse(booking.id, 'decline')}
                                            disabled={!!isResponding}
                                            className="flex-1 bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-50 disabled:opacity-50 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" /> Decline
                                        </button>
                                    </>
                                )}
                                {booking.status === 'CONFIRMED' && (
                                    <button 
                                        onClick={() => handleComplete(booking.id)}
                                        disabled={!!isResponding}
                                        className="w-full bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-md border border-slate-200 p-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No bookings yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">You don't have any booking requests right now.</p>
                </div>
            )}
        </ProviderLayout>
    );
};

export default ProviderBookings;
