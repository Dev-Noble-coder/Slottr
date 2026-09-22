import api from "../lib/api";

export async function createBooking(data: any) {
    const res = await api.post("api/booking", data);
    return res.data;      
}

export async function cancelBooking(id: string | number, reason?: string) {
    const res = await api.post(`api/booking/${id}/cancel`, { reason });
    return res.data;
}

