import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import { useCreateBooking } from '../../../hooks/useBooking';
import { toast } from 'sonner';

type BookingAuthModalProps = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    listingId: number | string;
    itemNoun: string;
    bookingDate?: string;
    durationHours?: number;
    initialAttendee?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        country?: string;
    };
    isAuthenticated?: boolean;
};

const BookingAuthModal = ({ 
    open, 
    onClose, 
    onSuccess, 
    listingId, 
    itemNoun, 
    bookingDate, 
    durationHours = 1,
    initialAttendee,
    isAuthenticated = false
}: BookingAuthModalProps) => {
    const [view, setView] = useState<'initial' | 'guest'>(isAuthenticated ? 'guest' : 'initial');
    const navigate = useNavigate();
    const { mutateAsync: createBooking, isPending } = useCreateBooking();

    const [guestForm, setGuestForm] = useState({
        attendeeFirstName: initialAttendee?.firstName || '',
        attendeeLastName: initialAttendee?.lastName || '',
        attendeeEmail: initialAttendee?.email || '',
        attendeePhone: initialAttendee?.phone || '',
        attendeeCountry: initialAttendee?.country || 'NG'
    });
    
    const [formErrors, setFormErrors] = useState({
        attendeeFirstName: '',
        attendeeLastName: '',
        attendeeEmail: '',
        attendeePhone: '',
        attendeeCountry: ''
    });

    if (!open) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const validateForm = () => {
        let isValid = true;
        const errors = {
            attendeeFirstName: '',
            attendeeLastName: '',
            attendeeEmail: '',
            attendeePhone: '',
            attendeeCountry: ''
        };

        if (!guestForm.attendeeFirstName.trim()) {
            errors.attendeeFirstName = 'First name is required';
            isValid = false;
        }
        if (!guestForm.attendeeLastName.trim()) {
            errors.attendeeLastName = 'Last name is required';
            isValid = false;
        }
        if (!guestForm.attendeeEmail.trim()) {
            errors.attendeeEmail = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestForm.attendeeEmail)) {
            errors.attendeeEmail = 'Invalid email address';
            isValid = false;
        }
        if (!guestForm.attendeeCountry) {
            errors.attendeeCountry = 'Country is required';
            isValid = false;
        }
        if (!guestForm.attendeePhone.trim()) {
            errors.attendeePhone = 'Phone number is required';
            isValid = false;
        } else if (guestForm.attendeeCountry) {
            const phone = guestForm.attendeePhone.replace(/\s+/g, '');
            const phoneRegexes: Record<string, RegExp> = {
                'NG': /^(?:\+234|0)[789]\d{9}$/,
                'US': /^(?:\+1)?\d{10}$/,
                'CA': /^(?:\+1)?\d{10}$/,
                'GB': /^(?:\+44|0)7\d{9}$/,
                'AU': /^(?:\+61|0)4\d{8}$/,
                'GH': /^(?:\+233|0)\d{9}$/,
                'KE': /^(?:\+254|0)\d{9}$/,
                'ZA': /^(?:\+27|0)\d{9}$/
            };
            
            const regex = phoneRegexes[guestForm.attendeeCountry];
            if (regex && !regex.test(phone)) {
                errors.attendeePhone = `Invalid phone number format for ${guestForm.attendeeCountry}`;
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            await createBooking({
                listingId,
                attendeeFirstName: guestForm.attendeeFirstName.trim(),
                attendeeLastName: guestForm.attendeeLastName.trim(),
                attendeeEmail: guestForm.attendeeEmail.trim(),
                attendeePhone: guestForm.attendeePhone.trim(),
                attendeeCountry: guestForm.attendeeCountry.trim(),
                bookingDate: bookingDate,
                durationHours: Number(durationHours) || 1
            });
            if (!isAuthenticated) {
                setGuestForm({
                    attendeeFirstName: '',
                    attendeeLastName: '',
                    attendeeEmail: '',
                    attendeePhone: '',
                    attendeeCountry: 'NG'
                });
                setView('initial');
            }
            onSuccess();
        } catch (error: any) {
            if (error?.response?.status === 409) {
                toast.error("This slot is unavailable or already booked. Please choose another slot.");
            } else if (error?.response?.status === 400) {
                toast.error(error?.response?.data?.message || "Invalid duration or booking details.");
            } else {
                toast.error(error?.response?.data?.message || "Failed to create booking. Please try again.");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]" onClick={handleOverlayClick}>
            <div className="bg-white rounded-[20px] p-8 md:p-10 max-w-[500px] w-[92%] relative shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {view === 'initial' && !isAuthenticated ? (
                    <div className="text-center mt-4">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-6 text-blue">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-blue mb-3 tracking-tight">Reserve {itemNoun}</h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 px-2">
                            Log in to link this booking to your account, or proceed directly with fast guest checkout.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => navigate('/login')}
                                className="w-full bg-blue text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                            >
                                Continue to Log In
                            </button>
                            <button 
                                onClick={() => setView('guest')}
                                className="w-full bg-slate-100 text-slate-700 px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                Book as Guest
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-2">
                        <div className="flex items-center gap-3 mb-6">
                            {!isAuthenticated && (
                                <button onClick={() => setView('initial')} className="text-slate-400 hover:text-blue transition-colors cursor-pointer">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="19" y1="12" x2="5" y2="12"></line>
                                        <polyline points="12 19 5 12 12 5"></polyline>
                                    </svg>
                                </button>
                            )}
                            <div>
                                <h2 className="text-xl font-bold text-blue">
                                    {isAuthenticated ? 'Attendee Information' : 'Guest Checkout'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {isAuthenticated ? 'Verify attendee details for this reservation.' : 'Enter contact information to receive booking confirmation.'}
                                </p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4" noValidate>
                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    label="First Name" 
                                    placeholder="John" 
                                    value={guestForm.attendeeFirstName}
                                    onChange={(e) => setGuestForm({...guestForm, attendeeFirstName: e.target.value})}
                                    error={formErrors.attendeeFirstName}
                                />
                                <Input 
                                    label="Last Name" 
                                    placeholder="Doe" 
                                    value={guestForm.attendeeLastName}
                                    onChange={(e) => setGuestForm({...guestForm, attendeeLastName: e.target.value})}
                                    error={formErrors.attendeeLastName}
                                />
                            </div>
                            <Input 
                                label="Email Address" 
                                type="email"
                                placeholder="johndoe@gmail.com" 
                                value={guestForm.attendeeEmail}
                                onChange={(e) => setGuestForm({...guestForm, attendeeEmail: e.target.value})}
                                error={formErrors.attendeeEmail}
                            />
                            <Input 
                                label="Phone Number" 
                                type="tel"
                                placeholder="+2348012345678" 
                                value={guestForm.attendeePhone}
                                onChange={(e) => setGuestForm({...guestForm, attendeePhone: e.target.value})}
                                error={formErrors.attendeePhone}
                            />
                            <div className="flex flex-col mb-2">
                                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Country (ISO-2)</label>
                                <div className="relative">
                                    <select
                                        className={`w-full bg-transparent border-b pb-2 text-sm font-medium outline-none transition-colors appearance-none ${
                                            formErrors.attendeeCountry
                                                ? 'border-red-500 text-red-600 focus:border-red-500'
                                                : 'border-slate-300 text-slate-900 focus:border-blue'
                                        }`}
                                        value={guestForm.attendeeCountry}
                                        onChange={(e) => setGuestForm({...guestForm, attendeeCountry: e.target.value})}
                                    >
                                        <option value="NG">NG (Nigeria)</option>
                                        <option value="US">US (United States)</option>
                                        <option value="GB">GB (United Kingdom)</option>
                                        <option value="CA">CA (Canada)</option>
                                        <option value="AU">AU (Australia)</option>
                                        <option value="GH">GH (Ghana)</option>
                                        <option value="KE">KE (Kenya)</option>
                                        <option value="ZA">ZA (South Africa)</option>
                                    </select>
                                    <div className="absolute right-0 bottom-2 pointer-events-none text-slate-400">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                                {formErrors.attendeeCountry && (
                                    <span className="text-xs text-red-500 mt-1">{formErrors.attendeeCountry}</span>
                                )}
                            </div>

                            <button 
                                type="submit"
                                disabled={isPending || !guestForm.attendeeFirstName || !guestForm.attendeeLastName || !guestForm.attendeeEmail}
                                className="w-full bg-button-dark text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-button-dark-hover transition-colors shadow-sm cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <span>Confirming Reservation...</span>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </>
                                ) : (
                                    'Confirm & Reserve'
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingAuthModal;

