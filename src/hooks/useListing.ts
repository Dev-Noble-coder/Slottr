import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getListings, 
    getMyListings, 
    createProviderListing,
    updateProviderListing,
    deleteProviderListing,
    publishProviderListing,
    pauseProviderListing,
    getListingAvailability,
    updateListingSchedule,
    addAvailabilityBlock,
    deleteAvailabilityBlock,
    addAvailabilityException,
    deleteAvailabilityException,
    getPublicAvailability
} from '../services/listingService';
import type { WeeklySchedule } from '../types/listing';

export const useListings = () => {
    return useQuery({
        queryKey: ['listings'],
        queryFn: getListings,
    });
};

export const useMyListings = () => {
    return useQuery({
        queryKey: ['myListings'],
        queryFn: getMyListings,
    });
};

export const useCreateProviderListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProviderListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
        }
    });
};

export const useUpdateProviderListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<any> | FormData }) => 
            updateProviderListing(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
        }
    });
};

export const useDeleteProviderListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => deleteProviderListing(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
        }
    });
};

export const usePublishProviderListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => publishProviderListing(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
        }
    });
};

export const usePauseProviderListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => pauseProviderListing(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['myListings'] });
        }
    });
};

// Availability Engine Hooks
export const useListingAvailability = (id: string | number | undefined) => {
    return useQuery({
        queryKey: ['listingAvailability', id],
        queryFn: () => getListingAvailability(id!),
        enabled: !!id,
    });
};

export const useUpdateListingSchedule = (id: string | number | undefined) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (schedule: WeeklySchedule) => updateListingSchedule(id!, schedule),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listingAvailability', id] });
            queryClient.invalidateQueries({ queryKey: ['publicAvailability'] });
        }
    });
};

export const useAddAvailabilityBlock = (id: string | number | undefined) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (block: { start: string; end: string; reason?: string }) => 
            addAvailabilityBlock(id!, block),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listingAvailability', id] });
            queryClient.invalidateQueries({ queryKey: ['publicAvailability'] });
        }
    });
};

export const useDeleteAvailabilityBlock = (id: string | number | undefined) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (blockId: string | number) => deleteAvailabilityBlock(id!, blockId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listingAvailability', id] });
            queryClient.invalidateQueries({ queryKey: ['publicAvailability'] });
        }
    });
};

export const useAddAvailabilityException = (id: string | number | undefined) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (exception: { date: string; periods: Array<{ start: string; end: string }> }) => 
            addAvailabilityException(id!, exception),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listingAvailability', id] });
            queryClient.invalidateQueries({ queryKey: ['publicAvailability'] });
        }
    });
};

export const useDeleteAvailabilityException = (id: string | number | undefined) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (exceptionId: string | number) => deleteAvailabilityException(id!, exceptionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listingAvailability', id] });
            queryClient.invalidateQueries({ queryKey: ['publicAvailability'] });
        }
    });
};

// Public Availability Hook
export const usePublicAvailability = (id: string | number | undefined, date: string, enabled = true) => {
    return useQuery({
        queryKey: ['publicAvailability', id, date],
        queryFn: () => getPublicAvailability(id!, date),
        enabled: !!id && !!date && enabled,
    });
};
