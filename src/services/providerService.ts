import api from "../lib/api";

export async function getProviderHome() {
    const res = await api.get("api/provider/home");
    return res.data;
}

export async function uploadProviderAvatar(data: FormData) {
    const res = await api.post("api/provider/avatar", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}
