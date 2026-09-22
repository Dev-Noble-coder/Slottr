import type { Listing } from './listing';

export interface CustomerBooking {
    id: string | number;
    listingId: string | number;
    customerId?: string | number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    bookingDate: string;
    durationHours: number;
    amount?: number;
    totalPrice?: number;
    attendeeFirstName?: string;
    attendeeLastName?: string;
    attendeeEmail?: string;
    attendeeCountry?: string;
    attendeePhone?: string;
    cancelReason?: string | null;
    createdAt?: string;
    updatedAt?: string;
    Listing?: Listing;
    listing?: Listing;
}

export interface CustomerDashboardResponse {
    user?: {
        id?: string | number;
        fullName?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        country?: string;
        role?: string;
        avatarUrl?: string;
    };
    bookings?: CustomerBooking[];
}
