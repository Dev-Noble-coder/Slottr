import api from "../lib/api";

export async function getCustomerDashboard() {
    const res = await api.get("api/customer/dashboard");
    return res.data;      
}

export async function getCustomerBookings(status?: string) {
    const res = await api.get("api/customer/bookings", {
        params: status ? { status } : undefined
    });
    return res.data;
}

