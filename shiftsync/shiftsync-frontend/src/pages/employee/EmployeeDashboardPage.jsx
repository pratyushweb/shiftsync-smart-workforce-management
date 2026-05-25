import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useShiftStore } from '../../store/shiftStore';
import { format, addDays, startOfWeek } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Clock, CheckCircle, ArrowRight, Play, Square, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';


export function EmployeeDashboardPage() {
  const { user } = useAuthStore();
  const { shifts } = useShiftStore();

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // In a real app we'd fetch this from backend based on user ID
  const myShifts = shifts.filter(s => s.employeeId === (user?.id || 2));
  
  const todayShift = myShifts.find(s => s.date.split('T')[0] === today.toISOString().split('T')[0]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Good Morning, {user?.name?.split(' ')[0] || 'Employee'}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Here is your schedule for the current week.</p>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
            <Badge variant="primary" className="h-6 px-2 text-[10px] font-black uppercase">Active</Badge>
        </div>
      </div>

      {todayShift && (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <Card className="bg-slate-900 overflow-hidden border-0 shadow-2xl relative group">
              {/* Decorative Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-indigo-900 to-slate-900 opacity-90 transition-opacity duration-1000 group-hover:opacity-100"></div>
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-primary-400 opacity-20 blur-[100px] rounded-full"></div>
              
              <div className="relative z-10 p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Ongoing Shift</span>
                  </div>
                  <h2 className="text-5xl font-black text-white leading-none">
                    {todayShift.startTime} <span className="text-primary-400/50">—</span> {todayShift.endTime}
                  </h2>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <Badge className="bg-white/10 text-white border-0 py-1.5 px-3 font-bold">{todayShift.role}</Badge>
                    </div>
                    <div className="flex items-center text-primary-200 text-sm font-semibold">
                      <Clock className="h-4 w-4 mr-2" />
                      8:00 Hours Scheduled
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 border-0 h-16 px-10 rounded-2xl text-lg font-black group/btn">
                    <Play className="mr-3 h-6 w-6 fill-current transition-transform group-hover/btn:scale-110" />
                    Clock In
                  </Button>
                  <Button variant="outline" size="lg" className="h-16 px-8 rounded-2xl border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-lg font-bold">
                    View Instructions
                  </Button>
                </div>
              </div>
            </Card>
        </motion.div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Your Weekly Grid</h2>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase">
                <span className="h-2 w-2 rounded-full bg-primary-500"></span>
                <span>My Shifts</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5">
          {weekDays.map((day, i) => {
            const shift = myShifts.find(s => s.date.split('T')[0] === day.toISOString().split('T')[0]);
            const isToday = format(day, 'MM-dd') === format(today, 'MM-dd');
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i}
              >
                <Card className={`p-0 overflow-hidden h-full group transition-all duration-300 ${isToday && shift ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-white' : 'border-slate-100 hover:border-primary-200 hover:shadow-premium'}`}>
                   <div className={`p-4 text-center border-b ${isToday ? 'bg-primary-50 border-primary-100' : 'bg-slate-50/50 border-slate-50'}`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-primary-600' : 'text-slate-400'}`}>{format(day, 'EEE')}</p>
                      <p className={`text-xl font-black mt-0.5 ${isToday ? 'text-primary-600' : 'text-slate-900'}`}>{format(day, 'd')}</p>
                   </div>
                   
                   <div className="p-4 flex flex-col h-[140px]">
                      {shift ? (
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <Badge variant="primary" className="text-[10px] font-bold mb-3">{shift.role}</Badge>
                            <p className="text-sm font-black text-slate-900">{shift.startTime} — {shift.endTime}</p>
                          </div>
                          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            <Clock className="h-3 w-3 mr-1.5 opacity-50" />
                            8.5hr Length
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 group-hover:opacity-50 transition-opacity">
                            <XCircle className="h-5 w-5 text-slate-300 mb-2" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Day Off</p>
                        </div>
                      )}
                   </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-slate-50/50 rounded-3xl p-8 border border-dashed border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-500">
                  <CheckCircle className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Weekly Performance</h3>
                  <p className="text-sm font-medium text-slate-500">You've completed 100% of your shifts this week. Keep it up!</p>
              </div>
          </div>
          <Button variant="secondary" className="bg-white group/arrow px-6">
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/arrow:translate-x-1" />
          </Button>
      </div>
    </div>
  );
}

