import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShiftStore } from '../../store/shiftStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Users, Calendar as CalendarIcon, Clock, ArrowRightLeft, 
  ArrowRight, Shield, Zap, Bell, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ManagerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    shifts, 
    employees, 
    swaps,
    fetchShifts, 
    fetchEmployees, 
    fetchSwaps 
  } = useShiftStore();

  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  const today = new Date();
  const weekStart = new startOfWeek(today, { weekStartsOn: 1 });

  useEffect(() => {
    fetchShifts(weekStart);
    fetchEmployees();
    fetchSwaps();
    
    // Fetch pending leaves count
    const fetchLeaves = async () => {
      setLoadingLeaves(true);
      try {
        const response = await api.get('/leave');
        const pending = response.data.data.filter(l => l.status?.toLowerCase() === 'pending');
        setPendingLeavesCount(pending.length);
      } catch (err) {
        console.error('Failed to fetch leave requests', err);
      } finally {
        setLoadingLeaves(false);
      }
    };
    fetchLeaves();
  }, []);

  // Helper helper to get start of week since startOfWeek imported from date-fns
  function startOfWeek(date, options) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  const pendingSwapsCount = swaps.filter(s => s.status?.toLowerCase() === 'pending').length;

  const stats = [
    { 
      label: 'Active Team Members', 
      value: employees.length || 4, 
      icon: Users, 
      color: 'text-primary-600', 
      bg: 'bg-primary-50',
      action: () => navigate('/dashboard/employees')
    },
    { 
      label: 'Shifts Scheduled This Week', 
      value: shifts.length, 
      icon: CalendarIcon, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      action: () => navigate('/dashboard/shifts')
    },
    { 
      label: 'Pending Leaves', 
      value: pendingLeavesCount, 
      icon: Shield, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50',
      badge: pendingLeavesCount > 0 ? 'Action Needed' : null,
      badgeColor: 'danger',
      action: () => navigate('/dashboard/leave')
    },
  ];

  const quickActions = [
    {
      title: 'Schedule Roster',
      desc: 'Plan shifts and assign team members for the upcoming week.',
      icon: CalendarIcon,
      color: 'bg-primary-500 text-white',
      action: () => navigate('/dashboard/shifts')
    },
    {
      title: 'Review Leaves',
      desc: 'Approve or reject pending holiday and time-off requests.',
      icon: Shield,
      color: 'bg-rose-500 text-white',
      action: () => navigate('/dashboard/leave')
    },
    {
      title: 'Add Employees',
      desc: 'Invite new team members and assign their standard job roles.',
      icon: Users,
      color: 'bg-indigo-500 text-white',
      action: () => navigate('/dashboard/employees')
    }
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name?.split(' ')[0] || 'Manager'}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Here is your workforce management overview for today.
          </p>
        </div>
        <div className="flex items-center space-x-2.5 bg-emerald-50 text-emerald-700 font-bold text-xs py-2 px-4 rounded-2xl border border-emerald-100 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i}
          >
            <Card hover className="p-6 cursor-pointer border-slate-100/60 shadow-sm hover:shadow-premium" onClick={stat.action}>
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                {stat.badge && (
                  <Badge variant={stat.badgeColor} className="font-bold tracking-tight uppercase px-2 text-[9px]">
                    {stat.badge}
                  </Badge>
                )}
              </div>
              <div className="mt-6">
                <p className="text-3xl font-black text-slate-950 tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Quick Actions & Coverage Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Launchpad */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Quick Actions</h2>
          <div className="grid gap-4">
            {quickActions.map((action, i) => (
              <Card key={i} hover className="p-5 border-slate-100 shadow-sm flex items-start gap-4 cursor-pointer group hover:border-primary-100" onClick={action.action}>
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1 pr-6 relative w-full">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{action.title}</h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">{action.desc}</p>
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Schedule Health Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Weekly Coverage Health</h2>
          <Card className="p-6 border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-bold text-slate-900">Shift Coverage Level</h3>
                <p className="text-xs font-medium text-slate-500">Distribution of assigned workforce shifts across weekdays.</p>
              </div>
              <div className="h-9 px-3 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[10px] uppercase rounded-xl flex items-center justify-center">
                Optimal Level
              </div>
            </div>

            <div className="space-y-5">
              {[
                { day: 'Mon', count: shifts.filter(s => new Date(s.shiftDate || s.date).getDay() === 1).length, target: 4 },
                { day: 'Tue', count: shifts.filter(s => new Date(s.shiftDate || s.date).getDay() === 2).length, target: 4 },
                { day: 'Wed', count: shifts.filter(s => new Date(s.shiftDate || s.date).getDay() === 3).length, target: 4 },
                { day: 'Thu', count: shifts.filter(s => new Date(s.shiftDate || s.date).getDay() === 4).length, target: 4 },
                { day: 'Fri', count: shifts.filter(s => new Date(s.shiftDate || s.date).getDay() === 5).length, target: 5 },
                { day: 'Sat', count: shifts.filter(s => new Date(s.shiftDate || s.date).getDay() === 6).length, target: 6 },
                { day: 'Sun', count: shifts.filter(s => new Date(s.shiftDate || s.date).getDay() === 0).length, target: 0 },
              ].map((item, idx) => {
                const percentage = item.target > 0 ? Math.min(100, Math.round((item.count / item.target) * 100)) : 100;
                let barColor = 'bg-primary-500';
                if (percentage < 50) barColor = 'bg-rose-500';
                else if (percentage < 100) barColor = 'bg-amber-500';

                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="w-10 text-xs font-bold text-slate-500 uppercase">{item.day}</span>
                    <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden relative">
                      <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${item.day === 'Sun' ? 0 : Math.max(5, percentage)}%` }}></div>
                    </div>
                    <span className="w-14 text-right text-xs font-bold text-slate-800 leading-none">
                      {item.day === 'Sun' ? 'Off' : `${item.count} / ${item.target}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>

      {/* Recent Activity Logs */}
      <div className="space-y-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Live Activity Feed</h2>
        <Card className="p-0 border-slate-100/60 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
            {[
              { type: 'shift', text: `Scheduled ${shifts.length} shifts for the week roster.`, time: 'Updated just now', icon: CalendarIcon, color: 'text-primary-600 bg-primary-50' },
              { type: 'leave', text: pendingLeavesCount > 0 ? `You have ${pendingLeavesCount} employee time-off requests pending review.` : 'All employee leave requests have been processed.', time: 'Synced 1 min ago', icon: Shield, color: 'text-rose-600 bg-rose-50' },
            ].map((activity, i) => (
              <div key={i} className="p-5 flex items-start gap-4 hover:bg-slate-50/30 transition-colors">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <activity.icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">{activity.text}</p>
                  <p className="text-[10px] font-medium text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
