import { toast as hotToast } from "react-hot-toast";

export const useToast = () => {
    return {
        success: (message: string) => hotToast.success(message, {
            style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                padding: "12px 16px",
            },
            iconTheme: {
                primary: "var(--success)",
                secondary: "var(--bg-secondary)",
            },
        }),
        error: (message: string) => hotToast.error(message, {
            style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                padding: "12px 16px",
            },
            iconTheme: {
                primary: "var(--danger)",
                secondary: "var(--bg-secondary)",
            },
        }),
        info: (message: string) => hotToast(message, {
            style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                padding: "12px 16px",
            },
            iconTheme: {
                primary: "var(--info)",
                secondary: "var(--bg-secondary)",
            },
        }),
    };
};