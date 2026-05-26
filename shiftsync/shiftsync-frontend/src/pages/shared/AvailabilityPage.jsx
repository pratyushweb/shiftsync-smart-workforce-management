import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useShiftStore } from '../../store/shiftStore';
import { Clock, CheckCircle2, XCircle, Sun, Moon, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function AvailabilityPage() {
  const { availability, fetchAvailability, saveAvailability, isLoading } = useShiftStore();

  const [availabilityList, setAvailabilityList] = useState([
    { id: '1', name: 'Monday', status: 'Available', start: '09:00', end: '17:00', isCustom: false },
    { id: '2', name: 'Tuesday', status: 'Available', start: '09:00', end: '17:00', isCustom: false },
    { id: '3', name: 'Wednesday', status: 'Available', start: '09:00', end: '17:00', isCustom: false },
    { id: '4', name: 'Thursday', status: 'Mornings', start: '09:00', end: '12:00', isCustom: false },
    { id: '5', name: 'Friday', status: 'Available', start: '09:00', end: '17:00', isCustom: false },
    { id: '6', name: 'Saturday', status: 'Unavailable', start: '-', end: '-', isCustom: false },
    { id: '7', name: 'Sunday', status: 'Unavailable', start: '-', end: '-', isCustom: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newSlot, setNewSlot] = useState({
    name: 'Monday',
    status: 'Available',
    start: '09:00',
    end: '17:00',
  });

  React.useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  React.useEffect(() => {
    if (availability && availability.length > 0) {
      setAvailabilityList(availability);
    }
  }, [availability]);

  const handleStatusChange = (id, newStatus) => {
    setAvailabilityList(prev => prev.map(item => {
      if (item.id === id) {
        let start = item.start;
        let end = item.end;
        if (newStatus === 'Unavailable') {
          start = '-';
          end = '-';
        } else if (newStatus === 'Mornings') {
          start = '09:00';
          end = '12:00';
        } else if (newStatus === 'Afternoons') {
          start = '12:00';
          end = '17:00';
        } else if (newStatus === 'Available' && (start === '-' || start === '')) {
          start = '09:00';
          end = '17:00';
        }
        return { ...item, status: newStatus, start, end };
      }
      return item;
    }));
  };

  const handleTimeChange = (id, field, value) => {
    setAvailabilityList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleDeleteRow = (id) => {
    setAvailabilityList(prev => prev.filter(item => item.id !== id));
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const newId = 'custom-' + Date.now();
    setAvailabilityList(prev => [
      ...prev,
      {
        id: newId,
        name: newSlot.name,
        status: newSlot.status,
        start: newSlot.status === 'Unavailable' ? '-' : newSlot.start,
        end: newSlot.status === 'Unavailable' ? '-' : newSlot.end,
        isCustom: true
      }
    ]);
    setIsModalOpen(false);
    // Reset slot inputs
    setNewSlot({
      name: 'Monday',
      status: 'Available',
      start: '09:00',
      end: '17:00',
    });
  };

  const handleSavePreferences = async () => {
    try {
      await saveAvailability(availabilityList);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Weekly Availability</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Define your preferred working hours for scheduling.</p>
        </div>
        <Button 
          onClick={handleSavePreferences}
          isLoading={isLoading}
          className={`w-full sm:w-auto shadow-lg transition-all duration-300 ${
            saveSuccess 
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 hover:shadow-emerald-200 border-none' 
              : 'shadow-primary-100'
          }`}
        >
          {saveSuccess ? '✓ Saved Successfully' : 'Save Preferences'}
        </Button>
      </div>

      <Card className="shadow-premium border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 grid grid-cols-12 gap-4">
          <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Day of Week</div>
          <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</div>
          <div className="col-span-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Preferred Hours</div>
          <div className="col-span-1 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</div>
        </div>

        <div className="divide-y divide-slate-50">
          {availabilityList.map((day, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={day.id} 
              className="px-8 py-5 grid grid-cols-12 gap-4 items-center group hover:bg-slate-50/30 transition-colors"
            >
              <div className="col-span-3">
                <span className="text-sm font-bold text-slate-900">{day.name}</span>
                {day.isCustom && (
                  <span className="ml-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full">
                    Override
                  </span>
                )}
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center space-x-2">
                  {day.status === 'Available' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {day.status === 'Unavailable' && <XCircle className="h-4 w-4 text-red-400" />}
                  {day.status === 'Mornings' && <Sun className="h-4 w-4 text-amber-500" />}
                  {day.status === 'Afternoons' && <Moon className="h-4 w-4 text-indigo-400" />}
                  <select 
                    value={day.status}
                    onChange={(e) => handleStatusChange(day.id, e.target.value)}
                    className="bg-transparent border-none text-sm font-semibold text-slate-600 focus:ring-0 cursor-pointer p-0"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Mornings">Mornings</option>
                    <option value="Afternoons">Afternoons</option>
                  </select>
                </div>
              </div>

              <div className="col-span-5">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm group-hover:border-primary-200 transition-colors">
                    <Clock className="h-3 w-3 text-slate-300 mr-2" />
                    <input 
                      type="text" 
                      value={day.start} 
                      onChange={(e) => handleTimeChange(day.id, 'start', e.target.value)}
                      className="w-12 text-xs font-bold text-slate-600 bg-transparent border-none p-0 focus:ring-0"
                      disabled={day.status === 'Unavailable'}
                    />
                    <span className="mx-2 text-[10px] font-black text-slate-300 uppercase">to</span>
                    <input 
                      type="text" 
                      value={day.end} 
                      onChange={(e) => handleTimeChange(day.id, 'end', e.target.value)}
                      className="w-12 text-xs font-bold text-slate-600 bg-transparent border-none p-0 focus:ring-0"
                      disabled={day.status === 'Unavailable'}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1 text-right">
                {day.isCustom && (
                  <button 
                    onClick={() => handleDeleteRow(day.id)}
                    className="text-slate-300 hover:text-red-500 active:scale-90 transition-all p-1.5 hover:bg-slate-100 rounded-lg animate-fade-in"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic add slot override button */}
        <div className="px-8 py-5 bg-slate-50/20 border-t border-slate-100/60 flex justify-end">
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="secondary"
            className="flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Time Slot Override
          </Button>
        </div>
        
        <div className="bg-slate-50/50 px-8 py-6 border-t border-slate-100">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Moon className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">Smart Night Shifts</p>
              <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                Our AI considers your sleep patterns. You've indicated a preference for morning shifts—night shifts will be automatically de-prioritized.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Availability Rule">
        <form onSubmit={handleAddCustom} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Day of Week</label>
              <select
                required
                className="flex h-12 w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                value={newSlot.name}
                onChange={(e) => setNewSlot({ ...newSlot, name: e.target.value })}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Status</label>
              <select
                required
                className="flex h-12 w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                value={newSlot.status}
                onChange={(e) => {
                  const status = e.target.value;
                  let start = '09:00';
                  let end = '17:00';
                  if (status === 'Unavailable') {
                    start = '-';
                    end = '-';
                  } else if (status === 'Mornings') {
                    start = '09:00';
                    end = '12:00';
                  } else if (status === 'Afternoons') {
                    start = '12:00';
                    end = '17:00';
                  }
                  setNewSlot({ ...newSlot, status, start, end });
                }}
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Mornings">Mornings</option>
                <option value="Afternoons">Afternoons</option>
              </select>
            </div>

            {newSlot.status !== 'Unavailable' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Start Time</label>
                  <input
                    type="text"
                    required
                    className="flex h-12 w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                    value={newSlot.start}
                    onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                    placeholder="e.g. 09:00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">End Time</label>
                  <input
                    type="text"
                    required
                    className="flex h-12 w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                    value={newSlot.end}
                    onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                    placeholder="e.g. 17:00"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-slate-50">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
