import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ShiftSync</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="inline-flex h-9 items-center justify-center rounded-xl bg-primary-600 px-4 text-sm font-medium text-white shadow-soft transition-colors hover:bg-primary-700">
              Sign up
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center md:px-6">
          <p className="text-sm text-slate-500">© 2026 ShiftSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
