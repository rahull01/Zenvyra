import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(url: string) {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            setIsConnected(true);
            console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
            setLastMessage(JSON.parse(event.data));
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log("WebSocket disconnected");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current = socket;

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = useCallback((data: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }
    }, []);

    return {
        isConnected,
        lastMessage,
        sendMessage,
    };
}