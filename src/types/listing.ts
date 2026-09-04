export type ListingType = 'EVENT' | 'ITEMS' | 'VENUE' | 'RIDES' | 'PROPERTY' | 'SERVICE' | 'OTHERS';

export type PricingUnit = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';

export type ListingStatus = 'draft' | 'published' | 'paused' | 'DRAFT' | 'PUBLISHED' | 'PAUSED';

export interface TimeSlot {
    start: string; // e.g. "09:00"
    end: string;   // e.g. "17:00"
}

export interface WeeklySchedule {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
}

export interface BackendScheduleItem {
    id?: number | string;
    listingId?: number | string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AvailabilityBlock {
    id?: string | number;
    listingId?: string | number;
    type?: string;
    start: string; // ISO format or date string e.g. "2026-09-10T00:00:00"
    end: string;
    startDateTime?: string;
    endDateTime?: string;
    reason?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AvailabilityException {
    id?: string | number;
    listingId?: string | number;
    type?: string;
    date: string; // YYYY-MM-DD e.g. "2026-09-12"
    periods: TimeSlot[];
    startDateTime?: string;
    endDateTime?: string;
    startTime?: string;
    endTime?: string;
    reason?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ListingAvailabilityData {
    schedule?: WeeklySchedule | BackendScheduleItem[];
    blocks?: AvailabilityBlock[];
    exceptions?: AvailabilityException[];
    data?: {
        schedule?: WeeklySchedule | BackendScheduleItem[];
        blocks?: AvailabilityBlock[];
        exceptions?: AvailabilityException[];
    };
}

export interface PublicAvailabilityResponse {
    date: string;
    available: boolean;
    slots: TimeSlot[];
}

export interface Listing {
    id: string | number;
    title: string;
    description: string;
    price: number | string;
    status: ListingStatus;
    type: ListingType;
    category?: string;
    pricingUnit?: PricingUnit;
    minDuration?: number | string;
    maxDuration?: number | string;
    streetAddress?: string;
    state?: string;
    country?: string;
    location?: string;
    date?: string;
    capacity?: number | string;
    images?: string[];
    createdAt?: string;
    updatedAt?: string;
    providerId?: string | number;
}
