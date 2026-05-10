import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface ScanResult {
    url: string;
    score: number;
    issues: Array<{
        type: string;
        severity: string;
        title: string;
        description: string;
        fixSuggestion: string;
        autoFixable: boolean;
        detectedAt: string;
    }>;
    scanDate: string;
    recommendations: string[];
    summary: string;
}

export function useScan() {
    const [isScanning, setIsScanning] = useState(false);
    const [lastResult, setLastResult] = useState<ScanResult | null>(null);
    const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

    const scan = useCallback(async (url: string, options?: { deep?: boolean }) => {
        setIsScanning(true);

        try {
            // Updated to use the correct free scan endpoint if not logged in
            const endpoint = localStorage.getItem("token") ? "/scan/full" : "/scan/free";
            const response = await api.post(endpoint, { url, ...options });
            const data = response.data;

            setLastResult(data);
            setScanHistory(prev => [data, ...prev].slice(0, 10));
            toast.success(`Scan complete! Score: ${data.score}/100`);
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to scan";
            toast.error(message);
            throw error;
        } finally {
            setIsScanning(false);
        }
    }, []);

    const clearHistory = useCallback(() => {
        setScanHistory([]);
        setLastResult(null);
        toast.success("Scan history cleared");
    }, []);

    return {
        scan,
        isScanning,
        lastResult,
        scanHistory,
        clearHistory,
    };
}