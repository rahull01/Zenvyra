import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface ScoreBreakdown {
    privacy: number;
    cookies: number;
    accessibility: number;
    security: number;
    [key: string]: number;
}

interface DashboardStats {
    complianceScore: number;
    aiSystemsCount?: number;
    totalWebsites: number;
    activeAlerts: number;
    pendingDSARs: number;
    nextScan: string;
    scoreBreakdown: ScoreBreakdown;
}

interface DashboardActivityItem {
    action: string;
    time: string;
    user?: string;
    website?: string;
    id?: string;
}

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activity, setActivity] = useState<DashboardActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [statsResponse, activityResponse] = await Promise.all([
                    api.get("/dashboard/stats"),
                    api.get("/dashboard/activity"),
                ]);

                setStats(statsResponse.data);
                const activities = activityResponse.data?.activities ?? activityResponse.data ?? [];
                setActivity(Array.isArray(activities) ? activities : []);
            } catch (error: any) {
                setError("Unable to load dashboard data. Showing sample values.");
                toast.error("Unable to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        stats,
        activity,
        loading,
        error,
    };
}
