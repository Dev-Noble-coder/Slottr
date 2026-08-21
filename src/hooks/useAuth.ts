import { useMutation, useQuery } from '@tanstack/react-query';
import { checkTokenValidity, createPassword, login, signup, providerLogin, providerSignup, forgotPassword, resetPassword } from '../services/authService';
import Cookies from 'js-cookie';

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
        onSuccess: (res) => {
            if (res?.token) {
                Cookies.set('accessToken', res.token);
            }
            if (res?.user) {
                Cookies.set('user', JSON.stringify(res.user));
            }
        }
    });
};

export const useSignup = () => {
    return useMutation({
        mutationFn: signup,
    });
};

export const useProviderLogin = () => {
    return useMutation({
        mutationFn: providerLogin,
        onSuccess: (res) => {
            if (res?.token) {
                Cookies.set('accessToken', res.token);
            }
            if (res?.user) {
                Cookies.set('user', JSON.stringify(res.user));
            }
        }
    });
};

export const useProviderSignup = () => {
    return useMutation({
        mutationFn: providerSignup,
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
    });
};
