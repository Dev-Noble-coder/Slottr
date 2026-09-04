export interface ProviderProfile {
    username: string;
    fullName: string;
    phone: string;
    avatarUrl: string | null;
    categories: string[];
    city: string;
    state: string;
    serviceRadius: number;
    email: string;
    role: string;
}

export interface ProviderHomeResponse {
    message: string;
    provider: ProviderProfile;
}
