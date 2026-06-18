import { create } from 'zustand';

interface AdminState {
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCommandPaletteOpen: boolean;
    setCommandPaletteOpen: (open: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    activeTab: 'dashboard',
    setActiveTab: (tab) => set({ activeTab: tab }),
    isCommandPaletteOpen: false,
    setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));
