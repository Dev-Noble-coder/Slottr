export type ListingType = 'ITEMS' | 'VENUE' | 'RIDES' | 'PROPERTY' | 'SERVICE' | 'OTHERS' | 'EVENT';

export type PricingUnit = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';

export type ListingStatus = 'draft' | 'published' | 'paused' | 'DRAFT' | 'PUBLISHED' | 'PAUSED';

export interface CreateBookingPayload {
    listingId: string | number;
    attendeeFirstName: string;
    attendeeLastName: string;
    attendeeEmail: string;
    attendeeCountry: string; // ISO-2 code, e.g. "NG", "US"
    attendeePhone: string;
    bookingDate?: string;     // ISO datetime string
    durationHours?: number;  // numeric hours
    date?: string;           // legacy single-date fallback if needed
}


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

export interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination?: PaginationMetadata;
}

export interface ListingQueryParams {
    type?: ListingType | string;
    search?: string;
    city?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

export interface MyListingQueryParams {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
}

