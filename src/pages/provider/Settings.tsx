import { useState, useRef, useEffect } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderMe, useProviderHome, useUploadAvatar, useUpdateProviderProfile } from '../../hooks/useProvider';
import { Loader2, Camera, User, Mail, Phone, MapPin, Navigation, Tag, ShieldCheck, Edit3, X, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const ALL_CATEGORIES = [
    "ITEMS",
    "VENUE",
    "RIDES",
    "PROPERTY",
    "SERVICE",
    "EVENT",
    "OTHERS"
];

const Settings = () => {
    const { data: meData, isLoading: isLoadingMe } = useProviderMe();
    const { data: homeData, isLoading: isLoadingHome } = useProviderHome();
    const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProviderProfile();

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit profile state
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
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your provider profile, preferences, and details.</p>
                </div>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-accent hover:bg-accent/90 shadow-sm shadow-accent/20 transition-all cursor-pointer w-fit"
                >
                    <Edit3 className="w-4 h-4" />
                    Edit Details
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl">
                    {/* Left Column: Avatar & Quick Profile Card */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col items-center text-center justify-between">
                        <div className="flex flex-col items-center w-full">
                            {/* Circular Avatar Container */}
                            <div className="relative mb-4 mt-2">
                                <div 
                                    className="w-28 h-28 rounded-full ring-4 ring-accent/10 border-2 border-slate-200 bg-slate-100 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-accent transition-all group shadow-inner"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {currentAvatar ? (
                                        <img src={currentAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                                            <User className="w-12 h-12" />
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                        <Camera className="w-5 h-5 mb-1" />
                                        <span className="text-[10px] font-semibold">Change</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-md hover:bg-accent/90 transition-transform active:scale-95 border-2 border-white cursor-pointer"
                                    title="Upload photo"
                                >
                                    <Camera className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileSelect}
                            />

                            <h3 className="font-bold text-base text-slate-900">{displayName}</h3>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">
                                {provider?.username ? `@${provider.username}` : '@provider'}
                            </p>

                            <div className="mt-3 flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-accent/10 text-accent border border-accent/20">
                                    <Sparkles className="w-3 h-3" /> {provider?.role || 'PROVIDER'}
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 w-full pt-5 border-t border-slate-100">
                            {selectedFile ? (
                                <div className="space-y-2">
                                    <button
                                        onClick={handleUpload}
                                        disabled={isUploadingAvatar}
                                        className="w-full bg-accent text-white px-4 py-2.5 rounded-full text-xs font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shadow-accent/20"
                                    >
                                        {isUploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                        {isUploadingAvatar ? 'Saving Avatar...' : 'Save Avatar'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setAvatarPreview(null);
                                        }}
                                        className="w-full text-xs font-medium text-slate-500 hover:text-slate-700 py-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-full text-xs font-semibold transition-all border border-slate-200 cursor-pointer shadow-2xs"
                                >
                                    Choose New Photo
                                </button>
                            )}

                            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                                Recommended format: JPG, PNG, or WEBP. Max size: 5MB.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Provider Information Details */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 md:p-7 shadow-xs">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">Provider Details</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-2xl p-4 transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                                        <User className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Full Name
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 pl-9">
                                    {provider?.fullName || <span className="text-slate-400 font-normal italic">Not set</span>}
                                </p>
                            </div>

                            {/* Username */}
                            <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-2xl p-4 transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                                        @
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Username
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 pl-9">
                                    {provider?.username ? `@${provider.username}` : <span className="text-slate-400 font-normal italic">Not set</span>}
                                </p>
                            </div>

                            {/* Email Address */}
                            <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-2xl p-4 transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                                        <Mail className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Email Address
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 pl-9 truncate">
                                    {provider?.email || <span className="text-slate-400 font-normal italic">Not set</span>}
                                </p>
                            </div>

                            {/* Phone Number */}
                            <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-2xl p-4 transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                                        <Phone className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Phone Number
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 pl-9">
                                    {provider?.phone || <span className="text-slate-400 font-normal italic">Not set</span>}
                                </p>
                            </div>

                            {/* Location */}
                            <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-2xl p-4 transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                                        <MapPin className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Location
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 pl-9">
                                    {[provider?.city, provider?.state].filter(Boolean).join(', ') || <span className="text-slate-400 font-normal italic">Not set</span>}
                                </p>
                            </div>

                            {/* Service Radius */}
                            <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-2xl p-4 transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                                        <Navigation className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Service Radius
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 pl-9">
                                    {provider?.serviceRadius ? `${provider.serviceRadius} km` : <span className="text-slate-400 font-normal italic">Not set</span>}
                                </p>
                            </div>

                            {/* Service Categories */}
                            <div className="sm:col-span-2 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-2xl p-4 transition-colors">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                                        <Tag className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Service Categories
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-9">
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
                                        <p className="text-xs text-slate-400 italic">No categories selected</p>
                                    )}
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
                                <h2 className="text-lg font-bold text-slate-900">Edit Provider Details</h2>
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

export default Settings;

