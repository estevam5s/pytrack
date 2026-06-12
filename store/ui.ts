import { create } from "zustand";

interface UIState {
  mobileSidebarOpen: boolean;
  setMobileSidebar: (open: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
}

function persist(v: boolean) {
  try {
    localStorage.setItem("pytrack-sidebar-collapsed", v ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export const useUIStore = create<UIState>((set) => ({
  mobileSidebarOpen: false,
  setMobileSidebar: (open) => set({ mobileSidebarOpen: open }),
  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => {
    persist(v);
    set({ sidebarCollapsed: v });
  },
  toggleSidebar: () =>
    set((s) => {
      const v = !s.sidebarCollapsed;
      persist(v);
      return { sidebarCollapsed: v };
    }),
}));
