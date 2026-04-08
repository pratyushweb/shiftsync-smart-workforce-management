import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Clock, Calendar as CalendarIcon, MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';


export function LeaveRequestsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Time Off</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Request and track your leave status.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto shadow-lg shadow-primary-100">
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      <div className="space-y-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Request History</h2>
        
        <div className="grid gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card hover className="p-0 border-slate-100">
              <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900">Annual Vacation</h3>
                    <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <Clock className="h-3.5 w-3.5 mr-2 opacity-50" />
                      Oct 20, 2026 — Oct 25, 2026
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                  <Badge variant="success" className="px-3 py-1 font-bold uppercase tracking-tight">Approved</Badge>
                  <p className="text-[10px] text-slate-400 font-medium italic">Approved by Manager John</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Time Off Request">
        <form className="space-y-8">
          <div className="grid grid-cols-2 gap-5">
            <Input type="date" label="Starting Date" required />
            <Input type="date" label="Ending Date" required />
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Reason for Request</label>
              <div className="relative">
                <MessageSquare className="absolute top-3.5 left-4 h-4 w-4 text-slate-300" />
                <textarea 
                  className="w-full rounded-2xl border border-slate-200/80 p-4 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                  rows={4} 
                  placeholder="E.g., Medical appointment, family event, personal time..." 
                  required
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-slate-50">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

