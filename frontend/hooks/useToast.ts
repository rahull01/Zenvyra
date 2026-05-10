import { toast as hotToast } from "react-hot-toast";

export const useToast = () => {
    return {
        success: (message: string) => hotToast.success(message, {
            style: {
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                padding: "12px 16px",
            },
            iconTheme: {
                primary: "#10b981",
                secondary: "#0f172a",
            },
        }),
        error: (message: string) => hotToast.error(message, {
            style: {
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                padding: "12px 16px",
            },
            iconTheme: {
                primary: "#ef4444",
                secondary: "#0f172a",
            },
        }),
        info: (message: string) => hotToast(message, {
            style: {
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                padding: "12px 16px",
            },
            iconTheme: {
                primary: "#0ea5e9",
                secondary: "#0f172a",
            },
        }),
    };
};