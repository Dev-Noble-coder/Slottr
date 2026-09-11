import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, ChevronLeft, Calendar, Clock, AlertCircle, Info, ShieldCheck, Check, Minus, Plus } from 'lucide-react';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import Modal from '../../components/ui/Modal';
import BookingAuthModal from './components/BookingAuthModal';
import { useCustomerDashboard } from '../../hooks/useCustomer';
import { useListings, usePublicAvailability } from '../../hooks/useListing';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const ListingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [durationHours, setDurationHours] = useState<number>(1);
  const [selectedStartTime, setSelectedStartTime] = useState<string>('09:00');

  const { data: customerData, isSuccess } = useCustomerDashboard();
  const { data: listingsData, isLoading, isError } = useListings();

  // Read session cookie if any
  const cookieUser = useMemo(() => {
    try {
      const raw = Cookies.get('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const loggedInUser = customerData?.user || cookieUser;
  const isAuthenticated = Boolean(isSuccess && customerData) || Boolean(cookieUser);

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

  // Determine min and max allowed duration
  const minAllowedDuration = useMemo(() => {
    return listing?.minDuration ? Math.max(1, Number(listing.minDuration)) : 1;
  }, [listing]);

  const slotCapacityHours = useMemo(() => {
    if (!selectedSlot) return 24;
    try {
      const [startH, startM = 0] = selectedSlot.start.split(':').map(Number);
      const [endH, endM = 0] = selectedSlot.end.split(':').map(Number);
      const diff = (endH + endM / 60) - (startH + startM / 60);
      return diff > 0 ? Math.floor(diff) : 1;
    } catch {
      return 24;
    }
  }, [selectedSlot]);

  const maxAllowedDuration = useMemo(() => {
    const listingMax = listing?.maxDuration ? Number(listing.maxDuration) : 24;
    return Math.max(minAllowedDuration, Math.min(listingMax, slotCapacityHours));
  }, [listing, minAllowedDuration, slotCapacityHours]);

  // Sync duration with listing min/max boundaries
  useEffect(() => {
    if (listing?.minDuration) {
      setDurationHours(Number(listing.minDuration));
    }
  }, [listing?.minDuration]);

  useEffect(() => {
    setDurationHours(prev => {
      if (prev < minAllowedDuration) return minAllowedDuration;
      if (prev > maxAllowedDuration) return maxAllowedDuration;
      return prev;
    });
  }, [minAllowedDuration, maxAllowedDuration]);

  // Helper to calculate end time string
  const calculateEndTime = (startStr: string, duration: number) => {
    try {
      const [h, m = 0] = startStr.split(':').map(Number);
      const totalMinutes = h * 60 + m + duration * 60;
      const endH = Math.floor(totalMinutes / 60) % 24;
      const endM = totalMinutes % 60;
      return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  // Compute available start time options within the slot or general day
  const availableStartTimes = useMemo(() => {
    if (!selectedSlot) {
      const times: string[] = [];
      for (let h = 6; h <= 22; h++) {
        times.push(`${String(h).padStart(2, '0')}:00`);
      }
      return times;
    }

    try {
      const [startH, startM = 0] = selectedSlot.start.split(':').map(Number);
      const [endH, endM = 0] = selectedSlot.end.split(':').map(Number);
      const startTotalMinutes = startH * 60 + startM;
      const endTotalMinutes = endH * 60 + endM;
      const neededMinutes = durationHours * 60;
      const latestStartMinutes = endTotalMinutes - neededMinutes;

      const times: string[] = [];
      for (let m = startTotalMinutes; m <= latestStartMinutes; m += 60) {
        const hour = Math.floor(m / 60);
        const min = m % 60;
        times.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
      }

      if (times.length === 0) {
        times.push(selectedSlot.start);
      }
      return times;
    } catch {
      return [selectedSlot.start];
    }
  }, [selectedSlot, durationHours]);

  // Ensure selectedStartTime is valid in current availableStartTimes
  useEffect(() => {
    if (availableStartTimes.length > 0 && !availableStartTimes.includes(selectedStartTime)) {
      setSelectedStartTime(availableStartTimes[0]);
    }
  }, [availableStartTimes, selectedStartTime]);

  // Slot toggle selection handler
  const handleSlotToggle = (slot: { start: string; end: string }) => {
    if (selectedSlot?.start === slot.start && selectedSlot?.end === slot.end) {
      // Toggle unselect
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
      setSelectedStartTime(slot.start);
    }
  };

  // Pricing calculation per handover rules
  const estimatedTotal = useMemo(() => {
    if (!listing?.price) return 0;
    const basePrice = Number(listing.price) || 0;
    const unit = (listing.pricingUnit || 'HOUR').toUpperCase();

    if (unit === 'DAY') {
      const days = Math.max(1, Math.ceil(durationHours / 24));
      return days * basePrice;
    } else if (unit === 'WEEK') {
      const weeks = Math.max(1, Math.ceil(durationHours / (24 * 7)));
      return weeks * basePrice;
    } else if (unit === 'MONTH') {
      const months = Math.max(1, Math.ceil(durationHours / (24 * 30)));
      return months * basePrice;
    }
    return durationHours * basePrice;
  }, [listing, durationHours]);

  // Compute ISO start datetime
  const isoBookingDate = useMemo(() => {
    if (!bookingDate) return undefined;
    const startTime = selectedStartTime || (selectedSlot ? selectedSlot.start : '09:00');
    try {
      return new Date(`${bookingDate}T${startTime}:00`).toISOString();
    } catch {
      return `${bookingDate}T${startTime}:00.000Z`;
    }
  }, [bookingDate, selectedStartTime, selectedSlot]);

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

  // Availability helper states
  const hasSlots = Boolean(availabilityData?.slots && availabilityData.slots.length > 0);
  const isDateUnavailable = Boolean(bookingDate && !isCheckingAvailability && (availabilityData?.available === false || (availabilityData?.slots && availabilityData.slots.length === 0)));
  const isSlotRequiredAndMissing = Boolean(bookingDate && !isCheckingAvailability && hasSlots && !selectedSlot);

  const isReserveDisabled = Boolean(
    !bookingDate || 
    isCheckingAvailability || 
    isDateUnavailable || 
    isSlotRequiredAndMissing
  );

  const handleBookClick = () => {
    if (!bookingDate) {
      toast.error("Please select a date for your booking.");
      return;
    }

    if (isCheckingAvailability) {
      toast.error("Checking availability slots. Please wait a moment.");
      return;
    }

    if (isDateUnavailable) {
      toast.error("No booking slots available on this date. Please select another date.");
      return;
    }

    if (isSlotRequiredAndMissing) {
      toast.error("Please select an available time slot.");
      return;
    }

    if (listing.minDuration && durationHours < Number(listing.minDuration)) {
      toast.error(`Minimum booking duration is ${listing.minDuration} hours.`);
      return;
    }

    if (listing.maxDuration && durationHours > Number(listing.maxDuration)) {
      toast.error(`Maximum booking duration is ${listing.maxDuration} hours.`);
      return;
    }

    setShowAuthModal(true);
  };

  const getListingNoun = (category: string) => {
    if (category === 'ITEMS' || category === 'Equipment') return 'item';
    if (category === 'RIDES' || category === 'Cars & Vehicles') return 'ride';
    if (category === 'VENUE') return 'venue';
    if (category === 'EVENT') return 'event';
    if (category === 'SERVICE') return 'service';
    return 'space';
  };

  const itemNoun = getListingNoun(listing.category || listing.type);

  // Initial attendee data from logged-in user profile
  const initialAttendeeData = loggedInUser ? {
    firstName: loggedInUser.firstName || loggedInUser.fullName?.split(' ')[0] || '',
    lastName: loggedInUser.lastName || loggedInUser.fullName?.split(' ').slice(1).join(' ') || '',
    email: loggedInUser.email || '',
    phone: loggedInUser.phone || '',
    country: loggedInUser.country || 'NG'
  } : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-grow pb-24">
        {/* Back navigation */}
        <div className="w-full max-w-[1440px] mx-auto px-4 py-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-blue transition-colors font-medium cursor-pointer"
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
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-sm bg-blue/10 text-blue font-semibold text-xs uppercase tracking-wider">
                        {listing.type || 'LISTING'}
                      </span>
                      {listing.price && (
                        <span className="px-2.5 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold text-xs">
                          ${listing.price} / {listing.pricingUnit ? listing.pricingUnit.toLowerCase() : 'slot'}
                        </span>
                      )}
                    </div>
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
                  <p className="text-slate-600 text-base leading-relaxed">
                    {listing.description || `Experience high quality with this ${itemNoun}.`}
                  </p>
                </div>

                {/* Duration limits badge */}
                {(listing.minDuration || listing.maxDuration) && (
                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-4 h-4 text-accent" />
                      Duration Policy:
                    </span>
                    {listing.minDuration && <span>Min: <strong>{listing.minDuration} hrs</strong></span>}
                    {listing.maxDuration && <span>Max: <strong>{listing.maxDuration} hrs</strong></span>}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-8 border border-slate-200 sticky top-24 shadow-sm">
                <div className="mb-6 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold text-blue">${listing.price}</span>
                    <span className="text-slate-500 text-sm font-medium"> / {listing.pricingUnit || 'slot'}</span>
                  </div>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                
                <div className="space-y-5 mb-6">
                  {/* Date Input */}
                  <div className="p-4 border border-slate-200 rounded-xl flex flex-col gap-2">
                    <label htmlFor="booking-date" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Select Date
                    </label>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <input 
                        type="date" 
                        id="booking-date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full outline-none text-sm font-medium text-blue bg-transparent cursor-pointer"
                        value={bookingDate}
                        onChange={(e) => {
                          setBookingDate(e.target.value);
                          setSelectedSlot(null);
                        }}
                      />
                    </div>
                  </div>

                  {/* Calculated Availability Slots & Time Options */}
                  {bookingDate && (
                    <div className="space-y-4">
                      {/* Slots Header */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-accent" /> Available Time Slots
                          </label>
                          {isCheckingAvailability && (
                            <span className="text-[11px] text-blue font-medium animate-pulse">Fetching...</span>
                          )}
                        </div>

                        {isCheckingAvailability ? (
                          <div className="py-6 flex flex-col items-center justify-center gap-2.5 text-xs text-slate-500 bg-slate-50/80 border border-slate-200 rounded-xl">
                            <div className="animate-spin h-5 w-5 border-2 border-blue border-t-transparent rounded-full"></div>
                            <span className="font-medium text-slate-600">Fetching available time slots...</span>
                          </div>
                        ) : isDateUnavailable ? (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>No available booking slots on this date. Please select another date.</span>
                          </div>
                        ) : hasSlots ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              {availabilityData?.slots?.map((slot: any, idx: number) => {
                                const isSelected = selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSlotToggle(slot)}
                                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                      isSelected 
                                        ? 'bg-blue text-white border-blue shadow-sm' 
                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                                    }`}
                                    title={isSelected ? "Click to unselect" : "Click to select"}
                                  >
                                    <span>{slot.start} - {slot.end}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-white ml-1 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-[11px] text-slate-400 text-right">
                              {selectedSlot ? "Click active slot to unselect" : "Select an availability window above"}
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                            <p>Full-day availability applies for this date.</p>
                          </div>
                        )}
                      </div>

                      {/* When slots are present but none selected yet */}
                      {!isCheckingAvailability && isSlotRequiredAndMissing && (
                        <div className="p-3 bg-blue/5 border border-blue/20 rounded-xl text-xs text-blue flex items-center gap-2">
                          <Info className="w-4 h-4 shrink-0 text-blue" />
                          <span>Please select an available time slot above to configure duration and start time.</span>
                        </div>
                      )}

                      {/* Duration & Start Time Picker Container (Shown once slot is chosen or for full day) */}
                      {!isCheckingAvailability && !isDateUnavailable && (!hasSlots || selectedSlot) && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                          {/* Duration Stepper */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Duration
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                {listing.minDuration && <span>Min: {listing.minDuration}h</span>}
                                {listing.minDuration && listing.maxDuration && <span>•</span>}
                                {listing.maxDuration && <span>Max: {listing.maxDuration}h</span>}
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                              <button
                                type="button"
                                disabled={durationHours <= minAllowedDuration}
                                onClick={() => setDurationHours(prev => Math.max(minAllowedDuration, prev - 1))}
                                className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer"
                                title="Decrease duration"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <div className="text-center">
                                <span className="font-bold text-sm text-blue">{durationHours}</span>
                                <span className="text-xs text-slate-500 ml-1 font-medium">
                                  {durationHours === 1 ? 'hour' : 'hours'}
                                </span>
                              </div>
                              <button
                                type="button"
                                disabled={durationHours >= maxAllowedDuration}
                                onClick={() => setDurationHours(prev => Math.min(maxAllowedDuration, prev + 1))}
                                className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer"
                                title="Increase duration"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Start Time Dropdown */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                              Start Time
                            </label>
                            <div className="relative">
                              <select
                                value={selectedStartTime}
                                onChange={(e) => setSelectedStartTime(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue cursor-pointer appearance-none"
                              >
                                {availableStartTimes.map((time) => {
                                  const endTime = calculateEndTime(time, durationHours);
                                  return (
                                    <option key={time} value={time}>
                                      {time} (Ends at {endTime})
                                    </option>
                                  );
                                })}
                              </select>
                              <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                                <Clock className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          {/* Summary Pill */}
                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                            <span className="text-slate-500">Reserved Time:</span>
                            <span className="font-semibold text-blue">
                              {selectedStartTime} – {calculateEndTime(selectedStartTime, durationHours)} ({durationHours} {durationHours === 1 ? 'hr' : 'hrs'})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  {bookingDate && !isCheckingAvailability && !isDateUnavailable && (!hasSlots || selectedSlot) && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Duration</span>
                        <span className="font-semibold text-slate-800">{durationHours} {durationHours === 1 ? 'hour' : 'hours'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Rate ({listing.pricingUnit || 'hour'})</span>
                        <span className="font-semibold text-slate-800">${listing.price}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                        <span>Estimated Total</span>
                        <span>${estimatedTotal}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  type="button"
                  onClick={handleBookClick}
                  disabled={isReserveDisabled}
                  className={`w-full py-4 rounded-full text-base font-semibold transition-all shadow-sm flex items-center justify-center gap-2 ${
                    isReserveDisabled 
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none' 
                      : 'bg-button-dark text-white hover:bg-button-dark-hover cursor-pointer shadow-md'
                  }`}
                >
                  {!bookingDate ? (
                    'Select a Date to Reserve'
                  ) : isCheckingAvailability ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full"></div>
                      <span>Fetching Time Slots...</span>
                    </>
                  ) : isDateUnavailable ? (
                    'Unavailable on Selected Date'
                  ) : isSlotRequiredAndMissing ? (
                    'Select a Time Slot to Continue'
                  ) : (
                    'Reserve Now'
                  )}
                </button>
                
                <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Real-time availability verified at checkout
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
            // Clear filled booking details
            setBookingDate('');
            setSelectedSlot(null);
            setDurationHours(minAllowedDuration);
            setSelectedStartTime('09:00');
        }}
        listingId={listing.id}
        itemNoun={itemNoun}
        bookingDate={isoBookingDate}
        durationHours={durationHours}
        initialAttendee={initialAttendeeData}
        isAuthenticated={isAuthenticated}
      />

      <Modal 
        open={showSuccessModal}
        type="success"
        title="Booking Successful!"
        message={`You have successfully requested a reservation for this ${itemNoun}. We have sent confirmation details to your email.`}
        buttonInfo="Close"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default ListingDetailsPage;

