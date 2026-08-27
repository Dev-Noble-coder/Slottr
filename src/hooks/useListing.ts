import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getListings, createProviderListing } from '../services/listingService';

export const useListings = () => {
    return useQuery({
        queryKey: ['listings'],
        queryFn: getListings,
    });
};

export const useCreateProviderListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProviderListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
        }
    });
};
