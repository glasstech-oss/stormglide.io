import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
    'https://us-central1-stormglideio.cloudfunctions.net/api';

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

async function getToken(): Promise<string | null> {
    if (typeof window === 'undefined' || !auth) return null;
    try {
        const user = auth.currentUser;
        if (user) return await user.getIdToken();
    } catch { /* fall through */ }
    return null;
}

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('client_token');
                if (window.location.pathname.startsWith('/portal')) {
                    window.location.href = '/portal/login';
                }
            }
        }
        if (error.response?.status === 500) {
            console.error('Backend error:', error.response.data);
        }
        return Promise.reject(error);
    }
);

// ==========================================
// AUTH MODULE
// ==========================================
export const AuthAPI = {
    requestMagicLink: async (email: string) => {
        const { data } = await apiClient.post('/v1/auth/magic-link', { email });
        return data;
    },
    adminLogin: async (accessKey: string) => {
        // Returns a Firebase custom token — caller must signInWithCustomToken(auth, token)
        const { data } = await apiClient.post('/v1/auth/admin', { key: accessKey });
        return data;
    },
    authorizeGoogleAdmin: async () => {
        const { data } = await apiClient.post('/v1/auth/admin/google', {});
        return data;
    },
    syncUser: async () => {
        // Registers / updates user doc in Firestore after Firebase sign-in
        const { data } = await apiClient.post('/v1/auth/sync-user', {});
        return data;
    },
    logout: async () => {
        if (typeof window !== 'undefined') {
            try { if (auth) await auth.signOut(); } catch { /* ignore */ }
            window.location.href = '/';
        }
    },
};

// ==========================================
// SITE SETTINGS MODULE
// ==========================================
export const SettingsAPI = {
    get: async () => {
        const { data } = await apiClient.get('/v1/settings');
        return data;
    },
    update: async (settings: Record<string, string>) => {
        const { data } = await apiClient.put('/v1/settings', settings);
        return data;
    },
};

// ==========================================
// CRM MODULE
// ==========================================
export const CrmAPI = {
    getClients: async (search?: string) => {
        const { data } = await apiClient.get('/v1/crm/clients', { params: search ? { search } : {} });
        return data;
    },
    getClient: async (id: string) => {
        const { data } = await apiClient.get(`/v1/crm/clients/${id}`);
        return data;
    },
    getProjects: async () => {
        const { data } = await apiClient.get('/v1/crm/projects');
        return data;
    },
    getProject: async (id: string) => {
        const { data } = await apiClient.get(`/v1/crm/project/${id}`);
        return data;
    },
    getLeads: async (status?: string) => {
        const { data } = await apiClient.get('/v1/crm/leads', { params: status ? { status } : {} });
        return data;
    },
    getDashboardStats: async () => {
        const { data } = await apiClient.get('/v1/crm/stats');
        return data;
    },
    createClient: async (body: { userId: string; companyName: string; contactName: string; whatsappNumber?: string; region?: string }) => {
        const { data } = await apiClient.post('/v1/crm/client', body);
        return data;
    },
    initializeProject: async (clientId: string, body: { projectName: string; description?: string; estimatedEnd?: Date }) => {
        const { data } = await apiClient.post(`/v1/crm/project/${clientId}`, body);
        return data;
    },
    updateProjectPhase: async (projectId: string, newPhase: string) => {
        const { data } = await apiClient.put(`/v1/crm/project/${projectId}/phase`, { newPhase });
        return data;
    },
    updateLeadStatus: async (leadId: string, status: string) => {
        const { data } = await apiClient.put(`/v1/crm/lead/${leadId}/status`, { status });
        return data;
    },
    submitStagingFeedback: async (projectId: string, body: { clientId: string; componentIdentifier: string; comment: string; screenX?: number; screenY?: number }) => {
        const { data } = await apiClient.post(`/v1/crm/project/${projectId}/feedback`, body);
        return data;
    },
    createLead: async (body: { name: string; email: string; organization?: string; missionScope: string; details: string }) => {
        const { data } = await apiClient.post('/v1/crm/lead', body);
        return data;
    },
    sendPortalAccess: async (clientId: string) => {
        const { data } = await apiClient.post(`/v1/crm/clients/${clientId}/portal-access`);
        return data;
    },
};

// ==========================================
// BILLING MODULE
// ==========================================
export const BillingAPI = {
    getInvoices: async (status?: string, clientId?: string) => {
        const { data } = await apiClient.get('/v1/billing/invoices', { params: { ...(status && { status }), ...(clientId && { clientId }) } });
        return data;
    },
    getClientInvoices: async (clientId: string) => {
        const { data } = await apiClient.get(`/v1/billing/invoices/${clientId}`);
        return data;
    },
    getSubscriptions: async (clientId?: string) => {
        const { data } = await apiClient.get('/v1/billing/subscriptions', { params: clientId ? { clientId } : {} });
        return data;
    },
    getBillingStats: async () => {
        const { data } = await apiClient.get('/v1/billing/stats');
        return data;
    },
    generateInvoice: async (clientId: string, body: { amount: number; currency: string; projectId?: string; dueDate: Date }) => {
        const { data } = await apiClient.post(`/v1/billing/invoice/${clientId}`, body);
        return data;
    },
    updateInvoiceStatus: async (invoiceId: string, status: string) => {
        const { data } = await apiClient.put(`/v1/billing/invoice/${invoiceId}/status`, { status });
        return data;
    },
};

// ==========================================
// KANBAN MODULE
// ==========================================
export const KanbanAPI = {
    getTasks: async (projectId?: string, status?: string) => {
        const { data } = await apiClient.get('/v1/kanban/tasks', { params: { ...(projectId && { projectId }), ...(status && { status }) } });
        return data;
    },
    getBoard: async (projectId?: string) => {
        const { data } = await apiClient.get('/v1/kanban/board', { params: projectId ? { projectId } : {} });
        return data;
    },
    createTask: async (body: { title: string; description?: string; status?: string; priority?: string; projectId?: string }) => {
        const { data } = await apiClient.post('/v1/kanban/tasks', body);
        return data;
    },
    updateTask: async (taskId: string, body: { title?: string; description?: string; status?: string; priority?: string }) => {
        const { data } = await apiClient.put(`/v1/kanban/tasks/${taskId}`, body);
        return data;
    },
    deleteTask: async (taskId: string) => {
        const { data } = await apiClient.delete(`/v1/kanban/tasks/${taskId}`);
        return data;
    },
};

// ==========================================
// MONITORING MODULE
// ==========================================
export const MonitoringAPI = {
    getSnapshots: async (clientId?: string) => {
        const { data } = await apiClient.get('/v1/monitoring/infra', {
            params: clientId ? { clientId } : {},
        });
        return data;
    },
    getInfraSummary: async () => {
        const { data } = await apiClient.get('/v1/monitoring/infra/summary');
        return data;
    },
    getAlerts: async (resolved?: boolean) => {
        const { data } = await apiClient.get('/v1/monitoring/alerts', {
            params: resolved !== undefined ? { resolved: String(resolved) } : {},
        });
        return data;
    },
    getAlertStats: async () => {
        const { data } = await apiClient.get('/v1/monitoring/alerts/stats');
        return data;
    },
    resolveAlert: async (alertId: string) => {
        const { data } = await apiClient.put(`/v1/monitoring/alerts/${alertId}/resolve`, {});
        return data;
    },
    reopenAlert: async (alertId: string) => {
        const { data } = await apiClient.put(`/v1/monitoring/alerts/${alertId}/reopen`, {});
        return data;
    },
    createAlert: async (body: { type: string; severity: string; title: string; description: string; clientId?: string; clientName?: string }) => {
        const { data } = await apiClient.post('/v1/monitoring/alerts', body);
        return data;
    },
    getDocuments: async (clientId?: string, type?: string) => {
        const { data } = await apiClient.get('/v1/monitoring/documents', {
            params: { ...(clientId && { clientId }), ...(type && { type }) },
        });
        return data;
    },
    createDocument: async (body: { clientId: string; type: string; title: string; status: string; fileUrl?: string; fileSize?: string }) => {
        const { data } = await apiClient.post('/v1/monitoring/documents', body);
        return data;
    },
    updateDocumentStatus: async (docId: string, status: string) => {
        const { data } = await apiClient.put(`/v1/monitoring/documents/${docId}/status`, { status });
        return data;
    },
};

// ==========================================
// AUDIT MODULE
// ==========================================
export const AuditAPI = {
    getLogs: async (page = 1, limit = 50, entityType?: string) => {
        const { data } = await apiClient.get('/v1/audit/logs', {
            params: { page, limit, ...(entityType && { entityType }) },
        });
        return data;
    },
};

// ==========================================
// CLIENT PORTAL MODULE
// ==========================================
export const PortalAPI = {
    getMyData: async () => {
        const { data } = await apiClient.get('/v1/portal/me');
        return data;
    },
    submitFeedback: async (projectId: string, body: { componentIdentifier: string; comment: string; screenX?: number; screenY?: number }) => {
        const { data } = await apiClient.post(`/v1/portal/feedback/${projectId}`, body);
        return data;
    },
};

// ==========================================
// AI LAB MODULE
// ==========================================
export const LabAPI = {
    generateBlueprint: async (body: { authorId: string; title: string; rawPrompt: string }) => {
        const { data } = await apiClient.post('/v1/lab/blueprint', body);
        return data;
    },
    getBlueprintHistory: async (authorId: string) => {
        const { data } = await apiClient.get(`/v1/lab/blueprints/${authorId}`);
        return data;
    },
};
