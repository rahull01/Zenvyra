import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/hooks/useAuth";

export interface ScanResult {
    websiteId?: string;
    url: string;
    score: number;
    previousScore?: number;
    projectedScore?: number;
    issues: Array<{
        id: string;
        type: string;
        category: string;
        severity: "low" | "medium" | "high" | "critical";
        title: string;
        description: string;
        fixSuggestion: string;
        autoFixable: boolean;
        detectedAt?: string;
    }>;
    scanDate: string;
    recommendations: string[];
    summary: string;
}

function normalizeScanResponse(data: any): ScanResult {
    const scan = data?.basicScan || data;
    const score = Number(scan?.score ?? 0);
    const issues = Array.isArray(scan?.issues) ? scan.issues : [];
    const recommendations = Array.isArray(scan?.recommendations) ? scan.recommendations : [];

    return {
        websiteId: data?.websiteId,
        url: scan?.url || data?.url || "",
        score,
        previousScore: scan?.previousScore,
        projectedScore: Math.min(100, Math.round(score + issues.filter((issue: any) => issue.autoFixable).length * 6)),
        issues,
        scanDate: scan?.scanDate || new Date().toISOString(),
        recommendations,
        summary: data?.aiAnalysis || scan?.summary || "Compliance scan completed with live website data.",
    };
}

export function useScan() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [isScanning, setIsScanning] = useState(false);
    const [lastResult, setLastResult] = useState<ScanResult | null>(null);
    const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

    const scan = useCallback(async (url: string, options?: { deep?: boolean }) => {
        setIsScanning(true);

        try {
            const endpoint = isAuthenticated ? "/scan/full" : "/scan/free";
            const response = await api.post(endpoint, { url, ...options });
            const data = normalizeScanResponse(response.data);

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
    }, [isAuthenticated]);

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
