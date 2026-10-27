import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import { useAdminLogin } from "./hooks/useAdminLogin";

export default function LoginPage() {
    const {
        email,
        password,
        showPassword,
        rememberMe,
        isLoading,
        setEmail,
        setPassword,
        toggleShowPassword,
        toggleRememberMe,
        handleLogin,
    } = useAdminLogin();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
            {/* Background decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl transition-colors pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-3xl transition-colors pointer-events-none" />

            {/* Header / Brand section */}
            <LoginHeader />

            {/* Form Section */}
            <LoginForm
                email={email}
                password={password}
                showPassword={showPassword}
                rememberMe={rememberMe}
                isLoading={isLoading}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onToggleShowPassword={toggleShowPassword}
                onToggleRememberMe={toggleRememberMe}
                onSubmit={handleLogin}
            />

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
