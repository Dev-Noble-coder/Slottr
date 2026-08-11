import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            
            // Retry failed requests twice before throwing an error
            retry: 2,
            
            // Disable automatic refetching when switching browser tabs globally
            refetchOnWindowFocus: false,
        },
    },
});
