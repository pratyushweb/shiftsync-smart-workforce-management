import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'New Shift Assigned',
    description: 'You have been assigned a server shift for Saturday.',
    time: '2 hours ago',
    icon: Clock,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    id: 2,
    title: 'Leave Request Approved',
    description: 'Your request for time off on Oct 20 has been approved.',
    time: '5 hours ago',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    id: 3,
    title: 'Shift Swap Request',
    description: 'Charlie Davis wants to swap their shift with you.',
    time: '1 day ago',
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

export function NotificationDropdown({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 z-50 overflow-hidden rounded-2xl bg-white shadow-premium border border-slate-100"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                3 New
              </span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex space-x-3">
                    <div className={`h-8 w-8 rounded-full ${notification.bg} flex items-center justify-center`}>
                      <notification.icon className={`h-4 w-4 ${notification.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {notification.description}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 text-center text-xs font-semibold text-primary-600 hover:bg-slate-50 transition-colors border-t border-slate-100">
              View All Notifications
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
