import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WebSocketContextType {
    socket: WebSocket | null;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const websocketURL = process.env.REACT_APP_WS_URL

    useEffect(() => {
        const ws = new WebSocket(websocketURL? websocketURL : ""); //todo add env url depending on env
        setSocket(ws);

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType | null => {
    return useContext(WebSocketContext);
};
