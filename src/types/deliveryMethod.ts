export type DeliveryDirection = "PICKUP" | "RETURN" | "BOTH";
export type DeliveryProviderType = "INTERNAL" | "COURIER" | "SELF";

export interface DeliveryMethod {
    id: string;
    method_code: string;
    method_name: string;
    direction: DeliveryDirection;
    provider_type: DeliveryProviderType;
    description?: string | null;
    flat_fee: number;
    requires_address: boolean;
    requires_courier: boolean;
    is_active: boolean;
    display_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface DeliveryMethodPayload {
    method_code: string;
    method_name: string;
    direction: DeliveryDirection;
    provider_type: DeliveryProviderType;
    description?: string;
    flat_fee: number;
    requires_address: boolean;
    requires_courier: boolean;
    display_order: number;
    is_active?: boolean;
}

export interface UpdateDeliveryMethodPayload {
    method_name: string;
    direction: DeliveryDirection;
    provider_type: DeliveryProviderType;
    description?: string;
    flat_fee: number;
    requires_address: boolean;
    requires_courier: boolean;
    is_active: boolean;
    display_order: number;
}

export interface DeliveryMethodsResponse {
    data: DeliveryMethod[];
    status: string;
    message?: string;
}

export interface DeliveryMethodSingleResponse {
    data?: DeliveryMethod;
    status: string;
    message?: string;
}

export interface ToggleDeliveryMethodResponse {
    message: string;
    status: string;
}
