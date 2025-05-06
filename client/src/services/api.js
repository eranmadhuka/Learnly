import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
    withCredentials: true,
});

export const getUserGroups = (userId) =>
    api.get(`/api/groups?userId=${userId}`);

export const getGroupMessages = (groupId) =>
    api.get(`/api/groups/${groupId}/messages`);

export const createGroup = (group) =>
    api.post('http://localhost:8081/api/groups', group);

export default api;