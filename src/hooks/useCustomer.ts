import { useQuery } from '@tanstack/react-query';
import { getCustomerDashboard } from '../services/customerService';
import Cookies from 'js-cookie';

export const useCustomerDashboard = () => {
    const token = Cookies.get('accessToken');
    return useQuery({
        queryKey: ['customerDashboard'],
        queryFn: getCustomerDashboard,
        enabled: !!token,
        retry: false,
    });
};

