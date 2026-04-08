import React, { useState } from 'react';
import { useShiftStore } from '../../store/shiftStore';
import { useAuthStore } from '../../store/authStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ArrowRightLeft, Calendar as CalendarIcon, User } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';


export function ShiftSwapPage() {
  const { user } = useAuthStore();
  const { swaps, shifts, employees, requestSwap, isLoading } = useShiftStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    shiftId: '',
    targetUserId: '',
  });

  const myShifts = shifts.filter(s => s.employeeId === user?.id);
  const colleagues = employees.filter(e => e.id !== user?.id);

  const handleRequestSwap = async (e) => {
    e.preventDefault();
    try {
      await requestSwap({
        requesterId: user.id,
        ...formData
      });
      setIsModalOpen(false);
      setFormData({ shiftId: '', targetUserId: '' });
    } catch (err) {
      // Error handling
    }
  };

  const getShiftLabel = (shiftId) => {
    const shift = shifts.find(s => s.id === Number(shiftId));
    if (!shift) return 'Select a shift';
    return `${format(new Date(shift.date), 'MMM dd')} (${shift.startTime} - ${shift.endTime})`;
  };

  const getEmployeeName = (empId) => {
    return employees.find(e => e.id === Number(empId))?.name || 'Someone';
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shift Marketplace</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Trade your shifts with reliable teammates.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <ArrowRightLeft className="mr-2 h-4 w-4" /> Request Swap
        </Button>
      </div>

      <div className="space-y-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Activity & Requests</h2>
        
        {swaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <ArrowRightLeft className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-900">No swap requests found</p>
            <p className="text-xs text-slate-500 mt-1">All quiet on the marketplace today.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {swaps.map((swap) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                key={swap.id}
              >
                <Card hover className="p-0 border-slate-100">
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="hidden sm:flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-slate-50 border border-slate-100">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                          <span className="text-sm font-bold text-slate-900">
                            {swap.requesterId === user?.id ? (
                              <span className="text-primary-600">Your Shift</span>
                            ) : getEmployeeName(swap.requesterId)} 
                          </span>
                          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-100">
                            <ArrowRightLeft className="h-2.5 w-2.5 text-slate-400" />
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            {swap.targetUserId === user?.id ? (
                              <span className="text-primary-600">Your Shift</span>
                            ) : getEmployeeName(swap.targetUserId)}
                          </span>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-slate-500">
                          <CalendarIcon className="h-3.5 w-3.5 mr-2 opacity-40" />
                          {getShiftLabel(swap.shiftId).split(' (')[0]}
                          <span className="mx-2 opacity-30">•</span>
                          {format(new Date(swap.createdAt), 'PP')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-10">
                      <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
                      <Badge variant={swap.status === 'pending' ? 'warning' : 'success'} className="px-3 py-1 font-bold uppercase tracking-tight">
                        {swap.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Swap Request">
        <form onSubmit={handleRequestSwap} className="space-y-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Select Your Shift</label>
              <select
                required
                className="flex h-12 w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm disabled:opacity-50"
                value={formData.shiftId}
                onChange={(e) => setFormData({ ...formData, shiftId: e.target.value })}
                disabled={myShifts.length === 0}
              >
                {myShifts.length === 0 ? (
                  <option value="">No shifts assigned to you</option>
                ) : (
                  <>
                    <option value="">Select a shift...</option>
                    {myShifts.map(s => (
                      <option key={s.id} value={s.id}>{getShiftLabel(s.id)}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Select Target Coworker</label>
              <select
                required
                className="flex h-12 w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                value={formData.targetUserId}
                onChange={(e) => setFormData({ ...formData, targetUserId: e.target.value })}
              >
                <option value="">Select someone...</option>
                {colleagues.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-slate-50">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel Request
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Broadcast Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


