import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../services/bookingService';

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
            queryClient.invalidateQueries({ queryKey: ['publicAvailability'] });
            queryClient.invalidateQueries({ queryKey: ['listingAvailability'] });
            queryClient.invalidateQueries({ queryKey: ['customerDashboard'] });
        }
    });
};
