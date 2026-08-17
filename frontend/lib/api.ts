import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { auth } from './firebase';
import { PUBLIC_SITE_URL } from './navigation';

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
        await auth.authStateReady();
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
            window.location.href = PUBLIC_SITE_URL;
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

export interface TeamMember {
    id: string;
    name: string;
    title: string;
    bio: string;
    linkedinUrl: string;
    photoDataUri: string;
    order: number;
}

export const TeamAPI = {
    list: async (): Promise<TeamMember[]> => {
        const { data } = await apiClient.get('/v1/team');
        return data;
    },
    create: async (member: Partial<TeamMember>) => {
        const { data } = await apiClient.post('/v1/team', member);
        return data;
    },
    update: async (id: string, member: Partial<TeamMember>) => {
        const { data } = await apiClient.put(`/v1/team/${id}`, member);
        return data;
    },
    remove: async (id: string) => {
        const { data } = await apiClient.delete(`/v1/team/${id}`);
        return data;
    },
};

// ==========================================
// CRM MODULE
// ==========================================
export interface Lead {
    id: string;
    name: string;
    email: string;
    organization: string | null;
    missionScope: string | null;
    details: string | null;
    phone: string | null;
    product: string | null;
    source: string | null;
    budget: string | null;
    timeline: string | null;
    status: string;
    createdAt: unknown;
}

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
    getLeads: async (status?: string): Promise<Lead[]> => {
        const { data } = await apiClient.get('/v1/crm/leads', { params: status ? { status } : {} });
        return data;
    },
    getDashboardStats: async () => {
        const { data } = await apiClient.get('/v1/crm/stats');
        return data;
    },
    createClient: async (body: { userId?: string; companyName: string; contactName: string; email?: string; whatsappNumber?: string; region?: string; industry?: string }) => {
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
// PROJECT 360 MODULE
// ==========================================
export const ProjectsAPI = {
    list: async (params?: { clientId?: string; phase?: string; status?: string }) => {
        const { data } = await apiClient.get('/v1/projects', { params });
        return data;
    },
    get: async (projectId: string) => {
        const { data } = await apiClient.get(`/v1/projects/${projectId}`);
        return data;
    },
    create: async (body: { clientId: string; projectName: string; description?: string; estimatedEnd?: string }) => {
        const { data } = await apiClient.post('/v1/projects', body);
        return data;
    },
    updateCompletion: async (projectId: string, body: Record<string, unknown>) => {
        const { data } = await apiClient.put(`/v1/projects/${projectId}/completion`, body);
        return data;
    },
    getCompletion: async (projectId: string) => {
        const { data } = await apiClient.get(`/v1/projects/${projectId}/completion`);
        return data;
    },
    getTechStack: async (projectId: string) => {
        const { data } = await apiClient.get(`/v1/projects/${projectId}/tech-stack`);
        return data;
    },
    updateTechStack: async (projectId: string, body: Record<string, unknown>) => {
        const { data } = await apiClient.put(`/v1/projects/${projectId}/tech-stack`, body);
        return data;
    },
    getDomains: async (projectId: string) => {
        const { data } = await apiClient.get('/v1/domains', { params: { projectId } });
        return data;
    },
    getAllDomains: async () => {
        const { data } = await apiClient.get('/v1/domains');
        return data;
    },
    getAllSubscriptions: async () => {
        const { data } = await apiClient.get('/v1/project-subscriptions');
        return data;
    },
    addDomain: async (body: Record<string, unknown>) => {
        const { data } = await apiClient.post('/v1/domains', body);
        return data;
    },
    renewDomain: async (domainId: string) => {
        const { data } = await apiClient.put(`/v1/domains/${domainId}/renew`, {});
        return data;
    },
    deleteDomain: async (domainId: string) => {
        const { data } = await apiClient.delete(`/v1/domains/${domainId}`);
        return data;
    },
    getSubscriptions: async (projectId: string) => {
        const { data } = await apiClient.get('/v1/project-subscriptions', { params: { projectId } });
        return data;
    },
    addSubscription: async (body: Record<string, unknown>) => {
        const { data } = await apiClient.post('/v1/project-subscriptions', body);
        return data;
    },
    deleteSubscription: async (subscriptionId: string) => {
        const { data } = await apiClient.delete(`/v1/project-subscriptions/${subscriptionId}`);
        return data;
    },
    getExpenses: async (projectId?: string) => {
        const { data } = await apiClient.get('/v1/project-expenses', { params: projectId ? { projectId } : {} });
        return data;
    },
    addExpense: async (body: Record<string, unknown>) => {
        const { data } = await apiClient.post('/v1/project-expenses', body);
        return data;
    },
    deleteExpense: async (expenseId: string) => {
        const { data } = await apiClient.delete(`/v1/project-expenses/${expenseId}`);
        return data;
    },
    getTimeEntries: async (projectId: string) => {
        const { data } = await apiClient.get('/v1/time-entries', { params: { projectId } });
        return data;
    },
    logTime: async (body: { projectId: string; description: string; minutes: number; billable?: boolean }) => {
        const { data } = await apiClient.post('/v1/time-entries', body);
        return data;
    },
    deleteTimeEntry: async (entryId: string) => {
        const { data } = await apiClient.delete(`/v1/time-entries/${entryId}`);
        return data;
    },
};

// ==========================================
// BILLING MODULE
// ==========================================
export interface InvoiceLineItem {
    type: 'PRODUCT' | 'SERVICE';
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
}

export interface InvoiceDraft {
    items: InvoiceLineItem[];
    currency: string;
    projectId?: string;
    dueDate: string;
    taxPercent?: number;
    discountPercent?: number;
    notes?: string;
    includeWarranty?: boolean;
}

export const BillingAPI = {
    getInvoices: async (status?: string, clientId?: string) => {
        const { data } = await apiClient.get('/v1/billing/invoices', { params: { ...(status && { status }), ...(clientId && { clientId }) } });
        return data;
    },
    getClientInvoices: async (clientId: string) => {
        const { data } = await apiClient.get(`/v1/billing/invoices/${clientId}`);
        return data;
    },
    getInvoice: async (invoiceId: string) => {
        const { data } = await apiClient.get(`/v1/billing/invoice/${invoiceId}`);
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
    createInvoice: async (clientId: string, body: InvoiceDraft) => {
        const { data } = await apiClient.post(`/v1/billing/invoice/${clientId}`, body);
        return data;
    },
    updateInvoice: async (invoiceId: string, body: InvoiceDraft) => {
        const { data } = await apiClient.put(`/v1/billing/invoice/${invoiceId}`, body);
        return data;
    },
    sendInvoice: async (invoiceId: string) => {
        const { data } = await apiClient.post(`/v1/billing/invoice/${invoiceId}/send`);
        return data;
    },
    cloneInvoice: async (invoiceId: string) => {
        const { data } = await apiClient.post(`/v1/billing/invoice/${invoiceId}/clone`);
        return data;
    },
    updateInvoiceStatus: async (invoiceId: string, status: string) => {
        const { data } = await apiClient.put(`/v1/billing/invoice/${invoiceId}/status`, { status });
        return data;
    },
    // The PDF endpoint requires the admin's auth token, so it can't be a bare
    // <a href> link — fetch it as a blob (token attached by the request
    // interceptor) and trigger a save via a temporary object URL.
    downloadInvoicePdf: async (invoiceId: string, filename: string) => {
        const { data } = await apiClient.get(`/v1/billing/invoice/${invoiceId}/pdf`, { responseType: 'blob' });
        const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    },
};

// ==========================================
// PUBLIC INVOICE (no auth — shareable pay link)
// ==========================================
export const PublicInvoiceAPI = {
    get: async (invoiceId: string) => {
        const { data } = await apiClient.get(`/v1/public/invoice/${invoiceId}`);
        return data;
    },
    pay: async (invoiceId: string) => {
        const { data } = await apiClient.post(`/v1/public/invoice/${invoiceId}/pay`);
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
    createTask: async (body: { title: string; description?: string; status?: string; priority?: string; projectId?: string; clientId?: string }) => {
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
    getBudgets: async () => {
        const { data } = await apiClient.get('/v1/monitoring/budgets');
        return data;
    },
    getSpendHistory: async (clientId: string, days = 30) => {
        const { data } = await apiClient.get('/v1/monitoring/spend-history', { params: { clientId, days } });
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

// ==========================================
// ANALYTICS MODULE (Google Analytics 4)
// ==========================================

// Raw shape of a GA4 Data API RunReportResponse — passed through as-is by
// GET /v1/analytics/summary rather than reshaped server-side.
export interface GaReport {
    rows?: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }[];
}

export interface AnalyticsSummary {
    configured: boolean;
    message?: string;
    range?: { startDate: string; endDate: string };
    overview?: GaReport;
    byDevice?: GaReport;
    byPage?: GaReport;
    bySource?: GaReport;
    byCountry?: GaReport;
}

export const AnalyticsAPI = {
    getSummary: async (params?: { startDate?: string; endDate?: string }): Promise<AnalyticsSummary> => {
        const { data } = await apiClient.get('/v1/analytics/summary', { params });
        return data;
    },
};
