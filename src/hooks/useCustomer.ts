import { useQuery } from '@tanstack/react-query';
import { getCustomerDashboard } from '../services/customerService';

export const useCustomerDashboard = () => {
    return useQuery({
        queryKey: ['customerDashboard'],
        queryFn: getCustomerDashboard,
        retry: false,
    });
};
