import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000',
});

export const triggerSimulation = (type) => api.post(`/simulate/${type}`); // In detector this might not exist yet, need to implement or use direct to gateway scripts via shell
// Wait, prompt says "Detector endpoints to trigger scripts: POST /simulate/normal". Correct. 
// I haven't implemented /simulate routes in Detector yet! I'll add them to index.js in Detector later or just have the Client call shell scripts? 
// The Prompt says "Detector endpoints to trigger scripts". So I need to add them to Detector.
// For now I'll stub the API calls.

export const resetSystem = () => api.post('/admin/reset');
export const updateSettings = (settings) => api.post('/settings', settings);
export const approveAction = (incidentId, actionKey, target) => api.post(`/incidents/${incidentId}/approve`, { action: actionKey, target });

export default api;
