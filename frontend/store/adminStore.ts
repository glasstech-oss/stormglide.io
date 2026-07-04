import { create } from 'zustand';

interface AdminState {
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    activeTab: 'dashboard',
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
