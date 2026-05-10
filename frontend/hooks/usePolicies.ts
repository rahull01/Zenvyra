import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface Policy {
    id: string;
    type: string;
    title: string;
    content: string;
    language: string;
    status: "draft" | "published" | "archived";
    website: string;
    lastUpdated: string;
}

export function usePolicies() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPolicies = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/policies");
            setPolicies(response.data);
        } catch (error: any) {
            toast.error("Failed to fetch policies");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const generatePolicy = useCallback(async (params: {
        type: string;
        language: string;
        websiteId: string;
    }) => {
        setIsLoading(true);
        try {
            const response = await api.post("/policies/generate", params);
            setPolicies(prev => [response.data, ...prev]);
            toast.success("Policy generated!");
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to generate policy";
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updatePolicy = useCallback(async (id: string, updates: Partial<Policy>) => {
        try {
            const response = await api.put(`/policies/${id}`, updates);
            setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...response.data } : p));
            toast.success("Policy updated!");
            return response.data;
        } catch (error: any) {
            toast.error("Failed to update policy");
            throw error;
        }
    }, []);

    const deletePolicy = useCallback(async (id: string) => {
        try {
            await api.delete(`/policies/${id}`);
            setPolicies(prev => prev.filter(p => p.id !== id));
            toast.success("Policy deleted");
        } catch {
            toast.error("Failed to delete policy");
        }
    }, []);

    return {
        policies,
        isLoading,
        fetchPolicies,
        generatePolicy,
        updatePolicy,
        deletePolicy,
    };
}