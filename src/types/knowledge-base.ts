export type KBType = "folder" | "file" | "url";

export interface KBEntry {
    id: string;
    name: string;
    type: KBType;
    folder: string;
    owner: string;
    createdDate: string;
}

export interface AddFilesPayload {
    folder: string;
    files: string[];
}

export interface AddTextPayload {
    title: string;
    folder: string;
    content: string;
}

export interface AddUrlPayload {
    url: string;
    title: string;
    folder: string;
}

export interface CreateFolderPayload {
    name: string;
    folder: string;
}
