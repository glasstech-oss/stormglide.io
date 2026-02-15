import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// ==========================================
// 1. AXIOS INSTANCE CONFIGURATION
// ==========================================
// In production, ensure NEXT_PUBLIC_API_URL is set in your .env.local file
// Example: NEXT_PUBLIC_API_URL=https://api.stormglide.io
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // 15-second timeout for heavy AI generation requests
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// ==========================================
// 2. REQUEST & RESPONSE INTERCEPTORS
// ==========================================
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Retrieve the secure session token. 
        // In a Next.js App Router setup, if this is called on the client side, we use localStorage.
        // (For Server Components, you would extract this from next/headers cookies)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('stormglide_session_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Pass through successful responses smoothly
        return response;
    },
    (error: AxiosError) => {
        // Global Error Handling: Catch 401 Unauthorized (Expired JWT)
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                console.warn('Session expired or invalid. Redirecting to authentication portal.');
                localStorage.removeItem('stormglide_session_token');
                // Force redirect to login to protect the system
                window.location.href = '/portal/login';
            }
        }
        // Global Error Handling: Log server errors for the Command Center
        if (error.response?.status === 500) {
            console.error('NestJS Core Backend Error:', error.response.data);
        }
        return Promise.reject(error);
    }
);

// ==========================================
// 3. AUTHENTICATION MODULE
// ==========================================
export const AuthAPI = {
    /**
     * Request a secure JWT Magic Link sent via email
     */
    requestMagicLink: async (email: string) => {
        const response = await apiClient.post('/v1/auth/request-magic-link', { email });
        return response.data;
    },

    /**
     * Verify the token from the email URL and return the long-term session token
     */
    verifyMagicLink: async (token: string) => {
        const response = await apiClient.get(`/v1/auth/verify?token=${token}`);
        // Save token immediately upon successful verification
        if (response.data.accessToken && typeof window !== 'undefined') {
            localStorage.setItem('stormglide_session_token', response.data.accessToken);
        }
        return response.data;
    },

    /**
     * Purge local session data to securely log out
     */
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('stormglide_session_token');
            window.location.href = '/';
        }
    }
};

// ==========================================
// 4. CRM & PROJECT TRACKING MODULE
// ==========================================
export const CrmAPI = {
    /**
     * Create a new client profile
     */
    createClient: async (data: { userId: string; companyName: string; contactName: string; whatsappNumber?: string; region?: string }) => {
        const response = await apiClient.post('/v1/crm/client', data);
        return response.data;
    },

    /**
     * Initialize a new project and generate a Job ID
     */
    initializeProject: async (clientId: string, data: { projectName: string; description?: string; estimatedEnd?: Date }) => {
        const response = await apiClient.post(`/v1/crm/project/${clientId}`, data);
        return response.data;
    },

    /**
     * Advance the project phase (Moves the progress bar on the Client Portal)
     */
    updateProjectPhase: async (projectId: string, newPhase: string) => {
        const response = await apiClient.put(`/v1/crm/project/${projectId}/phase`, { newPhase });
        return response.data;
    },

    /**
     * Submit live visual feedback from the staging sandbox
     */
    submitStagingFeedback: async (projectId: string, data: { clientId: string; componentIdentifier: string; comment: string; screenX?: number; screenY?: number }) => {
        const response = await apiClient.post(`/v1/crm/project/${projectId}/feedback`, data);
        return response.data;
    },

    /**
     * Fetch full active project context for the Client Dashboard
     */
    getClientDashboardData: async (clientId: string) => {
        // Assumes an endpoint exists in NestJS to aggregate client data
        const response = await apiClient.get(`/v1/crm/dashboard/${clientId}`);
        return response.data;
    }
};

// ==========================================
// 5. BILLING & INVOICING MODULE
// ==========================================
export const BillingAPI = {
    /**
     * Generate an invoice and automatically route to Stripe or Paystack based on currency
     */
    generateInvoice: async (clientId: string, data: { amount: number; currency: string; projectId?: string; dueDate: Date }) => {
        const response = await apiClient.post(`/v1/billing/invoice/${clientId}`, data);
        return response.data;
    },

    /**
     * Fetch invoice history for a client
     */
    getClientInvoices: async (clientId: string) => {
        const response = await apiClient.get(`/v1/billing/invoices/${clientId}`);
        return response.data;
    }
};

// ==========================================
// 6. AI BRAINSTORMING LAB MODULE
// ==========================================
export const LabAPI = {
    /**
     * Send a raw client prompt to the NestJS engine to generate a Prisma schema blueprint
     */
    generateBlueprint: async (data: { authorId: string; title: string; rawPrompt: string }) => {
        const response = await apiClient.post('/v1/lab/blueprint', data);
        return response.data;
    },

    /**
     * Fetch all previously generated AI blueprints for the Lab Sidebar
     */
    getBlueprintHistory: async (authorId: string) => {
        const response = await apiClient.get(`/v1/lab/blueprints/${authorId}`);
        return response.data;
    }
};
