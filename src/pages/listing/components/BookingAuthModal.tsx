import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import { useCreateBooking } from '../../../hooks/useBooking';
import { toast } from 'sonner';

type BookingAuthModalProps = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    listingId: number;
    itemNoun: string;
};

const BookingAuthModal = ({ open, onClose, onSuccess, listingId, itemNoun }: BookingAuthModalProps) => {
    const [view, setView] = useState<'initial' | 'guest'>('initial');
    const navigate = useNavigate();
    const { mutateAsync: createBooking, isPending } = useCreateBooking();

    const [guestForm, setGuestForm] = useState({
        attendeeFirstName: '',
        attendeeLastName: '',
        attendeeEmail: '',
        attendeePhone: '',
        attendeeCountry: ''
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
            // Basic regex validation by country
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
                errors.attendeePhone = `Invalid phone number for ${guestForm.attendeeCountry}`;
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleGuestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            await createBooking({
                listingId,
                ...guestForm
            });
            onSuccess();
        } catch (error) {
            toast.error("Failed to create guest booking. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]" onClick={handleOverlayClick}>
            <div className="bg-white rounded-[20px] p-8 md:p-12 max-w-[500px] w-[92%] relative shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {view === 'initial' ? (
                    <div className="text-center mt-4">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-6 text-blue">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-medium text-blue mb-4 tracking-tight">Authentication Required</h2>
                        <p className="text-slate-600 text-[15px] leading-relaxed mb-8 px-2">
                            You need to log in to book this {itemNoun}. Alternatively, you can proceed as a guest.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => navigate('/login')}
                                className="w-full bg-blue text-white px-6 py-3.5 rounded-full text-[15px] font-medium hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                            >
                                Continue to Log In
                            </button>
                            <button 
                                onClick={() => setView('guest')}
                                className="w-full bg-slate-100 text-slate-700 px-6 py-3.5 rounded-full text-[15px] font-medium hover:bg-slate-200 transition-colors shadow-sm cursor-pointer"
                            >
                                Book as a Guest
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-2">
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={() => setView('initial')} className="text-slate-400 hover:text-blue transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                            </button>
                            <h2 className="text-2xl font-semibold text-blue">Guest Booking</h2>
                        </div>
                        
                        <form onSubmit={handleGuestSubmit} className="flex flex-col gap-4" noValidate>
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
                            <div className="flex flex-col mb-4">
                                <label className="text-[#A1A1AA] text-[15px] mb-2">Country</label>
                                <div className="relative">
                                    <select
                                        className={`w-full bg-transparent border-b pb-2 text-[17px] outline-none transition-colors appearance-none ${
                                            formErrors.attendeeCountry
                                                ? 'border-[#CB3030] text-[#CB3030] focus:border-[#CB3030]'
                                                : 'border-[#1E293B] text-[#1E293B] focus:border-[#1E293B]'
                                        }`}
                                        value={guestForm.attendeeCountry}
                                        onChange={(e) => setGuestForm({...guestForm, attendeeCountry: e.target.value})}
                                    >
                                        <option value="" disabled>e.g. NG</option>
                                        <option value="NG">NG (Nigeria)</option>
                                        <option value="US">US (United States)</option>
                                        <option value="GB">GB (United Kingdom)</option>
                                        <option value="CA">CA (Canada)</option>
                                        <option value="AU">AU (Australia)</option>
                                        <option value="GH">GH (Ghana)</option>
                                        <option value="KE">KE (Kenya)</option>
                                        <option value="ZA">ZA (South Africa)</option>
                                    </select>
                                    <div className="absolute right-0 bottom-3 pointer-events-none text-[#1E293B]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isPending || !guestForm.attendeeFirstName || !guestForm.attendeeLastName || !guestForm.attendeeEmail}
                                className="w-full bg-blue text-white px-6 py-3.5 rounded-full text-[15px] font-medium hover:bg-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50 mt-4 flex items-center justify-center"
                            >
                                {isPending ? 'Booking...' : 'Complete Booking'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingAuthModal;
