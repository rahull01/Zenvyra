import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface MonitoringStatus {
    isActive: boolean;
    uptime: number;
    checksToday: number;
    avgResponseTime: number;
    lastCheck: string;
}

interface Alert {
    id: string;
    website: string;
    type: string;
    message: string;
    severity: string;
    status: string;
    createdAt: string;
}

export function useMonitoring() {
    const [status, setStatus] = useState<MonitoringStatus | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const toggleMonitoring = useCallback(async (websiteId: string, active: boolean) => {
        try {
            await fetch(`/api/monitoring/${websiteId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active }),
            });
            toast.success(active ? "Monitoring activated" : "Monitoring paused");
        } catch {
            toast.error("Failed to update monitoring");
        }
    }, []);

    const acknowledgeAlert = useCallback(async (alertId: string) => {
        try {
            await fetch(`/api/alerts/${alertId}/acknowledge`, { method: "POST" });
            setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: "acknowledged" } : a));
        } catch {
            toast.error("Failed to acknowledge alert");
        }
    }, []);

    return {
        status,
        alerts,
        isConnected,
        toggleMonitoring,
        acknowledgeAlert,
    };
}