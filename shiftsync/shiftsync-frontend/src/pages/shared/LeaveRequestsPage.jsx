import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Clock, Calendar as CalendarIcon, MessageSquare, Plus, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';


export function LeaveRequestsPage() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leave');
      setRequests(response.data.data);
    } catch (err) {
      console.error('Failed to fetch leaves', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    try {
      await api.post('/leave/request', { startDate, endDate, reason });
      setIsModalOpen(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaves();
    } catch (err) {
      console.error('Failed to submit leave request', err);
    }
  };

  const handleAction = async (leaveId, status) => {
    setActionLoading(leaveId);
    try {
      await api.post('/leave/handle', { leaveId, status, managerComment: `Processed by ${user?.name || 'Manager'}` });
      fetchLeaves();
    } catch (err) {
      console.error('Failed to handle leave request', err);
    } finally {
      setActionLoading(null);
    }
  };

  const isManager = user?.role === 'manager';

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isManager ? 'Leave Requests Management' : 'Holiday Requests'}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isManager 
              ? 'Review and manage employees time off requests.' 
              : 'Request and track your holiday status.'}
          </p>
        </div>
        {!isManager && (
          <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto shadow-lg shadow-primary-100">
            <Plus className="mr-2 h-4 w-4" /> New Holiday Request
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          {isManager ? 'Active Requests' : 'Request History'}
        </h2>
        
        {loading && requests.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-semibold text-sm">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-semibold text-sm border-2 border-dashed border-slate-100 rounded-3xl">
            No holiday requests found.
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => {
              const statusLower = req.status?.toLowerCase();
              let badgeVariant = 'warning';
              if (statusLower === 'approved') badgeVariant = 'success';
              if (statusLower === 'rejected') badgeVariant = 'danger';

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={req._id || req.id}
                >
                  <Card hover className="p-0 border-slate-100">
                    <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex items-start sm:items-center gap-6">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                          <CalendarIcon className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-base font-bold text-slate-900 flex flex-wrap items-center gap-2">
                            {isManager 
                              ? (req.userId?.fullName || 'Employee Holiday') 
                              : 'Holiday Request'}
                            {isManager && req.userId?.jobTitle && (
                              <span className="text-xs bg-primary-50 text-primary-700 py-0.5 px-2 rounded-full font-bold uppercase tracking-tight">
                                {req.userId.jobTitle}
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            <Clock className="h-3.5 w-3.5 mr-2 opacity-50" />
                            {formatDate(req.startDate)} — {formatDate(req.endDate)}
                          </div>
                          {req.reason && (
                            <p className="text-xs font-medium text-slate-500 mt-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100/50 inline-block">
                              <span className="font-bold text-slate-600">Reason:</span> {req.reason}
                            </p>
                          )}
                          {req.managerComment && (
                            <p className="text-[10px] text-slate-400 font-semibold italic mt-1 block">
                              Note: {req.managerComment}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-3">
                          {isManager && statusLower === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2 px-3.5 rounded-xl flex items-center gap-1.5"
                                onClick={() => handleAction(req._id || req.id, 'approved')}
                                isLoading={actionLoading === (req._id || req.id)}
                              >
                                <Check className="h-4 w-4" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold p-2 px-3.5 rounded-xl flex items-center gap-1.5"
                                onClick={() => handleAction(req._id || req.id, 'rejected')}
                                isLoading={actionLoading === (req._id || req.id)}
                              >
                                <X className="h-4 w-4" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <Badge variant={badgeVariant} className="px-3 py-1 font-bold uppercase tracking-tight">
                              {req.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
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

