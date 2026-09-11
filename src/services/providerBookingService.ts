import api from "../lib/api";

export async function getProviderBookings(status?: string) {
    const res = await api.get("api/booking/my-bookings", {
        params: status ? { status } : undefined
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

