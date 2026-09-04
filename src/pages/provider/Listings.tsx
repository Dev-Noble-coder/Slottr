import { useState, useRef } from 'react';
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { 
    useMyListings, 
    useCreateProviderListing, 
    useUpdateProviderListing,
    usePublishProviderListing, 
    usePauseProviderListing, 
    useDeleteProviderListing 
} from '../../hooks/useListing';
import { 
    Plus, 
    Loader2, 
    Image as ImageIcon, 
    MapPin, 
    List, 
    Clock, 
    Trash2, 
    Play, 
    Pause, 
    X,
    Upload,
    Edit3
} from 'lucide-react';
import { toast } from 'sonner';
import Input from '../../components/ui/Input';
import { AvailabilityModal } from './components/AvailabilityModal';
import type { ListingType, PricingUnit } from '../../types/listing';

const LISTING_TYPES: ListingType[] = [
    "ITEMS",
    "VENUE",
    "RIDES",
    "PROPERTY",
    "SERVICE",
    "EVENT",
    "OTHERS",
];

const PRICING_UNITS: PricingUnit[] = [
    "HOUR",
    "DAY",
    "WEEK",
    "MONTH"
];

const Listings = () => {
    const { data: listingsData, isLoading: isListingsLoading } = useMyListings();
    const { mutateAsync: createListing, isPending: isCreating } = useCreateProviderListing();
    const { mutateAsync: updateListing, isPending: isUpdating } = useUpdateProviderListing();
    const { mutateAsync: publishListing, isPending: isPublishing } = usePublishProviderListing();
    const { mutateAsync: pauseListing, isPending: isPausing } = usePauseProviderListing();
    const { mutateAsync: deleteListing } = useDeleteProviderListing();
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingListing, setEditingListing] = useState<any | null>(null);
    const [selectedListingForAvailability, setSelectedListingForAvailability] = useState<any | null>(null);
    const [actionListingId, setActionListingId] = useState<string | number | null>(null);
    
    // Create form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [stateVal, setStateVal] = useState('');
    const [country, setCountry] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [type, setType] = useState<ListingType>(LISTING_TYPES[0]);
    const [pricingUnit, setPricingUnit] = useState<PricingUnit>(PRICING_UNITS[0]);
    const [minDuration, setMinDuration] = useState('');
    const [maxDuration, setMaxDuration] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit form state
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStreetAddress, setEditStreetAddress] = useState('');
    const [editStateVal, setEditStateVal] = useState('');
    const [editCountry, setEditCountry] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editCapacity, setEditCapacity] = useState('');
    const [editType, setEditType] = useState<ListingType>(LISTING_TYPES[0]);
    const [editPricingUnit, setEditPricingUnit] = useState<PricingUnit>(PRICING_UNITS[0]);
    const [editMinDuration, setEditMinDuration] = useState('');
    const [editMaxDuration, setEditMaxDuration] = useState('');
    const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const listings = Array.isArray(listingsData?.data) ? listingsData.data : (Array.isArray(listingsData) ? listingsData : []);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStreetAddress('');
        setStateVal('');
        setCountry('');
        setPrice('');
        setDate('');
        setCapacity('');
        setType(LISTING_TYPES[0]);
        setPricingUnit(PRICING_UNITS[0]);
        setMinDuration('');
        setMaxDuration('');
        setImageFiles([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 5);
            setImageFiles(filesArray);
        }
    };

    const handleCreateListing = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast.error("Title is required.");
            return;
        }

        if (description.trim().length < 10) {
            toast.error("Description must be at least 10 characters.");
            return;
        }

        if (!price || isNaN(Number(price))) {
            toast.error("Please enter a valid numeric price.");
            return;
        }

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('price', price.toString());
        formData.append('type', type);
        formData.append('pricingUnit', pricingUnit);

        const locationStr = [streetAddress.trim(), stateVal.trim(), country.trim()].filter(Boolean).join(', ');
        if (locationStr) formData.append('location', locationStr);
        if (streetAddress.trim()) formData.append('streetAddress', streetAddress.trim());
        if (stateVal.trim()) formData.append('state', stateVal.trim());
        if (country.trim()) formData.append('country', country.trim());
        if (date) formData.append('date', date);
        if (capacity) formData.append('capacity', capacity);
        if (minDuration) formData.append('minDuration', minDuration);
        if (maxDuration) formData.append('maxDuration', maxDuration);
        
        // Attach multiple files under 'images' key
        imageFiles.forEach((file) => {
            formData.append('images', file);
        });

        try {
            await createListing(formData);
            toast.success("Listing created as draft. You can now configure availability and publish it!");
            setIsCreateModalOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create listing.");
        }
    };

    const handleOpenEditModal = (listing: any) => {
        setEditingListing(listing);
        setEditTitle(listing.title || '');
        setEditDescription(listing.description || '');
        setEditStreetAddress(listing.streetAddress || '');
        setEditStateVal(listing.state || '');
        setEditCountry(listing.country || '');
        setEditPrice(listing.price ? String(listing.price) : '');
        setEditDate(listing.date ? String(listing.date).split('T')[0] : '');
        setEditCapacity(listing.capacity ? String(listing.capacity) : '');
        setEditType(listing.type || LISTING_TYPES[0]);
        setEditPricingUnit(listing.pricingUnit || PRICING_UNITS[0]);
        setEditMinDuration(listing.minDuration ? String(listing.minDuration) : '');
        setEditMaxDuration(listing.maxDuration ? String(listing.maxDuration) : '');
        setEditImageFiles([]);
    };

    const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 5);
            setEditImageFiles(filesArray);
        }
    };

    const handleUpdateListing = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingListing) return;

        if (!editTitle.trim()) {
            toast.error("Title is required.");
            return;
        }

        if (editDescription.trim().length < 10) {
            toast.error("Description must be at least 10 characters.");
            return;
        }

        if (!editPrice || isNaN(Number(editPrice))) {
            toast.error("Please enter a valid numeric price.");
            return;
        }

        try {
            if (editImageFiles.length > 0) {
                const formData = new FormData();
                formData.append('title', editTitle.trim());
                formData.append('description', editDescription.trim());
                formData.append('price', editPrice.toString());
                formData.append('type', editType);
                formData.append('pricingUnit', editPricingUnit);

                const locationStr = [editStreetAddress.trim(), editStateVal.trim(), editCountry.trim()].filter(Boolean).join(', ');
                if (locationStr) formData.append('location', locationStr);
                if (editStreetAddress.trim()) formData.append('streetAddress', editStreetAddress.trim());
                if (editStateVal.trim()) formData.append('state', editStateVal.trim());
                if (editCountry.trim()) formData.append('country', editCountry.trim());
                if (editDate) formData.append('date', editDate);
                if (editCapacity) formData.append('capacity', editCapacity);
                if (editMinDuration) formData.append('minDuration', editMinDuration);
                if (editMaxDuration) formData.append('maxDuration', editMaxDuration);

                editImageFiles.forEach((file) => {
                    formData.append('images', file);
                });

                await updateListing({ id: editingListing.id, data: formData });
            } else {
                const locationStr = [editStreetAddress.trim(), editStateVal.trim(), editCountry.trim()].filter(Boolean).join(', ');
                const payload: any = {
                    title: editTitle.trim(),
                    description: editDescription.trim(),
                    price: Number(editPrice),
                    type: editType,
                    pricingUnit: editPricingUnit,
                    streetAddress: editStreetAddress.trim() || undefined,
                    state: editStateVal.trim() || undefined,
                    country: editCountry.trim() || undefined,
                    location: locationStr || undefined,
                    date: editDate || undefined,
                    capacity: editCapacity ? Number(editCapacity) : undefined,
                    minDuration: editMinDuration ? Number(editMinDuration) : undefined,
                    maxDuration: editMaxDuration ? Number(editMaxDuration) : undefined,
                };
                await updateListing({ id: editingListing.id, data: payload });
            }

            toast.success("Listing updated successfully!");
            setEditingListing(null);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update listing.");
        }
    };

    const handlePublish = async (id: string | number) => {
        try {
            setActionListingId(id);
            await publishListing(id);
            toast.success("Listing published and live to customers!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to publish listing.");
        } finally {
            setActionListingId(null);
        }
    };

    const handlePause = async (id: string | number) => {
        try {
            setActionListingId(id);
            await pauseListing(id);
            toast.success("Listing paused.");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to pause listing.");
        } finally {
            setActionListingId(null);
        }
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;

        try {
            setActionListingId(id);
            await deleteListing(id);
            toast.success("Listing deleted.");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete listing.");
        } finally {
            setActionListingId(null);
        }
    };

    return (
        <ProviderLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Listings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your services, products, availability, and lifecycle states.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-button-dark transition-colors self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Listing</span>
                </button>
            </div>

            {isListingsLoading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {listings.map((listing: any) => {
                        const status = (listing.status || 'draft').toLowerCase();
                        const isPublished = status === 'published';
                        const isDraft = status === 'draft';
                        const isPaused = status === 'paused';
                        const isActing = actionListingId === listing.id;

                        return (
                            <div key={listing.id} className="bg-white rounded-md border border-slate-200 overflow-hidden flex flex-col justify-between">
                                <div>
                                    {/* Image Container */}
                                    <div className="h-44 bg-slate-100 relative border-b border-slate-200">
                                        {listing.images && listing.images.length > 0 ? (
                                            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <ImageIcon className="w-8 h-8 opacity-40" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-2.5 right-2.5">
                                            {isDraft && (
                                                <span className="bg-amber-100/90 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider">
                                                    Draft
                                                </span>
                                            )}
                                            {isPublished && (
                                                <span className="bg-emerald-100/90 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider">
                                                    Published
                                                </span>
                                            )}
                                            {isPaused && (
                                                <span className="bg-slate-200/90 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider">
                                                    Paused
                                                </span>
                                            )}
                                        </div>

                                        {/* Type / Category Tag */}
                                        <div className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white px-2 py-0.5 rounded-sm text-[11px] font-medium tracking-wide">
                                            {listing.type || listing.category || 'ITEM'}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <h3 className="font-bold text-base text-slate-900 truncate" title={listing.title}>
                                                {listing.title}
                                            </h3>
                                        </div>

                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                                            {listing.description || 'No description provided.'}
                                        </p>

                                        <div className="flex items-center text-slate-500 text-xs mb-3">
                                            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-slate-400" />
                                            <span className="truncate">
                                                {[listing.streetAddress, listing.state, listing.country].filter(Boolean).join(', ') || listing.location || 'Location not specified'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                                            <span className="font-bold text-sm text-slate-900">
                                                ${listing.price} <span className="text-slate-400 font-normal text-xs">/ {listing.pricingUnit || 'slot'}</span>
                                            </span>
                                            {listing.capacity && (
                                                <span className="text-slate-500">Cap: {listing.capacity}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Bar */}
                                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => setSelectedListingForAvailability(listing)}
                                        className="text-xs font-semibold text-slate-700 hover:text-blue bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-sm transition-colors flex items-center gap-1.5"
                                        title="Configure Availability Schedule"
                                    >
                                        <Clock className="w-3.5 h-3.5 text-accent" />
                                        Availability
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                        {/* Publish / Pause action */}
                                        {(isDraft || isPaused) && (
                                            <button
                                                onClick={() => handlePublish(listing.id)}
                                                disabled={isActing && isPublishing}
                                                className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                                            >
                                                {isActing && isPublishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                                                Publish
                                            </button>
                                        )}

                                        {isPublished && (
                                            <button
                                                onClick={() => handlePause(listing.id)}
                                                disabled={isActing && isPausing}
                                                className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                                            >
                                                {isActing && isPausing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pause className="w-3 h-3" />}
                                                Pause
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleOpenEditModal(listing)}
                                            className="text-slate-400 hover:text-blue p-1 rounded transition-colors"
                                            title="Edit Listing Details"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(listing.id)}
                                            className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                                            title="Delete Listing"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-md border border-slate-200 p-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center mx-auto mb-3">
                        <List className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No listings yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">Create your first product, service, or space to start managing availability and receiving bookings.</p>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue hover:bg-button-dark text-white px-4 py-2 rounded-md font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Listing
                    </button>
                </div>
            )}

            {/* Create Listing Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-300 rounded-md w-full max-w-2xl max-h-[90vh] flex flex-col my-auto">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Create New Listing</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Listings start as drafts until you publish them.</p>
                            </div>
                            <button 
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto space-y-4">
                            <form id="create-listing-form" onSubmit={handleCreateListing} className="space-y-4">
                                <Input 
                                    label="Listing Title *" 
                                    type="text" 
                                    placeholder="e.g. Sony FX3 Cinema Camera or Conference Room A" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Description * (min 10 characters)</label>
                                    <textarea 
                                        className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs outline-none focus:border-accent min-h-[80px]"
                                        placeholder="Detailed description of what is included, features, rules..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Listing Type *</label>
                                        <select 
                                            value={type} 
                                            onChange={(e) => setType(e.target.value as ListingType)}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs outline-none focus:border-accent"
                                        >
                                            {LISTING_TYPES.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Pricing Unit</label>
                                        <select 
                                            value={pricingUnit} 
                                            onChange={(e) => setPricingUnit(e.target.value as PricingUnit)}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs outline-none focus:border-accent"
                                        >
                                            {PRICING_UNITS.map(u => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input 
                                        label="Price *" 
                                        type="number" 
                                        placeholder="e.g. 25000" 
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                    <Input 
                                        label="Capacity (Optional)" 
                                        type="number" 
                                        placeholder="e.g. 1" 
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                    />
                                    <Input 
                                        label="Date (Single-date events only)" 
                                        type="date" 
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input 
                                        label="Min Duration" 
                                        type="number" 
                                        placeholder="e.g. 1" 
                                        value={minDuration}
                                        onChange={(e) => setMinDuration(e.target.value)}
                                    />
                                    <Input 
                                        label="Max Duration" 
                                        type="number" 
                                        placeholder="e.g. 24" 
                                        value={maxDuration}
                                        onChange={(e) => setMaxDuration(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input 
                                        label="Street Address" 
                                        type="text" 
                                        placeholder="e.g. 12 Admiralty Way" 
                                        value={streetAddress}
                                        onChange={(e) => setStreetAddress(e.target.value)}
                                    />
                                    <Input 
                                        label="State" 
                                        type="text" 
                                        placeholder="e.g. Lagos" 
                                        value={stateVal}
                                        onChange={(e) => setStateVal(e.target.value)}
                                    />
                                    <Input 
                                        label="Country" 
                                        type="text" 
                                        placeholder="e.g. Nigeria" 
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    />
                                </div>

                                {/* Images Upload */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Images (Max 5 files)</label>
                                    <div 
                                        className="border-2 border-dashed border-slate-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-slate-50 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                                        <span className="text-xs font-medium text-slate-600">
                                            {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Click to select image files'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP up to 5MB each</span>
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        multiple 
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2.5">
                            <button 
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                form="create-listing-form"
                                disabled={isCreating}
                                className="px-5 py-2 rounded-md text-xs font-semibold text-white bg-blue hover:bg-button-dark transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Creating...
                                    </>
                                ) : 'Create Draft Listing'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Listing Modal (PATCH /api/provider/listings/:id) */}
            {editingListing && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-300 rounded-md w-full max-w-2xl max-h-[90vh] flex flex-col my-auto">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Edit Listing</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Update details, pricing, or photos for this listing.</p>
                            </div>
                            <button 
                                onClick={() => setEditingListing(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto space-y-4">
                            <form id="edit-listing-form" onSubmit={handleUpdateListing} className="space-y-4">
                                <Input 
                                    label="Listing Title *" 
                                    type="text" 
                                    placeholder="e.g. Sony FX3 Cinema Camera" 
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    required
                                />
                                
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Description * (min 10 characters)</label>
                                    <textarea 
                                        className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs outline-none focus:border-accent min-h-[80px]"
                                        placeholder="Detailed description..."
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Listing Type *</label>
                                        <select 
                                            value={editType} 
                                            onChange={(e) => setEditType(e.target.value as ListingType)}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs outline-none focus:border-accent"
                                        >
                                            {LISTING_TYPES.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Pricing Unit</label>
                                        <select 
                                            value={editPricingUnit} 
                                            onChange={(e) => setEditPricingUnit(e.target.value as PricingUnit)}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs outline-none focus:border-accent"
                                        >
                                            {PRICING_UNITS.map(u => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input 
                                        label="Price *" 
                                        type="number" 
                                        placeholder="e.g. 25000" 
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        required
                                    />
                                    <Input 
                                        label="Capacity (Optional)" 
                                        type="number" 
                                        placeholder="e.g. 1" 
                                        value={editCapacity}
                                        onChange={(e) => setEditCapacity(e.target.value)}
                                    />
                                    <Input 
                                        label="Date (Single-date events only)" 
                                        type="date" 
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input 
                                        label="Min Duration" 
                                        type="number" 
                                        placeholder="e.g. 1" 
                                        value={editMinDuration}
                                        onChange={(e) => setEditMinDuration(e.target.value)}
                                    />
                                    <Input 
                                        label="Max Duration" 
                                        type="number" 
                                        placeholder="e.g. 24" 
                                        value={editMaxDuration}
                                        onChange={(e) => setEditMaxDuration(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input 
                                        label="Street Address" 
                                        type="text" 
                                        placeholder="123 Main St" 
                                        value={editStreetAddress}
                                        onChange={(e) => setEditStreetAddress(e.target.value)}
                                    />
                                    <Input 
                                        label="State / Province" 
                                        type="text" 
                                        placeholder="California" 
                                        value={editStateVal}
                                        onChange={(e) => setEditStateVal(e.target.value)}
                                    />
                                    <Input 
                                        label="Country" 
                                        type="text" 
                                        placeholder="USA" 
                                        value={editCountry}
                                        onChange={(e) => setEditCountry(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Update Images (Optional)</label>
                                    <div 
                                        onClick={() => editFileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 rounded-md p-5 flex flex-col items-center justify-center cursor-pointer transition-colors"
                                    >
                                        <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                                        <p className="text-xs font-medium text-slate-700">Click to upload new photos</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5 images</p>
                                        {editImageFiles.length > 0 && (
                                            <span className="mt-2 text-xs font-bold text-accent">
                                                {editImageFiles.length} new image(s) selected
                                            </span>
                                        )}
                                    </div>
                                    <input 
                                        ref={editFileInputRef}
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        multiple 
                                        onChange={handleEditFileChange}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2.5">
                            <button 
                                type="button"
                                onClick={() => setEditingListing(null)}
                                className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                form="edit-listing-form"
                                disabled={isUpdating}
                                className="px-5 py-2 rounded-md text-xs font-semibold text-white bg-blue hover:bg-button-dark transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Saving...
                                    </>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Availability Engine Modal */}
            {selectedListingForAvailability && (
                <AvailabilityModal 
                    listingId={selectedListingForAvailability.id}
                    listingTitle={selectedListingForAvailability.title}
                    onClose={() => setSelectedListingForAvailability(null)}
                />
            )}
        </ProviderLayout>
    );
};

export default Listings;
