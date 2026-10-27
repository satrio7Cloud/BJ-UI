import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../../../api/auth";
import { ApiError } from "../../../../api/apiError";

export function useAdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect jika sudah login
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await loginAdmin(email, password);
            const token = data.data?.token || data.token;

            if (token) {
                localStorage.setItem("adminToken", token);
            }

            toast.success("Login Berhasil!");
            navigate("/dashboard");
        } catch (error: unknown) {
            if (error instanceof ApiError) {
                if (error.isNetworkError) {
                    toast.error("Gagal terhubung ke server backend.");
                } else if (error.status === 401 || error.status === 400) {
                    toast.error(error.message || "Email atau kata sandi salah.");
                } else {
                    toast.error(error.message);
                }
            } else if (error instanceof Error) {
                if (error.message === "Failed to fetch" || error.name === "TypeError") {
                    toast.error("Gagal terhubung ke server.");
                } else {
                    toast.error(error.message || "Email atau kata sandi salah.");
                }
            } else {
                toast.error("Terjadi kesalahan saat login.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        password,
        showPassword,
        rememberMe,
        isLoading,
        setEmail,
        setPassword,
        toggleShowPassword: () => setShowPassword((prev) => !prev),
        toggleRememberMe: () => setRememberMe((prev) => !prev),
        handleLogin,
    };
}
