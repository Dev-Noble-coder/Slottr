import { useState, useRef } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useUploadAvatar } from '../../hooks/useProvider.ts';
import { Loader2, Camera, User } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
    const { mutateAsync: uploadAvatar, isPending } = useUploadAvatar();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            toast.success("Avatar uploaded successfully.");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to upload avatar.");
        }
    };

    return (
        <ProviderLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-blue">Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your profile and preferences</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-2xl">
                <h3 className="text-lg font-bold text-blue mb-6 border-b border-slate-100 pb-4">Profile Information</h3>
                
                <div className="flex items-start gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div 
                            className="w-32 h-32 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-accent transition-colors group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-slate-400" />
                            )}
                            
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                        
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || isPending}
                            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isPending ? 'Uploading...' : 'Save Avatar'}
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Upload a professional avatar</p>
                            <p className="text-xs text-slate-400">This helps customers recognize you and builds trust. Recommended size: 256x256px.</p>
                        </div>
                        
                        {/* More settings can be added here later */}
                    </div>
                </div>
            </div>
        </ProviderLayout>
    );
};

export default Settings;
