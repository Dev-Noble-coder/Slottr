import { useState, useRef } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useListings, useCreateProviderListing } from '../../hooks/useListing';
import { Plus, Loader2, Image as ImageIcon, MapPin, List } from 'lucide-react';
import { toast } from 'sonner';
import Input from '../../components/ui/Input';

const PROVIDER_CATEGORIES = [
  "ITEMS",
  "VENUE",
  "RIDES",
  "PROPERTY",
  "SERVICE",
  "OTHERS"
];

const Dashboard = () => {
    const { data: listingsData, isLoading: isListingsLoading } = useListings();
    const { mutateAsync: createListing, isPending: isCreating } = useCreateProviderListing();
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [type, setType] = useState(PROVIDER_CATEGORIES[0]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter logic can be applied if API returns all instead of provider-specific.
    const listings = Array.isArray(listingsData?.data) ? listingsData.data : (Array.isArray(listingsData) ? listingsData : []);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setLocation('');
        setPrice('');
        setDate('');
        setCapacity('');
        setType(PROVIDER_CATEGORIES[0]);
        setImageFile(null);
    };

    const handleCreateListing = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !description || !location || !price || !date || !capacity || !type) {
            toast.error("Please fill in all fields.");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('price', price);
        formData.append('date', date);
        formData.append('capacity', capacity);
        formData.append('type', type);
        
        if (imageFile) {
            formData.append('images', imageFile);
        } else {
            toast.error("Please select an image.");
            return;
        }

        try {
            await createListing(formData);
            toast.success("Listing created successfully!");
            setIsCreateModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create listing.");
        }
    };

    return (
        <ProviderLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-blue">My Listings</h1>
                    <p className="text-slate-500 mt-1">Manage your services and products</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-accent text-white px-5 py-2.5 rounded-full font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Listing</span>
                </button>
            </div>

            {isListingsLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {listings.map((listing: any) => (
                        <div key={listing.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 bg-slate-100 relative">
                                {listing.images && listing.images.length > 0 ? (
                                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-blue shadow-sm">
                                    {listing.category || listing.type}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-blue mb-2 truncate">{listing.title}</h3>
                                <div className="flex items-center text-slate-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span className="truncate">{listing.location}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                    <span className="font-semibold text-blue">${listing.price}</span>
                                    <span className="text-xs text-slate-400 font-medium">Capacity: {listing.capacity}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <List className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-blue mb-2">No listings yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">You haven't created any listings. Add your first product or service to start receiving bookings.</p>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-button-dark text-white px-6 py-2.5 rounded-full font-medium inline-flex items-center gap-2 hover:bg-button-dark-hover transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create your first listing
                    </button>
                </div>
            )}

            {/* Create Listing Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl my-auto">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                            <h2 className="text-xl font-bold text-blue">Create New Listing</h2>
                            <button 
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <form id="create-listing-form" onSubmit={handleCreateListing} className="space-y-5">
                                <Input 
                                    label="Title" 
                                    type="text" 
                                    placeholder="e.g. BALL UP 5.0" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-medium text-slate-700">Description</label>
                                    <textarea 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[100px] resize-y"
                                        placeholder="e.g. Basketball event"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input 
                                        label="Location" 
                                        type="text" 
                                        placeholder="e.g. Lagos, Nigeria" 
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                    <Input 
                                        label="Price" 
                                        type="number" 
                                        placeholder="e.g. 2000" 
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input 
                                        label="Date" 
                                        type="date" 
                                        placeholder="" 
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                    <Input 
                                        label="Capacity" 
                                        type="number" 
                                        placeholder="e.g. 100" 
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[14px] font-medium text-slate-700">Type / Category</label>
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                        >
                                            {PROVIDER_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[14px] font-medium text-slate-700">Image</label>
                                        <div 
                                            className="w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all h-[52px]"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {imageFile ? (
                                                <span className="text-sm font-medium text-accent truncate">{imageFile.name}</span>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <ImageIcon className="w-5 h-5" />
                                                    <span className="text-sm font-medium">Click to upload</span>
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setImageFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl z-10">
                            <button 
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-5 py-2.5 rounded-full font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                form="create-listing-form"
                                disabled={isCreating}
                                className="px-6 py-2.5 rounded-full font-medium text-white bg-blue hover:bg-button-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : 'Create Listing'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProviderLayout>
    );
};

export default Dashboard;
