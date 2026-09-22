import { useQuery } from '@tanstack/react-query';
import { getCustomerDashboard, getCustomerBookings } from '../services/customerService';
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

export const useCustomerBookings = (status?: string) => {
    const token = Cookies.get('accessToken');
    return useQuery({
        queryKey: ['customerBookings', status],
        queryFn: () => getCustomerBookings(status),
        enabled: !!token,
        retry: false,
    });
};


