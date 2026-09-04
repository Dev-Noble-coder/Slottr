import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, ChevronLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import Modal from '../../components/ui/Modal';
import BookingAuthModal from './components/BookingAuthModal';
import { useCustomerDashboard } from '../../hooks/useCustomer';
import { useCreateBooking } from '../../hooks/useBooking';
import { useListings, usePublicAvailability } from '../../hooks/useListing';
import { toast } from 'sonner';

const ListingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);

  const { data: customerData, isSuccess } = useCustomerDashboard();
  const { mutateAsync: createBooking, isPending } = useCreateBooking();
  const { data: listingsData, isLoading, isError } = useListings();

  // Handle nested API response structures
  const listingsArray = Array.isArray(listingsData?.data) ? listingsData.data : (Array.isArray(listingsData) ? listingsData : []);
  
  // Match listing by id
  const listing = listingsArray.find((item: any) => String(item.id) === String(id));

  // Public Availability Engine slot query
  const { data: availabilityData, isLoading: isCheckingAvailability } = usePublicAvailability(
    listing?.id, 
    bookingDate, 
    !!bookingDate
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue mb-4">Listing not found</h1>
            <Link to="/" className="text-blue hover:underline">Return to Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBookClick = async () => {
    if (!bookingDate) {
      toast.error("Please select a date for your booking.");
      return;
    }

    if (availabilityData && availabilityData.slots && availabilityData.slots.length > 0 && !selectedSlot) {
      toast.error("Please select an available time slot.");
      return;
    }

    const isAuthenticated = isSuccess && !!customerData; 
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      try {
        await createBooking({ 
          listingId: listing.id, 
          date: bookingDate,
          ...(selectedSlot ? { startAt: selectedSlot.start, endAt: selectedSlot.end } : {})
        });
        setShowSuccessModal(true);
      } catch (error) {
        toast.error("Booking failed. Please try again.");
      }
    }
  };

  const getListingNoun = (category: string) => {
    if (category === 'Equipment') return 'equipment';
    if (category === 'Cars & Vehicles') return 'vehicle';
    return 'space';
  };

  const itemNoun = getListingNoun(listing.category || listing.type);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-grow pb-24">
        {/* Back navigation */}
        <div className="w-full max-w-[1440px] mx-auto px-4 py-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-blue transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to listings
          </button>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Image Gallery */}
              <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                <img 
                  src={(listing.images && listing.images.length > 0) ? listing.images[0] : "https://placehold.co/1200x800/eeeeee/1E293B?text=No+Image"} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Listing Info */}
              <div className="bg-white rounded-xl p-8 border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-blue mb-3">{listing.title}</h1>
                    <div className="flex items-center text-slate-500">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">
                        {[listing.streetAddress, listing.state, listing.country].filter(Boolean).join(', ') || listing.location || 'Location upon request'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-bold text-blue mb-4">About this {itemNoun}</h2>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {listing.description || `Experience the perfect blend of comfort and style with this premium ${itemNoun}. Whether you need it for a short duration or an extended period, it provides everything you need for a seamless experience.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-8 border border-slate-200 sticky top-24">
                <div className="mb-6">
                  <span className="text-3xl font-bold text-blue">${listing.price}</span>
                  <span className="text-slate-500 text-lg font-medium"> / {listing.pricingUnit || listing.unit || 'slot'}</span>
                </div>
                
                <div className="space-y-5 mb-8">
                  <div className="p-4 border border-slate-200 rounded-xl flex flex-col gap-2">
                    <label htmlFor="booking-date" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Select Date
                    </label>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <input 
                        type="date" 
                        id="booking-date"
                        className="w-full outline-none text-sm font-medium text-blue bg-transparent"
                        value={bookingDate}
                        onChange={(e) => {
                          setBookingDate(e.target.value);
                          setSelectedSlot(null);
                        }}
                      />
                    </div>
                  </div>

                  {/* Calculated Availability Slots */}
                  {bookingDate && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-accent" /> Available Time Slots
                        </label>
                        {isCheckingAvailability && (
                          <span className="text-[11px] text-slate-400 animate-pulse">Checking...</span>
                        )}
                      </div>

                      {isCheckingAvailability ? (
                        <div className="py-4 text-center text-xs text-slate-400">Loading live availability...</div>
                      ) : availabilityData?.available === false || (availabilityData?.slots && availabilityData.slots.length === 0) ? (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>No available booking slots on this date. Please pick another date.</span>
                        </div>
                      ) : availabilityData?.slots && availabilityData.slots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {availabilityData.slots.map((slot, idx) => {
                            const isSelected = selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                                  isSelected 
                                    ? 'bg-blue text-white border-blue shadow-sm' 
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {slot.start} - {slot.end}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">Standard full-day availability apply.</div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleBookClick}
                  disabled={isPending || Boolean(bookingDate && availabilityData?.available === false)}
                  className="w-full bg-button-dark text-white py-4 rounded-full text-lg font-medium hover:bg-button-dark-hover transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      Reserving...
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </>
                  ) : (
                    'Reserve'
                  )}
                </button>
                
                <p className="text-center text-sm text-slate-500 mt-4">
                  You won't be charged yet
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      
      <Footer />

      <BookingAuthModal 
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
            setShowAuthModal(false);
            setShowSuccessModal(true);
        }}
        listingId={listing.id}
        itemNoun={itemNoun}
      />

      <Modal 
        open={showSuccessModal}
        type="success"
        title="Booking Successful!"
        message={`You have successfully booked this ${itemNoun}. We have sent the confirmation details to your email.`}
        buttonInfo="Close"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default ListingDetailsPage;
