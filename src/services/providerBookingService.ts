import api from "../lib/api";
import type { ProviderBookingQueryParams } from "../types/provider";

export async function getProviderBookings(params?: string | ProviderBookingQueryParams) {
    const queryParams = typeof params === 'string' ? { status: params } : params;
    const res = await api.get("api/booking/my-bookings", {
        params: queryParams
    });
    return res.data;
}

export async function respondToBooking(data: { id: string | number; action: 'accept' | 'decline' }) {
    const res = await api.post(`api/booking/${data.id}/respond`, { action: data.action });
    return res.data;
}

export async function completeBooking(data: { id: string | number }) {
    const res = await api.post(`api/booking/${data.id}/complete`);
    return res.data;
}

export async function cancelProviderBooking(data: { id: string | number; reason?: string }) {
    const res = await api.post(`api/booking/${data.id}/cancel`, {
        reason: data.reason
    });
    return res.data;
}


