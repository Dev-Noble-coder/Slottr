import api from "../lib/api";

export async function getCustomerDashboard(){
    const res = await api.get("api/customer/dashboard")
    return res.data;      
}
