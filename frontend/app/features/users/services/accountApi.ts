import { api } from "~/api/central-axios";
import type { UpdateAccountInfo } from "../types";

export async function getUserInfo() {
    
}

export async function updateUserInfo(
    updateData: UpdateAccountInfo
) {
    try {
        const { data } = await api.put(`/users/${updateData._id}`, updateData);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        throw new Error(`Update account failed (${status})`);
    }
}

export async function deleteAccount(userId: string) {
    try {
        const { data } = await api.delete(`/users/${userId}`);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        throw new Error(`Delete account failed (${status})`);
    }
}