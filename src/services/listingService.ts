import api from "../lib/api";

export async function getListings() {
    const res = await api.get("api/listings/get");
    return res.data;
}

export async function getMyListings() {
    const res = await api.get("api/listings/mine");
    return res.data;
}

export async function createProviderListing(data: FormData) {
    const res = await api.post("api/listings/", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}
