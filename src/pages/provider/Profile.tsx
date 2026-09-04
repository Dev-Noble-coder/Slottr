import { useState, useRef } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderHome, useUploadAvatar } from '../../hooks/useProvider';
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
    CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { data: homeData, isLoading } = useProviderHome();
    const { mutateAsync: uploadAvatar, isPending } = useUploadAvatar();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const provider = homeData?.provider;
    const displayName = provider?.fullName || provider?.username || 'Provider';

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

    const currentAvatar = avatarPreview || provider?.avatarUrl;

    return (
        <ProviderLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Provider Profile</h1>
                    <p className="text-sm text-slate-500 mt-1">View and manage your provider credentials and service coverage.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/provider/settings"
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
                    {/* Header Banner Card (sharp borders, no shadow) */}
                    <div className="bg-white border border-slate-200 rounded-md p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="relative group">
                                    <div 
                                        className="w-20 h-20 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {currentAvatar ? (
                                            <img src={currentAvatar} alt={displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 text-slate-400" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
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
                                        <span className="text-xs px-2 py-0.5 rounded-sm font-medium bg-blue/10 text-blue border border-blue/20">
                                            {provider?.role || 'PROVIDER'}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">@{provider?.username}</p>
                                    
                                    {selectedFile && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <button
                                                onClick={handleUpload}
                                                disabled={isPending}
                                                className="bg-accent text-white px-3 py-1 rounded-sm text-xs font-medium hover:bg-opacity-90 flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                                                {isPending ? 'Saving...' : 'Confirm Upload'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setAvatarPreview(null);
                                                }}
                                                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
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
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
                                >
                                    <List className="w-3.5 h-3.5" /> Listings
                                </Link>
                                <Link
                                    to="/provider/bookings"
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
                                >
                                    <Calendar className="w-3.5 h-3.5" /> Bookings
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Details Grid (sharp borders, no shadow) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="bg-white border border-slate-200 rounded-md p-5 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-accent" />
                                Contact & Identification
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs font-medium text-slate-400 block mb-0.5">Full Name</span>
                                    <p className="text-sm font-medium text-slate-800">{provider?.fullName || 'Not provided'}</p>
                                </div>

                                <div>
                                    <span className="text-xs font-medium text-slate-400 block mb-0.5">Username</span>
                                    <p className="text-sm font-medium text-slate-800">@{provider?.username || 'Not provided'}</p>
                                </div>

                                <div>
                                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mb-0.5">
                                        <Mail className="w-3.5 h-3.5" /> Email Address
                                    </span>
                                    <p className="text-sm font-medium text-slate-800">{provider?.email || 'Not provided'}</p>
                                </div>

                                <div>
                                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mb-0.5">
                                        <Phone className="w-3.5 h-3.5" /> Phone Number
                                    </span>
                                    <p className="text-sm font-medium text-slate-800">{provider?.phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Location & Coverage */}
                        <div className="bg-white border border-slate-200 rounded-md p-5 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-accent" />
                                Service Location & Coverage
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mb-0.5">
                                        <MapPin className="w-3.5 h-3.5" /> City
                                    </span>
                                    <p className="text-sm font-medium text-slate-800">{provider?.city || 'Not provided'}</p>
                                </div>

                                <div>
                                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mb-0.5">
                                        <MapPin className="w-3.5 h-3.5" /> State
                                    </span>
                                    <p className="text-sm font-medium text-slate-800">{provider?.state || 'Not provided'}</p>
                                </div>

                                <div>
                                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mb-0.5">
                                        <Navigation className="w-3.5 h-3.5" /> Service Radius
                                    </span>
                                    <p className="text-sm font-medium text-slate-800">{provider?.serviceRadius ? `${provider.serviceRadius} km` : 'Not configured'}</p>
                                </div>

                                <div>
                                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mb-1.5">
                                        <Tag className="w-3.5 h-3.5" /> Service Categories
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {provider?.categories && provider.categories.length > 0 ? (
                                            provider.categories.map((cat: string) => (
                                                <span 
                                                    key={cat}
                                                    className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded-sm text-xs font-medium"
                                                >
                                                    {cat}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-xs text-slate-400">No categories assigned</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProviderLayout>
    );
};

export default Profile;
