import { useState, useRef, useEffect } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderMe, useProviderHome, useUploadAvatar, useUpdateProviderProfile } from '../../hooks/useProvider';
import { 
    Loader2, 
    Camera, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Navigation, 
    Tag, 
    ShieldCheck, 
    Building2,
    Calendar,
    List,
    CheckCircle2,
    Edit3,
    X,
    Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ALL_CATEGORIES = [
    "ITEMS",
    "VENUE",
    "RIDES",
    "PROPERTY",
    "SERVICE",
    "EVENT",
    "OTHERS"
];

const Profile = () => {
    const { data: meData, isLoading: isLoadingMe } = useProviderMe();
    const { data: homeData, isLoading: isLoadingHome } = useProviderHome();
    const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProviderProfile();
    
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit profile modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFullName, setEditFullName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editCity, setEditCity] = useState('');
    const [editState, setEditState] = useState('');
    const [editServiceRadius, setEditServiceRadius] = useState('');
    const [editCategories, setEditCategories] = useState<string[]>([]);
    const [editUsername, setEditUsername] = useState('');

    const rawMe = meData?.provider || meData?.data?.provider || meData?.data || meData;
    const provider = rawMe?.username || rawMe?.email ? rawMe : homeData?.provider;
    const displayName = provider?.fullName || provider?.username || 'Provider';
    const isLoading = isLoadingMe && isLoadingHome;

    useEffect(() => {
        if (provider) {
            setEditFullName(provider.fullName || '');
            setEditPhone(provider.phone || '');
            setEditCity(provider.city || '');
            setEditState(provider.state || '');
            setEditServiceRadius(provider.serviceRadius ? String(provider.serviceRadius) : '');
            setEditCategories(provider.categories || []);
            setEditUsername(provider.username || '');
        }
    }, [provider]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            await uploadAvatar(formData);
            toast.success("Avatar updated successfully.");
            setSelectedFile(null);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to upload avatar.");
        }
    };

    const toggleCategory = (cat: string) => {
        if (editCategories.includes(cat)) {
            setEditCategories(editCategories.filter(c => c !== cat));
        } else {
            setEditCategories([...editCategories, cat]);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile({
                fullName: editFullName.trim() || undefined,
                phone: editPhone.trim() || undefined,
                city: editCity.trim() || undefined,
                state: editState.trim() || undefined,
                serviceRadius: editServiceRadius ? Number(editServiceRadius) : null,
                categories: editCategories.length > 0 ? editCategories : undefined,
                username: editUsername.trim() || undefined
            });
            toast.success("Provider profile updated successfully!");
            setIsEditModalOpen(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update profile.");
        }
    };

    const currentAvatar = avatarPreview || provider?.avatarUrl;

    return (
        <ProviderLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Provider Profile</h1>
                    <p className="text-sm text-slate-500 mt-1">View and manage your provider credentials and service coverage.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-accent hover:bg-accent/90 shadow-sm shadow-accent/20 transition-all cursor-pointer"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                    </button>
                    <Link
                        to="/provider/settings"
                        className="inline-flex items-center gap-1.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xs transition-all"
                    >
                        Account Settings
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="space-y-6 max-w-5xl">
                    {/* Header Banner Card */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="relative group">
                                    <div 
                                        className="w-20 h-20 rounded-full ring-4 ring-accent/10 border-2 border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer shadow-inner"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {currentAvatar ? (
                                            <img src={currentAvatar} alt={displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 text-slate-400" />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white rounded-full">
                                            <Camera className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleFileSelect} 
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
                                        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-accent/10 text-accent border border-accent/20">
                                            <Sparkles className="w-3 h-3" /> {provider?.role || 'PROVIDER'}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-400 mt-1">
                                        {provider?.username ? `@${provider.username}` : '@provider'}
                                    </p>
                                    
                                    {selectedFile && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <button
                                                onClick={handleUpload}
                                                disabled={isUploadingAvatar}
                                                className="bg-accent text-white px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-accent/90 flex items-center gap-1.5 disabled:opacity-50 shadow-xs shadow-accent/20 cursor-pointer"
                                            >
                                                {isUploadingAvatar && <Loader2 className="w-3 h-3 animate-spin" />}
                                                {isUploadingAvatar ? 'Saving...' : 'Confirm Upload'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setAvatarPreview(null);
                                                }}
                                                className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1 cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    to="/provider/listings"
                                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                                >
                                    <List className="w-3.5 h-3.5 text-slate-500" /> Listings
                                </Link>
                                <Link
                                    to="/provider/bookings"
                                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                                >
                                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Bookings
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Contact & Identification
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</span>
                                    <p className="text-sm font-semibold text-slate-800">{provider?.fullName || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username</span>
                                    <p className="text-sm font-semibold text-slate-800">@{provider?.username || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800 truncate">{provider?.email || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">{provider?.phone || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
                                </div>
                            </div>
                        </div>

                        {/* Location & Coverage */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Service Location & Coverage
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> City
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">{provider?.city || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> State
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">{provider?.state || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                        <Navigation className="w-3.5 h-3.5 text-slate-400" /> Service Radius
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">{provider?.serviceRadius ? `${provider.serviceRadius} km` : <span className="text-slate-400 italic font-normal">Not configured</span>}</p>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                                        <Tag className="w-3.5 h-3.5 text-slate-400" /> Service Categories
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {provider?.categories && provider.categories.length > 0 ? (
                                            provider.categories.map((cat: string) => (
                                                <span 
                                                    key={cat} 
                                                    className="px-3 py-1 bg-white border border-slate-200/80 text-slate-800 rounded-full text-xs font-semibold shadow-2xs"
                                                >
                                                    {cat}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No categories assigned</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal (PATCH /api/provider/profile) */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col my-auto shadow-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Edit Provider Profile</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Update your business credentials, location, and service categories.</p>
                            </div>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={editFullName}
                                        onChange={(e) => setEditFullName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10 transition-all"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Username</label>
                                    <input 
                                        type="text" 
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10 transition-all"
                                        placeholder="janedoe"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10 transition-all"
                                        placeholder="+2348012345678"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Service Radius (km)</label>
                                    <input 
                                        type="number" 
                                        value={editServiceRadius}
                                        onChange={(e) => setEditServiceRadius(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10 transition-all"
                                        placeholder="e.g. 25"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">City</label>
                                    <input 
                                        type="text" 
                                        value={editCity}
                                        onChange={(e) => setEditCity(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10 transition-all"
                                        placeholder="Lagos"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">State</label>
                                    <input 
                                        type="text" 
                                        value={editState}
                                        onChange={(e) => setEditState(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10 transition-all"
                                        placeholder="Lagos"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 pt-2">
                                <label className="text-xs font-semibold text-slate-700">Service Categories</label>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {ALL_CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => toggleCategory(cat)}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                                editCategories.includes(cat)
                                                    ? 'bg-accent text-white border-accent shadow-xs shadow-accent/20'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-0 pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-accent hover:bg-accent/90 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm shadow-accent/20"
                                >
                                    {isUpdatingProfile ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ProviderLayout>
    );
};

export default Profile;

