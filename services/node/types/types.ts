export interface Order {
    id: number;
    createdAt: string; // ISO 8601 date string
    processedAt: string | null;
    status: ProcessingStatus;
    processingOptions: ProcessingOption[];
}

enum ProcessingStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export enum ProcessingOption {
    SELECT_FREE_FORM = 'select_free_form',
    // Weitere Optionen hier hinzufügen
}

export interface Image {
    id: number;
    fileName: string;
    createdAt: string; // ISO 8601 date string
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    companyName: string | null;
    street: string;
    houseNumber: string;
    city: string;
    zip: number;
}