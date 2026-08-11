import api from "../lib/api";


export async function checkTokenValidity(token: string){
    const res = await api.get(`api/admin/validate-invite/${token}`, {

    })
    return res.data;
}
