import { create } from 'zustand';
import axios from 'axios';

interface AppState {
    isDbSetup: boolean;
    isLoading: boolean;
    checkDbStatus: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
    isDbSetup: true, // สมมติว่า Setup แล้วไว้ก่อน กันหน้ากระพริบ
    isLoading: true,
    checkDbStatus: async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/status');
            set({ isDbSetup: res.data.is_setup, isLoading: false });
        } catch (error) {
            console.error("Backend offline or DB error", error);
            set({ isDbSetup: false, isLoading: false });
        }
    },
}));