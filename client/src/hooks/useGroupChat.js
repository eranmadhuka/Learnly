import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getGroupMessages } from '../services/api';
import { toast } from 'react-toastify';

const useGroupChat = (userId, groupId) => {
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);

    useEffect(() => {
        if (!groupId || !userId) {
            setMessages([]);
            return;
        }

        console.log('Attempting WebSocket connection for group:', groupId);
        // Fetch initial messages
        const fetchMessages = async () => {
            try {
                const response = await getGroupMessages(groupId);
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
                toast.error('Failed to load messages', { position: 'top-right' });
            }
        };
        fetchMessages();

        const socket = new SockJS('http://localhost:8081/group-chat', null, { withCredentials: true });
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');

                // Set the client after it's connected
                setClient(stompClient);

                stompClient.subscribe(`/topic/group/${groupId}`, (message) => {
                    try {
                        const newMessage = JSON.parse(message.body);
                        setMessages((prev) => [...prev, newMessage]);
                    } catch (error) {
                        console.error('Failed to parse message:', error);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
                toast.error('WebSocket connection error', { position: 'top-right' });
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
                toast.error('WebSocket connection failed', { position: 'top-right' });
            },
        });


        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [groupId, userId]);
    const sendMessage = (message) => {
        console.log('Client state:', { connected: client?.connected, clientExists: !!client });
        if (client && client.connected) {
            try {
                console.log('Attempting to send message:', message);
                client.publish({
                    destination: '/app/group/sendMessage',
                    body: JSON.stringify(message),
                });
                console.log('Message sent successfully');
            } catch (error) {
                console.error('Failed to send message:', error);
                toast.error('Failed to send message', { position: 'top-right' });
            }
        } else {
            console.error('Cannot send message: WebSocket not connected');
            toast.error('Not connected to WebSocket. Please try again.', { position: 'top-right' });
        }
    };

    return { messages, setMessages, sendMessage };
};

export default useGroupChat;