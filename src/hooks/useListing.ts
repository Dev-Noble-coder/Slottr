import { useQuery } from '@tanstack/react-query';
import { getListings } from '../services/listingService';

export const useListings = () => {
    return useQuery({
        queryKey: ['listings'],
        queryFn: getListings,
    });
};
