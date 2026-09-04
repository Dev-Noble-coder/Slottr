import { useState, useEffect } from 'react';
import { 
    X, 
    Calendar, 
    Clock, 
    Plus, 
    Trash2, 
    Loader2, 
    AlertCircle, 
    Check, 
    Ban, 
    Sparkles 
} from 'lucide-react';
import { 
    useListingAvailability, 
    useUpdateListingSchedule, 
    useAddAvailabilityBlock, 
    useDeleteAvailabilityBlock, 
    useAddAvailabilityException, 
    useDeleteAvailabilityException 
} from '../../../hooks/useListing';
import type { WeeklySchedule, TimeSlot, AvailabilityBlock, AvailabilityException } from '../../../types/listing';
import { toast } from 'sonner';

interface AvailabilityModalProps {
    listingId: string | number;
    listingTitle: string;
    onClose: () => void;
}

const DAYS_OF_WEEK: Array<keyof WeeklySchedule> = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
];

const DEFAULT_SCHEDULE: WeeklySchedule = {
    monday: [{ start: '09:00', end: '17:00' }],
    tuesday: [{ start: '09:00', end: '17:00' }],
    wednesday: [{ start: '09:00', end: '17:00' }],
    thursday: [{ start: '09:00', end: '17:00' }],
    friday: [{ start: '09:00', end: '17:00' }],
    saturday: [],
    sunday: []
};

const parseSchedule = (data: any): WeeklySchedule => {
    const parsed: WeeklySchedule = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    };

    if (!data) return parsed;

    const rawSchedule = data.schedule ?? data.data?.schedule ?? data;

    // Format 1: Array of items e.g. [{ dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00" }]
    if (Array.isArray(rawSchedule)) {
        rawSchedule.forEach((item: any) => {
            const rawDay = (item.dayOfWeek || item.day || '').toLowerCase();
            const dayKey = rawDay as keyof WeeklySchedule;
            const start = item.startTime || item.start || '09:00';
            const end = item.endTime || item.end || '17:00';
            if (dayKey in parsed) {
                parsed[dayKey].push({ start, end });
            }
        });
        return parsed;
    }

    // Format 2: Object with keys monday, tuesday, etc.
    if (typeof rawSchedule === 'object') {
        (Object.keys(parsed) as Array<keyof WeeklySchedule>).forEach(day => {
            const daySlots = rawSchedule[day] || rawSchedule[day.toUpperCase()];
            if (Array.isArray(daySlots)) {
                parsed[day] = daySlots.map((s: any) => ({
                    start: s.startTime || s.start || '09:00',
                    end: s.endTime || s.end || '17:00'
                }));
            }
        });
        return parsed;
    }

    return parsed;
};

export const AvailabilityModal = ({ listingId, listingTitle, onClose }: AvailabilityModalProps) => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'blocks' | 'exceptions'>('schedule');

    const { data: availabilityData, isLoading } = useListingAvailability(listingId);
    const { mutateAsync: updateSchedule, isPending: isUpdatingSchedule } = useUpdateListingSchedule(listingId);
    const { mutateAsync: addBlock, isPending: isAddingBlock } = useAddAvailabilityBlock(listingId);
    const { mutateAsync: deleteBlock } = useDeleteAvailabilityBlock(listingId);
    const { mutateAsync: addException, isPending: isAddingException } = useAddAvailabilityException(listingId);
    const { mutateAsync: deleteException } = useDeleteAvailabilityException(listingId);

    // Schedule state
    const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);

    // Block Form State
    const [blockStart, setBlockStart] = useState('');
    const [blockEnd, setBlockEnd] = useState('');
    const [blockReason, setBlockReason] = useState('');

    // Exception Form State
    const [exceptionDate, setExceptionDate] = useState('');
    const [exceptionPeriods, setExceptionPeriods] = useState<TimeSlot[]>([{ start: '09:00', end: '17:00' }]);

    // Sync remote availability schedule whenever data arrives
    useEffect(() => {
        if (availabilityData) {
            setSchedule(parseSchedule(availabilityData));
        }
    }, [availabilityData]);

    // Schedule Helpers
    const handleAddSlot = (day: keyof WeeklySchedule) => {
        setSchedule(prev => ({
            ...prev,
            [day]: [...prev[day], { start: '09:00', end: '17:00' }]
        }));
    };

    const handleRemoveSlot = (day: keyof WeeklySchedule, index: number) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }));
    };

    const handleSlotChange = (day: keyof WeeklySchedule, index: number, field: 'start' | 'end', value: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].map((slot, i) => i === index ? { ...slot, [field]: value } : slot)
        }));
    };

    const handleSaveSchedule = async () => {
        try {
            await updateSchedule(schedule);
            toast.success("Weekly availability schedule saved successfully.");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update schedule.");
        }
    };

    // Block Helpers
    const handleAddBlockSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blockStart || !blockEnd) {
            toast.error("Please enter both start and end dates/times.");
            return;
        }

        try {
            await addBlock({
                start: blockStart,
                end: blockEnd,
                reason: blockReason || undefined
            });
            toast.success("Availability block added.");
            setBlockStart('');
            setBlockEnd('');
            setBlockReason('');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to add block.");
        }
    };

    // Exception Helpers
    const handleAddExceptionSlot = () => {
        setExceptionPeriods(prev => [...prev, { start: '09:00', end: '17:00' }]);
    };

    const handleRemoveExceptionSlot = (index: number) => {
        setExceptionPeriods(prev => prev.filter((_, i) => i !== index));
    };

    const handleExceptionSlotChange = (index: number, field: 'start' | 'end', value: string) => {
        setExceptionPeriods(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
    };

    const handleAddExceptionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!exceptionDate) {
            toast.error("Please select a date for the override.");
            return;
        }

        try {
            await addException({
                date: exceptionDate,
                periods: exceptionPeriods
            });
            toast.success("Special date override added.");
            setExceptionDate('');
            setExceptionPeriods([{ start: '09:00', end: '17:00' }]);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to add override.");
        }
    };

    const handleDeleteBlock = async (blockId: string | number) => {
        try {
            await deleteBlock(blockId);
            toast.success("Block removed.");
        } catch (error: any) {
            try {
                await deleteException(blockId);
                toast.success("Block removed.");
            } catch (err: any) {
                toast.error(error?.response?.data?.message || err?.response?.data?.message || "Failed to remove block.");
            }
        }
    };

    const handleDeleteException = async (exceptionId: string | number) => {
        try {
            await deleteException(exceptionId);
            toast.success("Date override removed.");
        } catch (error: any) {
            try {
                await deleteBlock(exceptionId);
                toast.success("Date override removed.");
            } catch (err: any) {
                toast.error(error?.response?.data?.message || err?.response?.data?.message || "Failed to remove override.");
            }
        }
    };

    const rawBlocks = availabilityData?.blocks ?? availabilityData?.data?.blocks ?? [];
    const rawExceptions = availabilityData?.exceptions ?? availabilityData?.data?.exceptions ?? [];

    const allExceptionItems: any[] = Array.isArray(rawExceptions) ? rawExceptions : [];
    const directBlocks: any[] = Array.isArray(rawBlocks) ? rawBlocks : [];

    // Blocks: direct blocks + items from exceptions list marked with type "BLOCK" or having a reason/dates without periods
    const blocks: AvailabilityBlock[] = [
        ...directBlocks,
        ...allExceptionItems.filter((item: any) => item.type === 'BLOCK' || (item.reason && !item.periods && !item.date))
    ].map((b: any) => ({
        id: b.id,
        listingId: b.listingId,
        type: b.type || 'BLOCK',
        start: b.start || b.startDateTime || b.startDate || '',
        end: b.end || b.endDateTime || b.endDate || '',
        startDateTime: b.startDateTime,
        endDateTime: b.endDateTime,
        reason: b.reason,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
    }));

    // Date Overrides: items from exceptions list that are NOT blocks
    const exceptions: AvailabilityException[] = allExceptionItems
        .filter((exc: any) => exc.type !== 'BLOCK' && !(exc.reason && !exc.periods && !exc.date))
        .map((exc: any) => {
            const rawDate = exc.date || (exc.startDateTime ? exc.startDateTime.split('T')[0] : '') || (exc.startDate ? exc.startDate.split('T')[0] : '');
            const date = typeof rawDate === 'string' ? rawDate.split('T')[0] : '';
            
            let periods: TimeSlot[] = [];
            if (Array.isArray(exc.periods) && exc.periods.length > 0) {
                periods = exc.periods.map((p: any) => ({
                    start: p.startTime || p.start || '09:00',
                    end: p.endTime || p.end || '17:00'
                }));
            } else if (exc.startTime && exc.endTime) {
                periods = [{ start: exc.startTime, end: exc.endTime }];
            } else if (exc.startDateTime && exc.endDateTime) {
                const start = exc.startDateTime.includes('T') ? exc.startDateTime.split('T')[1].substring(0, 5) : exc.startDateTime;
                const end = exc.endDateTime.includes('T') ? exc.endDateTime.split('T')[1].substring(0, 5) : exc.endDateTime;
                periods = [{ start, end }];
            }

            return {
                id: exc.id,
                listingId: exc.listingId,
                type: exc.type,
                date,
                periods,
                startDateTime: exc.startDateTime,
                endDateTime: exc.endDateTime,
                reason: exc.reason,
                createdAt: exc.createdAt,
                updatedAt: exc.updatedAt
            };
        });

    const formatBlockDateTime = (val: string) => {
        if (!val) return '';
        const d = new Date(val);
        return isNaN(d.getTime()) ? val : d.toLocaleString(undefined, { 
            year: 'numeric',
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDateOverride = (dateStr: string) => {
        if (!dateStr) return 'Date not specified';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
            }
        }
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-300 rounded-md w-full max-w-3xl max-h-[90vh] flex flex-col my-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-accent" />
                            <h2 className="text-lg font-bold text-slate-900">Availability Engine</h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                            Configure schedules, blocks, and overrides for: <span className="font-semibold text-slate-800">{listingTitle}</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs Bar */}
                <div className="flex border-b border-slate-200 bg-slate-50 px-6">
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                            activeTab === 'schedule' 
                                ? 'border-accent text-accent bg-white' 
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" /> Weekly Schedule
                    </button>
                    <button
                        onClick={() => setActiveTab('blocks')}
                        className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                            activeTab === 'blocks' 
                                ? 'border-accent text-accent bg-white' 
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <Ban className="w-3.5 h-3.5" /> Blocked Times ({blocks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('exceptions')}
                        className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                            activeTab === 'exceptions' 
                                ? 'border-accent text-accent bg-white' 
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5" /> Date Overrides ({exceptions.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                        </div>
                    ) : (
                        <>
                            {/* TAB 1: WEEKLY SCHEDULE */}
                            {activeTab === 'schedule' && (
                                <div className="space-y-4">
                                    <div className="bg-blue/5 border border-blue/20 rounded-md p-3 text-xs text-blue flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>
                                            Configure recurring weekly opening hours. Days with no time slots are marked as closed.
                                        </span>
                                    </div>

                                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-md">
                                        {DAYS_OF_WEEK.map(day => {
                                            const slots = schedule[day] || [];
                                            const isOpen = slots.length > 0;

                                            return (
                                                <div key={day} className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
                                                    <div className="w-28 flex items-center gap-2">
                                                        <span className="text-sm font-semibold capitalize text-slate-800">{day}</span>
                                                    </div>

                                                    <div className="flex-1 flex flex-col gap-2">
                                                        {isOpen ? (
                                                            slots.map((slot, idx) => (
                                                                <div key={idx} className="flex items-center gap-2">
                                                                    <input 
                                                                        type="time" 
                                                                        value={slot.start}
                                                                        onChange={(e) => handleSlotChange(day, idx, 'start', e.target.value)}
                                                                        className="border border-slate-300 rounded-md px-2.5 py-1 text-xs outline-none focus:border-accent"
                                                                    />
                                                                    <span className="text-xs text-slate-400">to</span>
                                                                    <input 
                                                                        type="time" 
                                                                        value={slot.end}
                                                                        onChange={(e) => handleSlotChange(day, idx, 'end', e.target.value)}
                                                                        className="border border-slate-300 rounded-md px-2.5 py-1 text-xs outline-none focus:border-accent"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveSlot(day, idx)}
                                                                        className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                                                        title="Remove slot"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-slate-400 font-medium">Closed</span>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddSlot(day)}
                                                            className="text-xs text-accent hover:underline font-medium inline-flex items-center gap-1"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" /> Add Period
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-end pt-3">
                                        <button
                                            type="button"
                                            onClick={handleSaveSchedule}
                                            disabled={isUpdatingSchedule}
                                            className="bg-blue hover:bg-button-dark text-white px-5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {isUpdatingSchedule ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                            Save Weekly Schedule
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: BLOCKED DATES & TIMES */}
                            {activeTab === 'blocks' && (
                                <div className="space-y-6">
                                    <form onSubmit={handleAddBlockSubmit} className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add Time Block (e.g. Maintenance or Holidays)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">Start Date / Time</label>
                                                <input 
                                                    type="datetime-local" 
                                                    value={blockStart}
                                                    onChange={(e) => setBlockStart(e.target.value)}
                                                    className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs outline-none bg-white focus:border-accent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">End Date / Time</label>
                                                <input 
                                                    type="datetime-local" 
                                                    value={blockEnd}
                                                    onChange={(e) => setBlockEnd(e.target.value)}
                                                    className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs outline-none bg-white focus:border-accent"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 block mb-1">Reason (Optional)</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Scheduled maintenance, private booking"
                                                value={blockReason}
                                                onChange={(e) => setBlockReason(e.target.value)}
                                                className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs outline-none bg-white focus:border-accent"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={isAddingBlock}
                                                className="bg-accent text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-opacity-90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                {isAddingBlock && <Loader2 className="w-3 h-3 animate-spin" />}
                                                Add Block
                                            </button>
                                        </div>
                                    </form>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Active Blocks</h4>
                                        {blocks.length > 0 ? (
                                            <div className="divide-y divide-slate-200 border border-slate-200 rounded-md bg-white">
                                                {blocks.map((block) => (
                                                    <div key={block.id} className="p-3.5 flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-semibold text-slate-800">
                                                                    {formatBlockDateTime(block.start)} — {formatBlockDateTime(block.end)}
                                                                </span>
                                                                {block.reason && (
                                                                    <span className="text-[11px] px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-600">
                                                                        {block.reason}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => block.id && handleDeleteBlock(block.id)}
                                                            className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                                                            title="Delete Block"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 border border-slate-200 rounded-md text-xs text-slate-400">
                                                No time blocks configured.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: SPECIAL DATE OVERRIDES */}
                            {activeTab === 'exceptions' && (
                                <div className="space-y-6">
                                    <form onSubmit={handleAddExceptionSubmit} className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add Date Override (Special Working Hours)</h4>
                                        <div>
                                            <label className="text-xs text-slate-500 block mb-1">Target Date</label>
                                            <input 
                                                type="date" 
                                                value={exceptionDate}
                                                onChange={(e) => setExceptionDate(e.target.value)}
                                                className="w-full md:w-64 border border-slate-300 rounded-md px-3 py-1.5 text-xs outline-none bg-white focus:border-accent"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 block">Available Time Slots for this Date</label>
                                            {exceptionPeriods.map((period, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input 
                                                        type="time" 
                                                        value={period.start}
                                                        onChange={(e) => handleExceptionSlotChange(idx, 'start', e.target.value)}
                                                        className="border border-slate-300 rounded-md px-2.5 py-1 text-xs outline-none bg-white focus:border-accent"
                                                    />
                                                    <span className="text-xs text-slate-400">to</span>
                                                    <input 
                                                        type="time" 
                                                        value={period.end}
                                                        onChange={(e) => handleExceptionSlotChange(idx, 'end', e.target.value)}
                                                        className="border border-slate-300 rounded-md px-2.5 py-1 text-xs outline-none bg-white focus:border-accent"
                                                    />
                                                    {exceptionPeriods.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveExceptionSlot(idx)}
                                                            className="p-1 text-slate-400 hover:text-red-500"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={handleAddExceptionSlot}
                                                className="text-xs text-accent hover:underline font-medium inline-flex items-center gap-1"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add Additional Period
                                            </button>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={isAddingException}
                                                className="bg-accent text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-opacity-90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                {isAddingException && <Loader2 className="w-3 h-3 animate-spin" />}
                                                Save Override
                                            </button>
                                        </div>
                                    </form>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Existing Date Overrides</h4>
                                        {exceptions.length > 0 ? (
                                            <div className="divide-y divide-slate-200 border border-slate-200 rounded-md bg-white">
                                                {exceptions.map((exc) => (
                                                    <div key={exc.id} className="p-3.5 flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-accent" />
                                                                <span className="text-xs font-bold text-slate-800">{formatDateOverride(exc.date)}</span>
                                                            </div>
                                                            <div className="text-xs text-slate-500 mt-1">
                                                                Periods: {exc.periods?.map(p => `${p.start} - ${p.end}`).join(', ') || 'Closed'}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => exc.id && handleDeleteException(exc.id)}
                                                            className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                                                            title="Delete Override"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 border border-slate-200 rounded-md text-xs text-slate-400">
                                                No date overrides configured.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
