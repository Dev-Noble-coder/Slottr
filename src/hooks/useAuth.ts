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
            const token = res?.token || res?.accessToken || res?.data?.accessToken || res?.data?.token;
            if (token) {
                Cookies.set('accessToken', token);
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
            const token = res?.token || res?.accessToken || res?.data?.accessToken || res?.data?.token;
            if (token) {
                Cookies.set('accessToken', token);
            }
            if (res?.user || res?.provider) {
                Cookies.set('user', JSON.stringify(res.user || res.provider));
            }
        }
    });
};

export const useProviderSignup = () => {
    return useMutation({
        mutationFn: providerSignup,
        onSuccess: (res) => {
            const token = res?.token || res?.accessToken || res?.data?.accessToken || res?.data?.token;
            if (token) {
                Cookies.set('accessToken', token);
            }
            if (res?.user || res?.provider) {
                Cookies.set('user', JSON.stringify(res.user || res.provider));
            }
        }
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
