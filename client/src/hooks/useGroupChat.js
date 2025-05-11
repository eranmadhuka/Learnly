import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { toast } from "react-toastify";
import axios from "axios";

const useGroupChat = (userId, groupId) => {
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const stompClient = useRef(null);
    const isConnected = useRef(false);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;
    const pendingMessages = useRef([]);

    useEffect(() => {
        if (!userId) {
            console.error("User ID is missing");
            toast.error("Please log in to use chat.");
            setMessages([]);
            setConnectionStatus("disconnected");
            return;
        }
        if (!groupId) {
            console.debug("No group ID provided, skipping WebSocket connection");
            setMessages([]);
            setConnectionStatus("disconnected");
            return;
        }

        const connectWebSocket = () => {
            setConnectionStatus("connecting");
            console.debug(`Connecting WebSocket for user ${userId}, group ${groupId}`);
            const socket = new SockJS("http://localhost:8081/group-chat", null, {
                withCredentials: true,
                timeout: 10000,
            });
            stompClient.current = Stomp.over(socket, { protocols: ["v12.stomp"] });

            stompClient.current.connect(
                { "X-User-ID": userId },
                () => {
                    isConnected.current = true;
                    reconnectAttempts.current = 0;
                    setConnectionStatus("connected");
                    toast.success("Connected to chat!");
                    console.debug("WebSocket connected successfully");

                    stompClient.current.subscribe(`/topic/group/${groupId}`, (message) => {
                        try {
                            const newMessage = JSON.parse(message.body);
                            setMessages((prev) =>
                                prev.some((msg) => msg.id === newMessage.id)
                                    ? prev
                                    : [...prev, newMessage]
                            );
                        } catch (error) {
                            console.error("Error parsing WebSocket message:", error);
                            toast.error("Error receiving message.");
                        }
                    });

                    fetchInitialMessages();

                    while (pendingMessages.current.length > 0) {
                        const message = pendingMessages.current.shift();
                        if (message.groupId) {
                            sendMessageInternal(message);
                        } else {
                            console.warn("Discarding queued message with undefined groupId:", message);
                        }
                    }
                },
                (error) => {
                    console.error("WebSocket connection error:", error);
                    isConnected.current = false;
                    setConnectionStatus("disconnected");
                    if (reconnectAttempts.current < maxReconnectAttempts) {
                        reconnectAttempts.current += 1;
                        console.debug(`Reconnecting... Attempt ${reconnectAttempts.current}`);
                        setTimeout(connectWebSocket, reconnectDelay);
                        toast.warn(`Reconnecting to chat... Attempt ${reconnectAttempts.current}`);
                    } else {
                        console.error("Max reconnect attempts reached");
                        toast.error("Unable to connect to chat. Please log in or refresh the page.");
                    }
                }
            );
        };

        connectWebSocket();

        return () => {
            if (stompClient.current && isConnected.current) {
                console.debug("Disconnecting WebSocket");
                stompClient.current.disconnect(() => {
                    isConnected.current = false;
                    setConnectionStatus("disconnected");
                });
            }
        };
    }, [userId, groupId]);

    const fetchInitialMessages = async () => {
        try {
            console.debug(`Fetching messages for group ${groupId}`);
            const response = await axios.get(
                `http://localhost:8081/api/groups/${groupId}/messages`,
                {
                    withCredentials: true,
                    headers: { "X-User-ID": userId },
                }
            );
            setMessages(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("Unauthorized: Please log in");
                toast.error("Please log in to view messages.");
            } else {
                console.error("Error fetching messages:", error);
                toast.error(
                    error.response?.data?.message ||
                    `Error fetching messages: ${error.message}`
                );
            }
        }
    };

    const sendMessageInternal = (message) => {
        if (!message.groupId) {
            console.error("Cannot send message: groupId is undefined", message);
            toast.error("Invalid group selected.");
            return;
        }
        if (stompClient.current && isConnected.current) {
            try {
                console.debug("Sending message:", message);
                stompClient.current.send(
                    "/app/group/sendMessage",
                    JSON.stringify({
                        groupId: message.groupId,
                        content: message.content,
                    }),
                    { "X-User-ID": userId }
                );
            } catch (error) {
                console.error("Error sending message:", error);
                toast.error("Failed to send message.");
                pendingMessages.current.push(message);
            }
        } else {
            pendingMessages.current.push(message);
        }
    };

    const sendMessage = (message) => {
        if (!message.groupId) {
            console.error("Cannot send message: groupId is undefined", message);
            toast.error("Please select a group before sending a message.");
            return;
        }
        if (!isConnected.current) {
            console.warn("Chat disconnected, queuing message:", message);
            toast.warn("Chat is disconnected. Message queued for reconnection.");
            pendingMessages.current.push(message);
        } else {
            sendMessageInternal(message);
        }
    };

    return { messages, sendMessage, connectionStatus };
};

export default useGroupChat;