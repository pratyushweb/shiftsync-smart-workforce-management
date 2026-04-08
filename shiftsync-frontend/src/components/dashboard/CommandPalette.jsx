import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Users, Clock, Settings, ArrowRightLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { id: 'create-shift', name: 'Create Shift', icon: Calendar, shortcut: 'S', href: '/dashboard' },
  { id: 'view-employees', name: 'View Employees', icon: Users, shortcut: 'E', href: '/dashboard/employees' },
  { id: 'request-leave', name: 'Request Leave', icon: Clock, shortcut: 'L', href: '/dashboard/leave' },
  { id: 'shift-swaps', name: 'Shift Swaps', icon: ArrowRightLeft, shortcut: 'W', href: '/dashboard/swaps' },
  { id: 'settings', name: 'Settings', icon: Settings, shortcut: ',', href: '/dashboard/profile' },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredActions = actions.filter((action) =>
    action.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAction = (href) => {
    navigate(href);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
          >
            <div className="flex items-center border-b border-slate-100 p-4">
              <Search className="mr-3 h-5 w-5 text-slate-400" />
              <input
                autoFocus
                className="flex-1 border-none bg-transparent p-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm"
                placeholder="Search actions and pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="ml-4 flex items-center space-x-1">
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">ESC</kbd>
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.href)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
                    >
                      <div className="flex items-center">
                        <action.icon className="mr-3 h-4 w-4 text-slate-400 group-hover:text-primary-600" />
                        {action.name}
                      </div>
                      <div className="flex items-center space-x-1 opacity-50">
                        <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold">⌘</kbd>
                        <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold">{action.shortcut}</kbd>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-medium text-slate-500">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <kbd className="mr-1 rounded bg-white px-1 py-0.5 shadow-sm border border-slate-200">↑↓</kbd> to navigate
                </span>
                <span className="flex items-center">
                  <kbd className="mr-1 rounded bg-white px-1 py-0.5 shadow-sm border border-slate-200">↵</kbd> to select
                </span>
              </div>
              <span>Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
