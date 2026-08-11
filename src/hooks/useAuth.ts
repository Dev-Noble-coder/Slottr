import { useMutation, useQuery } from '@tanstack/react-query';
import { checkTokenValidity, createPassword, login } from '../services/authService';

export const useCheckTokenValidity = (token: string | null) => {
    return useQuery({
        queryKey: ['checkTokenValidity', token],
        queryFn: () => {
            if (!token) throw new Error("No token provided");
            return checkTokenValidity(token);
        },
        enabled: !!token,
        retry: false,
    });
};

export const useAcceptInvitation = () => {
    return useMutation({
        mutationFn: createPassword,
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: login,
    });
};
