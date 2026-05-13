import { apiClient } from "@/utils/apiClient";

export async function syncUser(token: string) {
    return apiClient.post<any>("/auth/sync", undefined, { token });
}

export async function vectorSearch(folderId: string, query: string, token: string, topK: number = 10) {
    return apiClient.post<any>(`/ocr/search/${folderId}`, { query, top_k: topK }, { token });
}

export async function listFolders(token: string) {
    return apiClient.get<any>("/folders/", { token, cacheTTL: 300000 });
}

export async function createInvite(payload: {
    email: string;
    first_name: string;
    last_name: string | null;
    role_name: string;
}, token: string) {
    return apiClient.post<any>("/invite/", payload, { token });
}

export async function listEmployees(token: string) {
    return apiClient.get<any>("/auth/employees", { token, cacheTTL: 300000 });
}

export async function deleteEmployee(employeeId: string, token: string) {
    return apiClient.delete<any>(`/auth/employees/${employeeId}`, undefined, { token });
}

export async function listInvites(token: string) {
    return apiClient.get<any>("/invite/", { token, cacheTTL: 300000 });
}

export async function resendInvite(inviteId: string, token: string) {
    return apiClient.post<any>(`/invite/${inviteId}/resend`, undefined, { token });
}

export async function listRoles(token: string) {
    return apiClient.get<any>("/rbac/roles", { token, cacheTTL: 3600000 });
}

export async function revokeInvite(inviteId: string, token: string) {
    return apiClient.delete<any>(`/invite/${inviteId}/revoke`, undefined, { token });
}

export async function createFolder(payload: { name: string; description?: string }, token: string) {
    return apiClient.post<any>("/folders/", payload, { token });
}

export async function getFolder(folderId: string, token: string) {
    return apiClient.get<any>(`/folders/${folderId}`, { token, cacheTTL: 300000 });
}

export async function deleteFolder(folderId: string, token: string) {
    return apiClient.delete<any>(`/folders/${folderId}`, undefined, { token });
}

export async function updateFolder(folderId: string, payload: { name?: string; description?: string }, token: string) {
    return apiClient.patch<any>(`/folders/${folderId}`, payload, { token });
}

export async function uploadFiles(folderId: string, files: File[], token: string) {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });

    return apiClient.post<any>(`/files/upload/${folderId}`, formData, { token });
}

export async function deleteFiles(fileIds: string[], token: string) {
    return apiClient.delete<any>("/files/", { file_ids: fileIds }, { token });
}
