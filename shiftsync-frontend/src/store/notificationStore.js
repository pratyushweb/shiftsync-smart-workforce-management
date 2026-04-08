import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [
    { id: 1, type: 'shift_assigned', message: 'You have been assigned a new shift on Monday.', read: false, createdAt: new Date().toISOString() },
    { id: 2, type: 'swap_request', message: 'Charlie requested to swap shifts with you.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],

  addNotification: (notification) => {
    set((state) => ({ 
      notifications: [{ ...notification, id: Date.now(), read: false, createdAt: new Date().toISOString() }, ...state.notifications] 
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
  },
  
  getUnreadCount: () => {
    let state = useNotificationStore.getState();
    return state.notifications.filter(n => !n.read).length;
  }
}));
