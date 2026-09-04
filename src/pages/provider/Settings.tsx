import { useState, useRef } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderHome, useUploadAvatar } from '../../hooks/useProvider';
import { Loader2, Camera, User, Mail, Phone, MapPin, Navigation, Tag, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
    const { data: homeData, isLoading } = useProviderHome();
    const { mutateAsync: uploadAvatar, isPending } = useUploadAvatar();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const provider = homeData?.provider;

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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your provider profile, preferences, and details.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
                    {/* Avatar Card (sharp borders, no shadow) */}
                    <div className="bg-white rounded-md border border-slate-200 p-6 flex flex-col items-center text-center">
                        <div 
                            className="w-28 h-28 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-accent transition-colors group mb-3"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {currentAvatar ? (
                                <img src={currentAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-slate-400" />
                            )}
                            
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                <Camera className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-medium">Change Photo</span>
                            </div>
                        </div>

                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileSelect}
                        />

                        <h3 className="font-bold text-base text-slate-900">{provider?.fullName || provider?.username}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">@{provider?.username}</p>

                        <div className="mt-4 w-full">
                            {selectedFile ? (
                                <button
                                    onClick={handleUpload}
                                    disabled={isPending}
                                    className="w-full bg-accent text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                                >
                                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                    {isPending ? 'Uploading...' : 'Save Avatar'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-xs font-medium transition-colors border border-slate-200"
                                >
                                    Choose New Photo
                                </button>
                            )}
                        </div>

                        <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                            Recommended format: JPG, PNG, or WEBP. Max size: 5MB.
                        </p>
                    </div>

                    {/* Profile Information Details (sharp borders, no shadow) */}
                    <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-accent" />
                            Provider Details
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                                    Full Name
                                </span>
                                <p className="text-sm font-medium text-slate-900">
                                    {provider?.fullName || 'Not set'}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                                    Username
                                </span>
                                <p className="text-sm font-medium text-slate-900">
                                    @{provider?.username || 'Not set'}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    Email Address
                                </span>
                                <p className="text-sm font-medium text-slate-900 truncate">
                                    {provider?.email || 'Not set'}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    Phone Number
                                </span>
                                <p className="text-sm font-medium text-slate-900">
                                    {provider?.phone || 'Not set'}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    Location
                                </span>
                                <p className="text-sm font-medium text-slate-900">
                                    {[provider?.city, provider?.state].filter(Boolean).join(', ') || 'Not set'}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                                    <Navigation className="w-3.5 h-3.5 text-slate-400" />
                                    Service Radius
                                </span>
                                <p className="text-sm font-medium text-slate-900">
                                    {provider?.serviceRadius ? `${provider.serviceRadius} km` : 'Not set'}
                                </p>
                            </div>

                            <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-md border border-slate-200">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                                    Service Categories
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {provider?.categories && provider.categories.length > 0 ? (
                                        provider.categories.map((cat: string) => (
                                            <span 
                                                key={cat} 
                                                className="px-2.5 py-0.5 bg-white border border-slate-300 text-slate-800 rounded-sm text-xs font-semibold"
                                            >
                                                {cat}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400">No categories selected</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProviderLayout>
    );
};

export default Settings;
