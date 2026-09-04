import api from "../lib/api";
import type { ProviderHomeResponse } from "../types/provider";

export async function getProviderHome(): Promise<ProviderHomeResponse> {
    const res = await api.get<ProviderHomeResponse>("api/provider/me");
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
