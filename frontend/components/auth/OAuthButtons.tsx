"use client";

import { motion } from "framer-motion";
import { Chrome, Github, Linkedin } from "lucide-react";
import toast from "react-hot-toast";

const providers = [
    {
        id: "google",
        name: "Google",
        icon: Chrome,
        color: "hover:bg-red-500/20 hover:text-red-400",
    },
    {
        id: "github",
        name: "GitHub",
        icon: Github,
        color: "hover:bg-surface-700 hover:text-surface-200",
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: Linkedin,
        color: "hover:bg-blue-500/20 hover:text-blue-400",
    },
];

interface OAuthButtonsProps {
    onSuccess?: (provider: string, data: any) => void;
}

export default function OAuthButtons({ onSuccess }: OAuthButtonsProps) {
    const handleOAuth = async (providerId: string) => {
        toast(`Connecting to ${providerId}...`);
        // Implement OAuth flow
        onSuccess?.(providerId, { provider: providerId });
    };

    return (
        <div className="grid grid-cols-3 gap-3">
            {providers.map((provider) => (
                <motion.button
                    key={provider.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOAuth(provider.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 bg-surface-800/50 rounded-xl text-surface-400 transition-all duration-200 border border-surface-700/50 ${provider.color}`}
                >
                    <provider.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{provider.name}</span>
                </motion.button>
            ))}
        </div>
    );
}