import api from "../lib/api";
import type { 
    WeeklySchedule, 
    ListingAvailabilityData, 
    PublicAvailabilityResponse 
} from "../types/listing";

// Public Listings
export async function getListings() {
    const res = await api.get("api/listings/get");
    return res.data;
}

// Provider Listings
export async function getMyListings() {
    const res = await api.get("api/listings/mine");
    return res.data;
}

// Create Listing (Handles both Event style at /api/listings/ and Availability engine listings at /api/listings/create)
export async function createProviderListing(data: FormData) {
    const type = data.get('type');
    const endpoint = type === 'EVENT' ? "api/listings/" : "api/listings/create";
    const res = await api.post(endpoint, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}

export async function updateProviderListing(id: string | number, data: Partial<any> | FormData) {
    const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined;
    const res = await api.patch(`api/provider/listings/${id}`, data, { headers });
    return res.data;
}

export async function deleteProviderListing(id: string | number) {
    const res = await api.delete(`api/provider/listings/${id}`);
    return res.data;
}

export async function publishProviderListing(id: string | number) {
    const res = await api.post(`api/provider/listings/${id}/publish`);
    return res.data;
}

export async function pauseProviderListing(id: string | number) {
    const res = await api.post(`api/provider/listings/${id}/pause`);
    return res.data;
}

// Availability Engine (Provider Configuration)
export async function getListingAvailability(id: string | number): Promise<ListingAvailabilityData> {
    const res = await api.get(`api/provider/listings/${id}/availability`);
    return res.data;
}

export async function updateListingSchedule(id: string | number, schedule: WeeklySchedule) {
    const res = await api.put(`api/provider/listings/${id}/availability/schedule`, schedule);
    return res.data;
}

export async function addAvailabilityBlock(
    id: string | number, 
    block: { start: string; end: string; startDateTime?: string; endDateTime?: string; reason?: string }
) {
    const payload = {
        ...block,
        startDateTime: block.startDateTime || (block.start ? new Date(block.start).toISOString() : block.start),
        endDateTime: block.endDateTime || (block.end ? new Date(block.end).toISOString() : block.end),
    };
    const res = await api.post(`api/provider/listings/${id}/availability/blocks`, payload);
    return res.data;
}

export async function deleteAvailabilityBlock(id: string | number, blockId: string | number) {
    const res = await api.delete(`api/provider/listings/${id}/availability/blocks/${blockId}`);
    return res.data;
}

export async function addAvailabilityException(id: string | number, exception: { date: string; periods: Array<{ start: string; end: string }> }) {
    const res = await api.post(`api/provider/listings/${id}/availability/exceptions`, exception);
    return res.data;
}

export async function deleteAvailabilityException(id: string | number, exceptionId: string | number) {
    const res = await api.delete(`api/provider/listings/${id}/availability/exceptions/${exceptionId}`);
    return res.data;
}

// Public Availability (Customer-facing, calculated by backend)
export async function getPublicAvailability(id: string | number, date: string): Promise<PublicAvailabilityResponse> {
    const res = await api.get(`api/listings/${id}/availability?date=${date}`);
    return res.data;
}
