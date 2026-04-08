import { create } from 'zustand';
import api from '../api';

export const useShiftStore = create((set, get) => ({
  shifts: [],
  employees: [],
  swaps: [],
  isLoading: false,

  fetchShifts: async (weekStartDate) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/shifts', {
        params: { weekStartDate: weekStartDate.toISOString() }
      });
      set({ shifts: response.data.data, isLoading: false });
    } catch (err) {
      console.error('Fetch shifts failed', err);
      set({ isLoading: false });
    }
  },

  fetchEmployees: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/employees');
      set({ employees: response.data.data, isLoading: false });
    } catch (err) {
      console.error('Fetch employees failed', err);
      set({ isLoading: false });
    }
  },

  addShift: async (shiftData) => {
    try {
      const response = await api.post('/shifts', shiftData);
      set((state) => ({ shifts: [...state.shifts, response.data.data] }));
      return response.data.data;
    } catch (err) {
      console.error('Add shift failed', err);
      throw err;
    }
  },

  updateShift: async (shiftId, shiftData) => {
    try {
      const response = await api.put(`/shifts/${shiftId}`, shiftData);
      set((state) => ({
        shifts: state.shifts.map(s => s.id === shiftId ? response.data.data : s)
      }));
    } catch (err) {
      console.error('Update shift failed', err);
      throw err;
    }
  },

  deleteShift: async (shiftId) => {
    try {
      await api.delete(`/shifts/${shiftId}`);
      set((state) => ({ shifts: state.shifts.filter(s => s.id !== shiftId) }));
    } catch (err) {
      console.error('Delete shift failed', err);
      throw err;
    }
  },

  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await api.put(`/employees/${employeeId}`, employeeData);
      set((state) => ({
        employees: state.employees.map(e => e.id === employeeId ? response.data.data : e)
      }));
    } catch (err) {
      console.error('Update employee failed', err);
      throw err;
    }
  },

  requestSwap: async (swapData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/swaps', swapData);
      set((state) => ({ 
        swaps: [response.data.data, ...state.swaps],
        isLoading: false 
      }));
      return response.data.data;
    } catch (err) {
      console.error('Request swap failed', err);
      set({ isLoading: false });
      throw err;
    }
  },

  generateAISchedule: async (startDate, endDate) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/ai/generate', { startDate, endDate });
      // The backend returns a list of suggested shift assignments
      // In this demo, we auto-save them or let the user review.
      // For now, let's assume they are added to the local shifts state.
      const newShifts = response.data.data;
      set((state) => ({ 
        shifts: [...state.shifts, ...newShifts],
        isLoading: false 
      }));
      return newShifts;
    } catch (err) {
      console.error('AI generation failed', err);
      set({ isLoading: false });
      throw err;
    }
  },
  
  getShiftsByDate: (dateString) => {
    return get().shifts.filter(s => {
      const sDate = typeof s.date === 'string' ? s.date : s.date.toISOString();
      return sDate.split('T')[0] === dateString.split('T')[0];
    });
  },
  
  getEmployeeShifts: (employeeId) => {
    return get().shifts.filter(s => s.employeeId === employeeId);
  }
}));

