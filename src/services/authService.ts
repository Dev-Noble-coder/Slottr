import api from "../lib/api";


export async function checkTokenValidity(token: string){
    const res = await api.get(`api/admin/validate-invite/${token}`, {

    })
    return res.data;
}


export async function createPassword(data: {}){
    const res = await api.post("api/admin/accept-invitation", data)
    return res.data;      
}

export async function login(data: any){
    const res = await api.post("api/users/login", data)
    return res.data;      
}
