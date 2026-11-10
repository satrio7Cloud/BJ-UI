export interface Customer {
    id: string;
    fullname: string;
    email?: string;
    phone_number: string;
    address?: string;
    nik?: string;
    created_at?: string;
}

export interface CreateCustomerRequest {
    fullname: string;
    email?: string;
    phone_number: string;
    address?: string;
    nik?: string;
}

