import api from "../lib/api";

export async function createBooking(data: any){
    const res = await api.post("api/booking", data)
    return res.data;      
}
