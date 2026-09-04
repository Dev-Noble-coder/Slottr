import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProviderBookings, respondToBooking, completeBooking } from '../services/providerBookingService';
import { getProviderHome, uploadProviderAvatar } from '../services/providerService';

export const useProviderBookings = () => {
    return useQuery({
        queryKey: ['providerBookings'],
        queryFn: getProviderBookings,
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

export const useProviderHome = () => {
    return useQuery({
        queryKey: ['providerHome'],
        queryFn: getProviderHome,
    });
};

export const useUploadAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadProviderAvatar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerHome'] });
        }
    });
};
