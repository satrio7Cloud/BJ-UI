import type { FormEvent } from "react";

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginFormProps {
    email: string;
    password: string;
    showPassword: boolean;
    rememberMe: boolean;
    isLoading: boolean;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onToggleShowPassword: () => void;
    onToggleRememberMe: () => void;
    onSubmit: (e: FormEvent) => void;
}
