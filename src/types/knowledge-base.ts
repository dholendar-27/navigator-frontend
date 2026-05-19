export type KBType = "folder" | "file";

// Uploader / creator info from backend
export interface UploaderInfo {
    id: string;
    email: string;
    display_name: string | null;
}

// Matches backend FileResponse schema
export interface FileEntry {
    id: string;
    name: string;
    original_filename: string;
    description: string | null;
    folder_id: string;
    organization_id: string;
    uploaded_by: string | null;
    uploader: UploaderInfo | null;
    file_size: number;
    mime_type: string | null;
    created_at: string;
    updated_at: string;
    // OCR job status (enriched on frontend via /ocr/jobs/file/:id)
    ocr_status?: "pending" | "processing" | "completed" | "failed" | "cancelled" | null;
    ocr_progress?: number;
}

// Matches backend FolderResponse schema
export interface FolderEntry {
    id: string;
    name: string;
    description: string | null;
    organization_id: string;
    created_by: string | null;
    creator: UploaderInfo | null;
    total_size: number;
    created_at: string;
    updated_at: string;
}

// Unified row for the KB table display
export interface KBEntry {
    id: string;
    name: string;
    type: KBType;
    folder: string;       // shows folder description or file size
    owner: string;        // display_name of creator/uploader
    createdDate: string;  // formatted date string
    // Optional extras
    file_size?: number;
    mime_type?: string | null;
    ocr_status?: "pending" | "processing" | "completed" | "failed" | "cancelled" | null;
    description?: string | null;
}

// OCR Job response from backend
export interface OCRJobResponse {
    job_id: string;
    file_id: string;
    folder_id: string;
    status: "pending" | "processing" | "completed" | "failed" | "cancelled";
    progress_percentage: number;
    progress_message: string | null;
    extraction_type: string;
    text_length: number | null;
    embedding_stored: boolean;
    namespace: string | null;
    error_message: string | null;
    retry_count: number;
    created_at: string | null;
    started_at: string | null;
    completed_at: string | null;
}

export interface AddFilesPayload {
    folderId: string;
    files: File[];
}

export interface AddTextPayload {
    title: string;
    folderId: string;   // folder UUID
    content: string;
}

export interface AddUrlPayload {
    url: string;
    title: string;
    folderId: string;   // folder UUID
}

export interface CreateFolderPayload {
    name: string;
    description?: string;
}
