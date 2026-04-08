import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Clock, CheckCircle2, XCircle, Sun, Moon, ToggleLeft } from 'lucide-react';
import { motion } from 'framer-motion';


export function AvailabilityPage() {
  const days = [
    { name: 'Monday', status: 'Available', start: '09:00', end: '17:00' },
    { name: 'Tuesday', status: 'Available', start: '09:00', end: '17:00' },
    { name: 'Wednesday', status: 'Available', start: '09:00', end: '17:00' },
    { name: 'Thursday', status: 'Mornings', start: '09:00', end: '12:00' },
    { name: 'Friday', status: 'Available', start: '09:00', end: '17:00' },
    { name: 'Saturday', status: 'Unavailable', start: '-', end: '-' },
    { name: 'Sunday', status: 'Unavailable', start: '-', end: '-' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Weekly Availability</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Define your preferred working hours for scheduling.</p>
        </div>
        <Button className="w-full sm:w-auto shadow-lg shadow-primary-100">
          Save Preferences
        </Button>
      </div>

      <Card className="shadow-premium border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 grid grid-cols-12 gap-4">
          <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Day of Week</div>
          <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</div>
          <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Preferred Hours</div>
          <div className="col-span-2 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Auto-Apply</div>
        </div>

        <div className="divide-y divide-slate-50">
          {days.map((day, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={day.name} 
              className="px-8 py-5 grid grid-cols-12 gap-4 items-center group hover:bg-slate-50/30 transition-colors"
            >
              <div className="col-span-3">
                <span className="text-sm font-bold text-slate-900">{day.name}</span>
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center space-x-2">
                  {day.status === 'Available' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {day.status === 'Unavailable' && <XCircle className="h-4 w-4 text-red-400" />}
                  {day.status === 'Mornings' && <Sun className="h-4 w-4 text-amber-500" />}
                  <select className="bg-transparent border-none text-sm font-semibold text-slate-600 focus:ring-0 cursor-pointer p-0">
                    <option>Available</option>
                    <option>Unavailable</option>
                    <option>Mornings</option>
                    <option>Afternoons</option>
                  </select>
                </div>
              </div>

              <div className="col-span-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm group-hover:border-primary-200 transition-colors">
                    <Clock className="h-3 w-3 text-slate-300 mr-2" />
                    <input 
                      type="text" 
                      defaultValue={day.start} 
                      className="w-12 text-xs font-bold text-slate-600 bg-transparent border-none p-0 focus:ring-0"
                      disabled={day.status === 'Unavailable'}
                    />
                    <span className="mx-2 text-[10px] font-black text-slate-300 uppercase">to</span>
                    <input 
                      type="text" 
                      defaultValue={day.end} 
                      className="w-12 text-xs font-bold text-slate-600 bg-transparent border-none p-0 focus:ring-0"
                      disabled={day.status === 'Unavailable'}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2 text-right">
                <button className="text-slate-200 hover:text-primary-500 transition-colors">
                  <ToggleLeft className="h-6 w-6" />
                </button>
              </div>
            </motion.div>
          ))}
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
    </div>
  );
}

