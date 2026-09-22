import api from "../lib/api";


export async function checkTokenValidity(token: string){
    const res = await api.get(`api/admin/validate-invite/${token}`, {

    })
    return res.data;
}


export async function createPassword(data: {}){
    try {
        const res = await api.post("api/admin/accept-invite", data);
        return res.data;
    } catch (err: any) {
        if (err?.response?.status === 404) {
            const fallback = await api.post("api/admin/accept-invitation", data);
            return fallback.data;
        }
        throw err;
    }
}

export async function login(data: any){
    try {
        const res = await api.post("api/users/login", data);
        return res.data;
    } catch (err: any) {
        if (err?.response?.status === 404) {
            const fallback = await api.post("api/customer/login", data);
            return fallback.data;
        }
        throw err;
    }
}


export async function signup(data: any){
    const res = await api.post("api/users/signup", data)   
    return res.data;      
}

export async function providerLogin(data: any){
    const res = await api.post("api/provider/login", data)
    return res.data;      
}

export async function providerSignup(data: any){
    const res = await api.post("api/provider/signup", data)
    return res.data;      
}

export async function forgotPassword(data: any){
    const res = await api.post("api/users/forgot-password", data)
    return res.data;      
}

export async function resetPassword(data: any){
    const res = await api.post("api/users/reset-password", data)
    return res.data;      
}

export async function logout() {
    const res = await api.post("api/users/logout");
    return res.data;
}

export async function refresh() {
    const res = await api.post("api/users/refresh");
    return res.data;
}
