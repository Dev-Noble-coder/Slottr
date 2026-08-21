import api from "../lib/api";

export async function getListings() {
    const res = await api.get("api/listings");
    return res.data;
}
