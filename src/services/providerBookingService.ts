import api from "../lib/api";

export async function getProviderBookings() {
    const res = await api.get("api/bookings/mine");
    return res.data;
}

export async function respondToBooking(data: { id: string, action: 'accept' | 'decline' }) {
    const res = await api.post(`api/bookings/${data.id}/respond`, { action: data.action });
    return res.data;
}

export async function completeBooking(data: { id: string }) {
    const res = await api.post(`api/bookings/${data.id}/complete`);
    return res.data;
}
