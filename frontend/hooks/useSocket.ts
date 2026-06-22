"use client";

import { useEffect, useRef } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export interface SocketAlert {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    type: string;
    clientName?: string;
    createdAt: string;
}

export interface UseSocketHandlers {
    onAlert?: (alert: SocketAlert) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
}

export function useSocket(handlers?: UseSocketHandlers) {
    const socketRef = useRef<any>(null);
    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    useEffect(() => {
        let socket: any;

        const init = async () => {
            try {
                // @ts-ignore — socket.io-client types available after npm install
                const { io } = await import('socket.io-client');

                const token = (() => {
                    if (typeof document === 'undefined') return null;
                    const match = document.cookie.match(/admin_token=([^;]+)/);
                    if (match) return decodeURIComponent(match[1]);
                    return typeof localStorage !== 'undefined' ? localStorage.getItem('client_token') : null;
                })();

                socket = io(BACKEND_URL, {
                    auth: token ? { token } : undefined,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 2000,
                    transports: ['websocket', 'polling'],
                });

                socketRef.current = socket;

                socket.on('connect', () => {
                    handlersRef.current?.onConnect?.();
                });

                socket.on('disconnect', () => {
                    handlersRef.current?.onDisconnect?.();
                });

                socket.on('alert:new', (alert: SocketAlert) => {
                    handlersRef.current?.onAlert?.(alert);
                });
            } catch {
                // socket.io-client not installed or backend unreachable — silent fail
            }
        };

        init();

        return () => {
            socket?.disconnect();
            socketRef.current = null;
        };
    }, []);

    return socketRef;
}
