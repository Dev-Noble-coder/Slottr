export interface ProviderProfile {
    id?: string | number;
    username: string;
    fullName: string;
    phone: string;
    avatarUrl: string | null;
    categories: string[];
    city: string;
    state: string;
    serviceRadius?: number | null;
    email: string;
    role: string;
}

export interface ProviderProfileUpdatePayload {
    fullName?: string;
    phone?: string;
    city?: string;
    state?: string;
    serviceRadius?: number | null;
    categories?: string[];
    username?: string;
}

export interface ProviderAnalyticsItem {
    day: string;
    total: number;
}

export interface ProviderTodaysScheduleItem {
    id: string | number;
    listingId?: string | number;
    status: string;
    bookingDate: string;
    durationHours?: number;
    amount?: number;
    attendeeFirstName?: string;
    attendeeLastName?: string;
    attendeeEmail?: string;
    attendeePhone?: string;
    listing?: {
        id: string | number;
        title: string;
        type?: string;
        price?: number | string;
    };
}

export interface ProviderHomeResponse {
    availableBalance: number;
    nextPayoutDate?: string | null;
    todaysSchedule: ProviderTodaysScheduleItem[];
    analytics: ProviderAnalyticsItem[];
    provider?: ProviderProfile;
    message?: string;
}

export interface ProviderBooking {
    id: string | number;
    listingId: string | number;
    customerId?: string | number | null;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    bookingDate: string;
    durationHours: number;
    amount: number;
    attendeeFirstName: string;
    attendeeLastName: string;
    attendeeEmail: string;
    attendeeCountry: string;
    attendeePhone: string;
    cancelReason?: string | null;
    createdAt?: string;
    updatedAt?: string;
    listing?: {
        id: string | number;
        title: string;
        price?: number | string;
        type?: string;
        images?: string[];
        streetAddress?: string;
        state?: string;
        country?: string;
    };
}

export interface ProviderBookingQueryParams {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}


