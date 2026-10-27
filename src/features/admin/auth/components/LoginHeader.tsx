import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function LoginHeader() {
    return (
        <div className="mx-auto w-full max-w-md relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
            >
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
                    <ShieldCheck className="w-10 h-10 text-white" />
                </div>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors"
            >
                Admin Portal
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-2 text-sm text-slate-600 dark:text-slate-400 transition-colors"
            >
                Please sign in to access the dashboard and invoices
            </motion.p>
        </div>
    );
}
