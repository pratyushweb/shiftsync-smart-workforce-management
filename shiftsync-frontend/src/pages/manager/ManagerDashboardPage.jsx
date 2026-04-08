import React, { useState, useEffect } from 'react';
import { useShiftStore } from '../../store/shiftStore';
import { format, addDays, startOfWeek } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Plus, Users, Calendar as CalendarIcon, Activity, TrendingUp, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function ManagerDashboardPage() {
  const { 
    shifts, 
    employees, 
    isLoading, 
    fetchShifts, 
    fetchEmployees, 
    addShift, 
    updateShift, 
    deleteShift, 
    generateAISchedule 
  } = useShiftStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [shiftData, setShiftData] = useState({ date: '', startTime: '', endTime: '', employeeId: '', role: '' });
  
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    fetchShifts(weekStart);
    fetchEmployees();
  }, []);

  const handleAIOptimize = async () => {
    try {
      if (shifts.length > 0 && !window.confirm('This will add shifts on top of existing ones. Continue?')) {
        return;
      }
      await generateAISchedule(weekStart, weekEnd);
    } catch (err) {
      alert('Failed to generate schedule: ' + err.message);
    }
  };
  
  const openCreateModal = () => {
    setEditingShift(null);
    setShiftData({ date: '', startTime: '', endTime: '', employeeId: '', role: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (shift) => {
    setEditingShift(shift);
    const empId = shift.employeeId?._id || shift.employeeId;
    setShiftData({
      date: shift.shiftDate ? shift.shiftDate.split('T')[0] : (shift.date ? shift.date.split('T')[0] : ''),
      startTime: shift.startTime,
      endTime: shift.endTime,
      employeeId: empId?.toString() || '',
      role: shift.role
    });
    setIsModalOpen(true);
  };

  const handleSaveShift = async (e) => {
    e.preventDefault();
    if (!shiftData.date || !shiftData.startTime || !shiftData.employeeId) return;
    
    const formattedData = {
      title: `${shiftData.role} Shift`,
      shiftDate: new Date(shiftData.date).toISOString(),
      startTime: shiftData.startTime,
      endTime: shiftData.endTime,
      assignedEmployeeId: shiftData.employeeId,
      role: shiftData.role
    };

    try {
      if (editingShift) {
        await updateShift(editingShift._id || editingShift.id, formattedData);
      } else {
        await addShift(formattedData);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving shift: ' + err.message);
    }
  };

  const handleDeleteShift = async () => {
    if (editingShift && window.confirm('Are you sure you want to delete this shift?')) {
      try {
        await deleteShift(editingShift._id || editingShift.id);
        setIsModalOpen(false);
      } catch (err) {
        alert('Error deleting shift: ' + err.message);
      }
    }
  };

  const stats = [
    { label: 'Total Shifts', value: shifts.length, icon: CalendarIcon, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Employees', value: employees.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Attendance', value: '94%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Efficiency', value: '+12%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Weekly Schedule</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Managing <span className="text-primary-600 italic font-semibold">{employees.length} employees</span> for the current week.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button 
            variant="secondary" 
            className="flex-1 sm:flex-none"
            onClick={handleAIOptimize}
            isLoading={isLoading}
          >
            AI Optimizer
          </Button>
          <Button onClick={openCreateModal} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            Create Shift
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} hover className="p-6">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Grid Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-premium overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-7 border-b border-slate-100 divide-x divide-slate-100">
          {weekDays.map((day, i) => (
            <div key={i} className={`p-4 text-center ${format(day, 'MM-dd') === format(today, 'MM-dd') ? 'bg-primary-50/30' : ''}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(day, 'EEE')}</p>
              <p className={`text-lg font-black mt-1 ${format(day, 'MM-dd') === format(today, 'MM-dd') ? 'text-primary-600' : 'text-slate-900'}`}>
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 divide-x divide-slate-100 min-h-[500px]">
          {weekDays.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayShifts = shifts.filter(s => {
              const sDate = s.shiftDate || s.date;
              return sDate && sDate.split('T')[0] === dateStr;
            });
            
            return (
              <div key={i} className={`p-4 space-y-3 bg-slate-50/10 ${format(day, 'MM-dd') === format(today, 'MM-dd') ? 'bg-primary-50/10' : ''}`}>
                {dayShifts.length === 0 ? (
                  <div className="h-full flex items-center justify-center opacity-20 py-10">
                    <p className="text-xs font-bold text-slate-400 rotate-90 whitespace-nowrap">NO SHIFTS</p>
                  </div>
                ) : (
                  dayShifts.map(shift => {
                    const empId = shift.employeeId?._id || shift.employeeId;
                    const emp = employees.find(e => (e._id || e.id) === empId);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={shift._id || shift.id} 
                        onClick={() => openEditModal(shift)}
                        className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-primary-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2.5">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                            {emp?.fullName || emp?.name || 'Unassigned'}
                          </span>
                          <Badge variant="primary" className="text-[10px]">{shift.role}</Badge>
                        </div>
                        <div className="flex items-center text-[10px] font-semibold text-slate-400">
                          <Clock className="h-3 w-3 mr-1.5 opacity-50" />
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingShift ? 'Edit Shift' : 'Create New Shift'}>
        <form onSubmit={handleSaveShift} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <Input label="Date" type="date" value={shiftData.date} onChange={e => setShiftData({...shiftData, date: e.target.value})} required />
            <div className="flex flex-col">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 uppercase tracking-tighter text-[11px]">Assigned Employee</label>
              <select className="flex h-11 w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                value={shiftData.employeeId} onChange={e => setShiftData({...shiftData, employeeId: e.target.value})} required>
                <option value="">Select...</option>
                {employees.map(e => (
                  <option key={e._id || e.id} value={e._id || e.id}>{e.fullName || e.name}</option>
                ))}
              </select>
            </div>
            <Input label="Start Time" type="time" value={shiftData.startTime} onChange={e => setShiftData({...shiftData, startTime: e.target.value})} required />
            <Input label="End Time" type="time" value={shiftData.endTime} onChange={e => setShiftData({...shiftData, endTime: e.target.value})} required />
            <div className="col-span-2">
              <Input label="Role Label" type="text" placeholder="e.g. Server, Lead Cook" value={shiftData.role} onChange={e => setShiftData({...shiftData, role: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-50 pt-6">
            {editingShift && (
              <Button type="button" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700 px-3" onClick={handleDeleteShift}>
                Delete Shift
              </Button>
            )}
            <div className="ml-auto flex space-x-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={isLoading}>{editingShift ? 'Save Changes' : 'Create Shift'}</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}


