import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { 
  Calendar, LayoutDashboard, Users, Clock, 
  Settings, Bell, LogOut, Menu, X, ArrowRightLeft, Search
} from 'lucide-react';
import { NotificationDropdown } from '../components/dashboard/NotificationDropdown';
import { CommandPalette } from '../components/dashboard/CommandPalette';
import { useAuthStore } from '../store/authStore';

export function DashboardLayout({ role = 'manager' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const location = useLocation();

  const managerLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', href: '/dashboard/employees', icon: Users },
    { name: 'Shifts', href: '/dashboard/shifts', icon: Calendar },
    { name: 'Leave Requests', href: '/dashboard/leave', icon: Clock },
    { name: 'Shift Swaps', href: '/dashboard/swaps', icon: ArrowRightLeft },
  ];

  const employeeLinks = [
    { name: 'My Schedule', href: '/dashboard', icon: Calendar },
    { name: 'Availability', href: '/dashboard/availability', icon: Clock },
    { name: 'Swap Requests', href: '/dashboard/swaps', icon: ArrowRightLeft },
    { name: 'Time Off', href: '/dashboard/leave', icon: Users },
  ];

  const links = role === 'manager' ? managerLinks : employeeLinks;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-primary-100 selection:text-primary-900">
      <CommandPalette />
      
      {/* Sidebar Desktop */}
      <aside className="hidden w-72 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl md:flex">
        <div className="flex h-16 items-center px-8 border-b border-slate-100/50">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-200 transform group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ShiftSync</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
          <nav className="space-y-1.5">
            {links.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-primary-50/50 text-primary-700 shadow-sm shadow-primary-100/50" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <link.icon className={cn("mr-3.5 h-5 w-5 transition-colors duration-200", isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-slate-100/50 space-y-2">
          <Link to="/dashboard/profile" className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="mr-3.5 h-5 w-5 text-slate-400" />
            Settings
          </Link>
          <button 
            onClick={logout}
            className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3.5 h-5 w-5 text-red-500/80" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-xl px-6 md:px-10 z-30">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-500 md:hidden hover:bg-slate-50 rounded-xl transition-colors">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex items-center px-3.5 py-2 bg-slate-100/50 border border-slate-200/50 rounded-xl cursor-not-allowed group transition-all hover:bg-slate-100">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-slate-500 mr-2.5" />
              <span className="text-sm text-slate-400 group-hover:text-slate-500 mr-8">Search anything...</span>
              <kbd className="hidden sm:inline-flex items-center rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200">⌘K</kbd>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-5 ml-auto">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all",
                  isNotificationsOpen && "bg-slate-100 text-slate-900"
                )}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500 border-[2.5px] border-white ring-1 ring-red-200"></span>
              </button>
              <NotificationDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
            </div>
            <div className="h-6 w-px bg-slate-200/50 hidden sm:block"></div>
            <div className="flex items-center space-x-3 group cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-slate-900 leading-none">{user?.name || 'User'}</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter mt-1">{user?.role || 'Member'}</span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 p-0.5 shadow-lg shadow-primary-200">
                <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center text-primary-700 font-bold text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.99, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: 5 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col z-[60] md:hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
                <span className="text-xl font-bold tracking-tight text-slate-900">ShiftSync</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="space-y-1.5">
                  {links.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all group",
                        location.pathname === link.href ? "bg-primary-50 text-primary-700" : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <link.icon className={cn("mr-3.5 h-5 w-5", location.pathname === link.href ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

