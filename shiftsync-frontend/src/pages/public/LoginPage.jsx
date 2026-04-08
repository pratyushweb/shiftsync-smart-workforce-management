import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Calendar, Bell } from 'lucide-react';

import { motion } from 'framer-motion';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <div className="flex min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900 overflow-hidden font-sans">
      {/* Left Side: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <div className="mb-10 flex items-center space-x-2.5">
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-200">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 italic">ShiftSync</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to manage your workforce
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-500 underline-offset-4 hover:underline">
                      Forgot?
                    </a>
                  </div>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Sign in
                </Button>
              </div>

              <p className="text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500 underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between grayscale opacity-50 contrast-125">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Trusted by teams at</p>
            <div className="flex space-x-4">
              <span className="text-xs font-black">LINEAR</span>
              <span className="text-xs font-black">NOTION</span>
              <span className="text-xs font-black">STRIPE</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Visual Content */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-slate-900 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 via-slate-900 to-indigo-900 opacity-90 transition-opacity duration-1000 group-hover:opacity-100"></div>
          
          {/* Abstract Grid Pattern */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="max-w-md"
            >
              <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/10 mb-8">
                <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse"></span>
                <span>New: AI Auto-Scheduler v2.0</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 leading-[1.1]">
                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-300">perfect schedule.</span>
              </h1>
              <p className="text-lg text-slate-300 font-medium leading-relaxed">
                ShiftSync gives you the tools to schedule employees, track attendance, and manage leave—all in one beautiful interface.
              </p>
              
              <div className="mt-12 grid grid-cols-2 gap-4">
                {[
                  { label: "AI Optimization", val: "99.9%" },
                  { label: "Active Teams", val: "2k+" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="text-2xl font-bold">{stat.val}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-20 w-80 h-96 bg-white shadow-2xl rounded-3xl overflow-hidden border border-white/20 p-6 hidden xl:block"
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-amber-400"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-2/3 bg-slate-100 rounded-lg"></div>
              <div className="h-24 w-full bg-slate-50 rounded-2xl p-4 flex flex-col justify-end">
                <div className="h-2 w-1/2 bg-primary-200 rounded-full mb-2"></div>
                <div className="h-4 w-3/4 bg-primary-600 rounded-lg"></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-16 bg-slate-50 rounded-xl"></div>
                <div className="h-16 bg-slate-50 rounded-xl font-bold flex items-center justify-center text-primary-600 text-sm">24</div>
                <div className="h-16 bg-slate-50 rounded-xl"></div>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <div className="h-2 w-1/4 bg-slate-100 rounded-full"></div>
                <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

