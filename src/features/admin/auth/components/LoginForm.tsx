import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Button from "../../../../shared/components/Button";
import type { LoginFormProps } from "../types";

export default function LoginForm({
    email,
    password,
    showPassword,
    rememberMe,
    isLoading,
    onEmailChange,
    onPasswordChange,
    onToggleShowPassword,
    onToggleRememberMe,
    onSubmit,
}: LoginFormProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 mx-auto w-full max-w-md relative z-10"
        >
            <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                <form className="space-y-6" onSubmit={onSubmit}>
                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Email address
                        </label>
                        <div className="mt-2 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => onEmailChange(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Password
                        </label>
                        <div className="mt-2 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => onPasswordChange(e.target.value)}
                                className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={onToggleShowPassword}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={onToggleRememberMe}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900 rounded cursor-pointer"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                            >
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <Button
                            type="submit"
                            variant="admin"
                            size="full"
                            isLoading={isLoading}
                            className="group relative overflow-hidden mt-4"
                        >
                            <span className="relative z-10 flex items-center">
                                Sign in to Admin
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Button shine effect */}
                            <div className="absolute inset-0 h-full w-full from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        </Button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
