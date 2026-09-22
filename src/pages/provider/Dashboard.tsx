import { useMemo } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderMe, useProviderHome, useProviderBookings } from '../../hooks/useProvider';
import { useMyListings } from '../../hooks/useListing';
import { 
    Loader2, 
    Calendar, 
    List, 
    Clock, 
    MapPin, 
    Phone, 
    Mail, 
    ArrowUpRight, 
    TrendingUp,
    CalendarDays,
    Plus,
    User,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { formatReadableDate, formatBookingTimeRange, formatCurrency } from '../../lib/formatters';

const Dashboard = () => {
    const { data: meData, isLoading: isMeLoading } = useProviderMe();
    const { data: homeData, isLoading: isHomeLoading } = useProviderHome();
    const { data: bookingsData, isLoading: isBookingsLoading } = useProviderBookings();
    const { data: listingsData, isLoading: isListingsLoading } = useMyListings();

    const isLoading = (isMeLoading && isHomeLoading) || isBookingsLoading || isListingsLoading;

    // Get provider profile from meData, homeData, or cookie fallback
    const cookieUser = useMemo(() => {
        try {
            const raw = Cookies.get('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, []);

    const rawMe = meData?.provider || meData?.data?.provider || meData?.data || meData;
    const provider = (rawMe?.username || rawMe?.email ? rawMe : null) || homeData?.provider || cookieUser;
    const displayName = provider?.fullName || provider?.username || 'Provider';

    const bookings = Array.isArray(bookingsData?.data) ? bookingsData.data : (Array.isArray(bookingsData) ? bookingsData : []);
    const listings = Array.isArray(listingsData?.data) ? listingsData.data : (Array.isArray(listingsData) ? listingsData : []);

    const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING');

    // Handover specific data from /api/provider/home
    const availableBalance = homeData?.availableBalance ?? 0;
    const nextPayoutDate = homeData?.nextPayoutDate;
    const todaysSchedule = Array.isArray(homeData?.todaysSchedule) ? homeData.todaysSchedule : [];
    const analytics = Array.isArray(homeData?.analytics) ? homeData.analytics : [];

    // Calculate max value for analytics bars
    const maxAnalyticsTotal = useMemo(() => {
        const totals = analytics.map(a => Number(a.total) || 0);
        return Math.max(...totals, 100);
    }, [analytics]);

    const weekTotalRevenue = useMemo(() => {
        return analytics.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    }, [analytics]);

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
                        className="bg-blue hover:bg-button-dark text-white px-5 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                        <List className="w-4 h-4" />
                        Manage Listings
                    </Link>
                    <Link
                        to="/provider/bookings"
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
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
                    {/* Provider Quick Profile Card */}
                    {provider && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
                            
                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                <div className="flex items-center gap-4">
                                    {provider.avatarUrl ? (
                                        <img 
                                            src={provider.avatarUrl} 
                                            alt={displayName} 
                                            className="w-14 h-14 rounded-full object-cover border-2 border-accent/20 shadow-xs"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue to-button-dark text-white font-bold text-xl flex items-center justify-center shadow-xs">
                                            {displayName.slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
                                            {provider.username && (
                                                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                    @{provider.username}
                                                </span>
                                            )}
                                            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-accent/10 text-accent border border-accent/20">
                                                {provider.role || 'PROVIDER'}
                                            </span>
                                            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Provider
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
                                            <span key={cat} className="px-3 py-1 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border border-slate-200 rounded-full text-xs font-semibold uppercase tracking-wider shadow-2xs">
                                                {cat}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No categories assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Financials & Key Metrics Cards - Vibrant Gradients Matching Design Reference */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Card 1: Rose/Pink Gradient - Available Balance */}
                        <div className="relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-r from-[#ff3b80] via-[#f43f5e] to-[#e61e68] shadow-md shadow-pink-500/20 flex flex-col justify-between min-h-[140px]">
                            <div>
                                <p className="text-xs font-semibold text-white/90 tracking-wide uppercase">Available Balance</p>
                            </div>
                            <div className="flex items-end justify-between mt-4">
                                <div className="shrink-0">
                                    <svg className="w-14 h-9 text-white" viewBox="0 0 64 40" fill="currentColor">
                                        <rect x="2" y="16" width="6" height="24" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="12" y="8" width="6" height="32" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="22" y="22" width="6" height="18" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="32" y="12" width="6" height="28" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="42" y="4" width="6" height="36" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="52" y="18" width="6" height="22" rx="2" fill="currentColor" fillOpacity="0.95" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl lg:text-3xl font-black tracking-tight">{formatCurrency(availableBalance)}</h3>
                                    <p className="text-[11px] text-white/80 font-medium mt-0.5">Eligible for payout</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Vibrant Purple Gradient with Soft Wave Graphic - Active Listings */}
                        <div className="relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] shadow-md shadow-purple-600/20 flex flex-col justify-between min-h-[140px]">
                            {/* Decorative smooth wave SVG at the bottom */}
                            <svg className="absolute -bottom-1 left-0 right-0 w-full h-14 pointer-events-none text-white/20" viewBox="0 0 300 70" preserveAspectRatio="none" fill="currentColor">
                                <path d="M0,35 C50,10 110,60 170,30 C220,10 260,45 300,25 L300,70 L0,70 Z" />
                                <path d="M0,50 C60,25 130,65 190,40 C250,15 270,50 300,40 L300,70 L0,70 Z" fillOpacity="0.4" />
                            </svg>

                            <div className="relative z-10">
                                <p className="text-xs font-semibold text-white/90 tracking-wide uppercase">Active Listings</p>
                            </div>
                            <div className="relative z-10 flex items-end justify-between mt-4">
                                <div>
                                    <h3 className="text-2xl lg:text-3xl font-black tracking-tight">{listings.length}</h3>
                                    <p className="text-[11px] text-white/80 font-medium mt-0.5">Published & draft items</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-bold px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                                        Live Catalog
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Sky Cyan / Blue Gradient with Line Graph & Dots - Next Payout */}
                        <div className="relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-r from-[#00b4db] via-[#0099cc] to-[#0083b0] shadow-md shadow-cyan-500/20 flex flex-col justify-between min-h-[140px]">
                            <div>
                                <p className="text-xs font-semibold text-white/90 tracking-wide uppercase">Next Payout</p>
                            </div>
                            <div className="flex items-end justify-between mt-2">
                                <div>
                                    <h3 className="text-xl lg:text-2xl font-black tracking-tight">
                                        {nextPayoutDate ? formatReadableDate(nextPayoutDate, { month: 'short', day: 'numeric' }) : 'Scheduled'}
                                    </h3>
                                    <div className="mt-1.5 inline-flex items-center gap-1 bg-white text-[#0083b0] px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-2xs">
                                        <span>Monthly</span>
                                        <span className="text-[8px]">▼</span>
                                    </div>
                                </div>
                                <div className="shrink-0 mb-1">
                                    <svg className="w-20 h-10 text-white" viewBox="0 0 100 48" fill="none">
                                        <path d="M 5 34 C 18 12, 32 40, 45 18 C 58 5, 72 36, 85 14 L 95 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="5" cy="34" r="3" fill="white" />
                                        <circle cx="24" cy="22" r="3" fill="white" />
                                        <circle cx="45" cy="18" r="3" fill="white" />
                                        <circle cx="64" cy="16" r="3" fill="white" />
                                        <circle cx="85" cy="14" r="3" fill="white" />
                                        <circle cx="95" cy="24" r="3" fill="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Golden Amber / Sunset Orange Gradient - Pending Bookings */}
                        <div className="relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-r from-[#ff9900] via-[#ff7a18] to-[#ff5e36] shadow-md shadow-amber-500/20 flex flex-col justify-between min-h-[140px]">
                            <div>
                                <p className="text-xs font-semibold text-white/90 tracking-wide uppercase">Pending Bookings</p>
                            </div>
                            <div className="flex items-end justify-between mt-4">
                                <div className="shrink-0">
                                    <svg className="w-14 h-9 text-white" viewBox="0 0 64 40" fill="currentColor">
                                        <rect x="2" y="10" width="6" height="30" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="12" y="4" width="6" height="36" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="22" y="20" width="6" height="20" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="32" y="8" width="6" height="32" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="42" y="16" width="6" height="24" rx="2" fill="currentColor" fillOpacity="0.95" />
                                        <rect x="52" y="6" width="6" height="34" rx="2" fill="currentColor" fillOpacity="0.95" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl lg:text-3xl font-black tracking-tight">{pendingBookings.length}</h3>
                                    <p className="text-[11px] text-white/80 font-medium mt-0.5">Requires action</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Schedule & 7-Day Revenue Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Today's Schedule */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-xs shadow-blue-500/20">
                                            <CalendarDays className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">Today's Schedule</h3>
                                            <p className="text-[11px] text-slate-400">Live booking timeline</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                                        todaysSchedule.length > 0 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                            : 'bg-slate-50 text-slate-600 border-slate-200'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${todaysSchedule.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                        {todaysSchedule.length} Confirmed
                                    </span>
                                </div>

                                {todaysSchedule.length > 0 ? (
                                    <div className="space-y-3">
                                        {todaysSchedule.map((slot: any, idx: number) => {
                                            const scheduleTime = formatBookingTimeRange(
                                                slot.startAt || slot.bookingDate || slot.startTime,
                                                slot.endAt || slot.endTime,
                                                slot.durationHours
                                            ) || 'All Day';

                                            return (
                                                <div key={slot.id || idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-3 min-w-0 pr-3">
                                                        <div className="w-9 h-9 rounded-full bg-blue text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                                            {(slot.attendeeFirstName?.[0] || 'U') + (slot.attendeeLastName?.[0] || '')}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-sm text-slate-900 truncate">
                                                                {slot.listing?.title || 'Confirmed Booking'}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                                                <span>{slot.attendeeFirstName} {slot.attendeeLastName}</span>
                                                                <span>•</span>
                                                                <span className="font-semibold text-blue flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" /> {scheduleTime}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0">
                                                        CONFIRMED
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-8 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-50/60 to-transparent rounded-xl border border-dashed border-slate-200">
                                        <div className="w-14 h-14 rounded-full bg-blue/10 text-blue flex items-center justify-center mb-3 shadow-2xs">
                                            <Calendar className="w-7 h-7" />
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-800">All Clear for Today</h4>
                                        <p className="text-xs text-slate-400 max-w-xs mt-1">
                                            No active bookings scheduled for today. New requests will appear here in real-time.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                                <Link 
                                    to="/provider/bookings" 
                                    className="text-xs font-bold text-blue hover:text-button-dark inline-flex items-center gap-1 transition-colors"
                                >
                                    Open Full Schedule <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>

                        {/* 7-Day Revenue Analytics */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs shadow-emerald-500/20">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">7-Day Booking Analytics</h3>
                                            <p className="text-[11px] text-slate-400">Revenue activity over past 7 days</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-extrabold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                                            7D Total: {formatCurrency(weekTotalRevenue)}
                                        </span>
                                    </div>
                                </div>

                                {analytics.length > 0 ? (
                                    <div className="space-y-3 pt-1">
                                        {analytics.map((item, idx) => {
                                            const amount = Number(item.total) || 0;
                                            const pct = Math.round((amount / maxAnalyticsTotal) * 100);
                                            const hasValue = amount > 0;

                                            return (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="w-10 text-xs font-bold text-slate-600 bg-slate-100 py-1 px-1.5 text-center rounded-md">
                                                        {item.day}
                                                    </span>
                                                    <div className="flex-1 bg-slate-100/90 h-4 rounded-full overflow-hidden relative shadow-inner">
                                                        {hasValue ? (
                                                            <div 
                                                                className="bg-gradient-to-r from-blue via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-xs" 
                                                                style={{ width: `${Math.max(pct, 6)}%` }}
                                                            />
                                                        ) : (
                                                            <div className="w-2 h-full bg-slate-200 rounded-full" />
                                                        )}
                                                    </div>
                                                    <span className={`w-24 text-right text-xs font-bold ${hasValue ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                                                        {formatCurrency(amount)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-8 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-50/60 to-transparent rounded-xl border border-dashed border-slate-200">
                                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-2xs">
                                            <TrendingUp className="w-7 h-7" />
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-800">No Analytics Yet</h4>
                                        <p className="text-xs text-slate-400 max-w-xs mt-1">
                                            Your daily revenue trends will automatically visualize here as bookings complete.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>Updated real-time from server</span>
                                <span className="font-semibold text-slate-600">Max Scale: {formatCurrency(maxAnalyticsTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Columns: Recent Bookings & Listings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bookings Overview */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xs shadow-indigo-500/20">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">Recent Bookings</h3>
                                            <p className="text-[11px] text-slate-400">Latest customer activity</p>
                                        </div>
                                    </div>
                                    <Link 
                                        to="/provider/bookings" 
                                        className="text-xs font-bold text-blue hover:text-white hover:bg-blue px-3.5 py-1.5 rounded-full border border-blue/30 inline-flex items-center gap-1 transition-all shadow-2xs"
                                    >
                                        View All <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                {bookings.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {bookings.slice(0, 5).map((booking: any) => {
                                            const status = (booking.status || 'PENDING').toUpperCase();
                                            const isConfirmed = status === 'CONFIRMED';
                                            const isPending = status === 'PENDING';
                                            const isCompleted = status === 'COMPLETED';
                                            const isCancelled = status === 'CANCELLED' || status === 'REJECTED';

                                            return (
                                                <div key={booking.id} className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2.5 rounded-xl transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0 pr-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/80">
                                                            <User className="w-4 h-4 text-slate-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-sm text-slate-900 truncate">
                                                                {booking.listing?.title || 'Listing Booking'}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                                                                <span className="font-medium text-slate-700">
                                                                    {booking.attendeeFirstName || 'Customer'} {booking.attendeeLastName || ''}
                                                                </span>
                                                                {booking.bookingDate && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{formatReadableDate(booking.bookingDate, { month: 'short', day: 'numeric' })}</span>
                                                                    </>
                                                                )}
                                                                {booking.durationHours && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-600">
                                                                            {booking.durationHours}h
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 border inline-flex items-center gap-1 ${
                                                        isPending ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                                        isConfirmed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                                        isCompleted ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                                        isCancelled ? 'bg-rose-50 text-rose-800 border-rose-200' :
                                                        'bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}>
                                                        {isPending && <AlertCircle className="w-3 h-3 text-amber-600" />}
                                                        {isConfirmed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                                        {isCompleted && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                                                        {isCancelled && <XCircle className="w-3 h-3 text-rose-600" />}
                                                        {status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-slate-400">
                                        <p className="text-xs font-medium text-slate-500">No bookings recorded yet.</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>Showing latest {Math.min(bookings.length, 5)} bookings</span>
                                <span className="font-semibold text-slate-600">{bookings.length} total</span>
                            </div>
                        </div>

                        {/* Recent Listings Overview */}
                        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-xs shadow-pink-500/20">
                                            <List className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">My Listings</h3>
                                            <p className="text-[11px] text-slate-400">Active services & offerings</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link 
                                            to="/provider/listings" 
                                            className="text-xs font-bold text-blue hover:text-white hover:bg-blue px-3.5 py-1.5 rounded-full border border-blue/30 inline-flex items-center gap-1 transition-all shadow-2xs"
                                        >
                                            View All <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                {listings.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {listings.slice(0, 5).map((listing: any) => {
                                            const isPublished = (listing.status || '').toLowerCase() === 'published';
                                            const isDraft = (listing.status || '').toLowerCase() === 'draft';
                                            const pricingUnit = (listing.pricingUnit || listing.unit || 'slot').toLowerCase();

                                            return (
                                                <div key={listing.id} className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2.5 rounded-xl transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0 pr-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200/70 overflow-hidden">
                                                            {listing.images && Array.isArray(listing.images) && listing.images.length > 0 ? (
                                                                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover rounded-full" />
                                                            ) : (
                                                                <Layers className="w-5 h-5 text-slate-500" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-bold text-sm text-slate-900 truncate">
                                                                    {listing.title}
                                                                </p>
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                                                                    isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                                    isDraft ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                                }`}>
                                                                    {listing.status || 'draft'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                                                                <span className="flex items-center gap-1 text-slate-500">
                                                                    <MapPin className="w-3 h-3 text-slate-400" />
                                                                    {[listing.city, listing.state, listing.country].filter(Boolean).join(', ') || 'Location not set'}
                                                                </span>
                                                                {listing.type && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="font-semibold text-slate-600 uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                                                                            {listing.type}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <span className="font-black text-sm text-slate-900">
                                                            {formatCurrency(listing.price)}
                                                        </span>
                                                        <p className="text-[10px] text-slate-400 font-medium">/ {pricingUnit}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-slate-400">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                                            <List className="w-6 h-6" />
                                        </div>
                                        <p className="text-xs font-medium text-slate-500">No listings created yet.</p>
                                        <Link 
                                            to="/provider/listings" 
                                            className="text-xs font-semibold text-white bg-blue hover:bg-button-dark px-4 py-1.5 rounded-full mt-3 inline-flex items-center gap-1 transition-colors shadow-xs"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Create your first listing
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>Showing latest {Math.min(listings.length, 5)} listings</span>
                                <span className="font-semibold text-slate-600">{listings.length} total</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProviderLayout>
    );
};

export default Dashboard;

