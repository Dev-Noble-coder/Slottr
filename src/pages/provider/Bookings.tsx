import { useState } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderBookings, useRespondToBooking, useCompleteBooking } from '../../hooks/useProvider.ts';
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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-blue">My Bookings</h1>
                    <p className="text-slate-500 mt-1">Manage requests and active bookings</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking: any) => (
                        <div key={booking.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg text-blue">{booking.listing?.title || 'Listing'}</h3>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                    booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                            
                            <div className="space-y-3 mb-6 flex-1">
                                <div className="text-sm text-slate-600 flex items-center gap-2">
                                    <span className="font-medium">Customer:</span> {booking.attendeeFirstName} {booking.attendeeLastName}
                                </div>
                                <div className="text-sm text-slate-600 flex items-center gap-2">
                                    <span className="font-medium">Date:</span> {booking.date || booking.createdAt}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                {booking.status === 'PENDING' && (
                                    <>
                                        <button 
                                            onClick={() => handleResponse(booking.id, 'accept')}
                                            disabled={!!isResponding}
                                            className="flex-1 bg-accent text-white px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1 hover:bg-opacity-90 disabled:opacity-50"
                                        >
                                            <Check className="w-4 h-4" /> Accept
                                        </button>
                                        <button 
                                            onClick={() => handleResponse(booking.id, 'decline')}
                                            disabled={!!isResponding}
                                            className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1 hover:bg-red-100 disabled:opacity-50"
                                        >
                                            <X className="w-4 h-4" /> Decline
                                        </button>
                                    </>
                                )}
                                {booking.status === 'CONFIRMED' && (
                                    <button 
                                        onClick={() => handleComplete(booking.id)}
                                        disabled={!!isResponding}
                                        className="w-full bg-green-500 text-white px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-600 disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-blue mb-2">No bookings yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">You don't have any booking requests right now.</p>
                </div>
            )}
        </ProviderLayout>
    );
};

export default ProviderBookings;
