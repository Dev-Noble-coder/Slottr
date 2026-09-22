import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, cancelBooking } from '../services/bookingService';

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
            queryClient.invalidateQueries({ queryKey: ['customerBookings'] });
            queryClient.invalidateQueries({ queryKey: ['publicAvailability'] });
            queryClient.invalidateQueries({ queryKey: ['listingAvailability'] });
            queryClient.invalidateQueries({ queryKey: ['customerDashboard'] });
        }
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: string | number; reason?: string }) => cancelBooking(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
            queryClient.invalidateQueries({ queryKey: ['customerBookings'] });
            queryClient.invalidateQueries({ queryKey: ['publicAvailability'] });
            queryClient.invalidateQueries({ queryKey: ['listingAvailability'] });
            queryClient.invalidateQueries({ queryKey: ['customerDashboard'] });
            queryClient.invalidateQueries({ queryKey: ['providerHome'] });
        }
    });
};

