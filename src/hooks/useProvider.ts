import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getProviderBookings, 
    respondToBooking, 
    completeBooking, 
    cancelProviderBooking 
} from '../services/providerBookingService';
import { 
    getProviderMe,
    getProviderHome, 
    uploadProviderAvatar, 
    updateProviderProfile 
} from '../services/providerService';
import type { ProviderBookingQueryParams, ProviderProfileUpdatePayload } from '../types/provider';

export const useProviderBookings = (params?: string | ProviderBookingQueryParams) => {
    return useQuery({
        queryKey: ['providerBookings', params],
        queryFn: () => getProviderBookings(params),
    });
};

export const useRespondToBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: respondToBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
            queryClient.invalidateQueries({ queryKey: ['providerHome'] });
        }
    });
};

export const useCompleteBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
            queryClient.invalidateQueries({ queryKey: ['providerHome'] });
        }
    });
};

export const useCancelProviderBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelProviderBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
            queryClient.invalidateQueries({ queryKey: ['providerHome'] });
            queryClient.invalidateQueries({ queryKey: ['customerBookings'] });
            queryClient.invalidateQueries({ queryKey: ['publicAvailability'] });
        }
    });
};

import Cookies from 'js-cookie';

export const useProviderMe = () => {
    return useQuery({
        queryKey: ['providerMe'],
        queryFn: getProviderMe,
    });
};

export const useProviderHome = () => {
    return useQuery({
        queryKey: ['providerHome'],
        queryFn: getProviderHome,
    });
};

export const useUpdateProviderProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ProviderProfileUpdatePayload) => updateProviderProfile(data),
        onSuccess: (res) => {
            const updatedProvider = res?.provider || res?.data?.provider || res?.data || (res?.fullName || res?.username ? res : null);
            if (updatedProvider) {
                try {
                    const rawCookie = Cookies.get('user');
                    const existing = rawCookie ? JSON.parse(rawCookie) : {};
                    Cookies.set('user', JSON.stringify({ ...existing, ...updatedProvider }));
                } catch {
                    // ignore cookie parse error
                }
            }
            queryClient.invalidateQueries({ queryKey: ['providerMe'] });
            queryClient.invalidateQueries({ queryKey: ['providerHome'] });
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
        }
    });
};

export const useUploadAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadProviderAvatar,
        onSuccess: (res) => {
            const avatarUrl = res?.avatarUrl || res?.data?.avatarUrl || res?.avatar || res?.url;
            if (avatarUrl) {
                try {
                    const rawCookie = Cookies.get('user');
                    const existing = rawCookie ? JSON.parse(rawCookie) : {};
                    Cookies.set('user', JSON.stringify({ ...existing, avatarUrl }));
                } catch {
                    // ignore
                }
            }
            queryClient.invalidateQueries({ queryKey: ['providerMe'] });
            queryClient.invalidateQueries({ queryKey: ['providerHome'] });
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
        }
    });
};

