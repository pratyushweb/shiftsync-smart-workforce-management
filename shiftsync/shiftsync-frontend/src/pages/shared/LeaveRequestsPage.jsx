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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  
  const [requests, setRequests] = useState([
    {
      id: 'req-1',
      type: 'Holiday Request',
      startDate: '2026-10-20',
      endDate: '2026-10-25',
      reason: 'Family trip to visit parents',
      status: 'Approved',
      approvedBy: 'John'
    }
  ]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    const newRequest = {
      id: `req-${Date.now()}`,
      type: 'Holiday Request',
      startDate,
      endDate,
      reason,
      status: 'Pending',
      approvedBy: ''
    };

    setRequests([newRequest, ...requests]);
    setIsModalOpen(false);
    
    // Clear inputs
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Holiday Requests</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Request and track your holiday status.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto shadow-lg shadow-primary-100">
          <Plus className="mr-2 h-4 w-4" /> New Holiday Request
        </Button>
      </div>

      <div className="space-y-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Request History</h2>
        
        <div className="grid gap-4">
          {requests.map((req) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={req.id}
            >
              <Card hover className="p-0 border-slate-100">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900">{req.type}</h3>
                      <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <Clock className="h-3.5 w-3.5 mr-2 opacity-50" />
                        {formatDate(req.startDate)} — {formatDate(req.endDate)}
                      </div>
                      {req.reason && (
                        <p className="text-xs font-medium text-slate-500 mt-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100/50 inline-block">
                          <span className="font-bold text-slate-600">Reason:</span> {req.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                    <Badge variant={req.status === 'Approved' ? 'success' : 'warning'} className="px-3 py-1 font-bold uppercase tracking-tight">
                      {req.status}
                    </Badge>
                    {req.approvedBy && (
                      <p className="text-[10px] text-slate-400 font-medium italic">Approved by Manager {req.approvedBy}</p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Holiday Request">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-5">
            <Input 
              type="date" 
              label="Starting Date" 
              required 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input 
              type="date" 
              label="Ending Date" 
              required 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Reason for Request</label>
              <div className="relative">
                <MessageSquare className="absolute top-3.5 left-4 h-4 w-4 text-slate-300" />
                <textarea 
                  className="w-full rounded-2xl border border-slate-200/80 p-4 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                  rows={4} 
                  placeholder="E.g., Medical appointment, family event, personal time..." 
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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

