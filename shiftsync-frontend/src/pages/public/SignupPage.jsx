import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignupPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: '',
    password: ''
  });
  
  const register = useAuthStore(state => state.register);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
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
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Start for free.</h2>
            <p className="mt-2 text-sm text-slate-500">
              Join 2,000+ businesses optimizing their staff schedules.
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="p-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <Input
                  label="Business Name"
                  name="businessName"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Blue Bottle Coffee"
                />

                <Input
                  label="Full Name"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                />
                
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Create Business Account
                </Button>
              </div>

              <div className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 underline-offset-4 hover:underline">
                  Log in
                </Link>
              </div>
            </form>
          </div>

          <p className="mt-10 text-center text-[10px] text-slate-400 font-medium">
            By signing up, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Visual Content */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-primary-900 opacity-90"></div>
          
          {/* Subtle Motion Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
          
          <div className="relative z-10 flex h-full flex-col justify-center px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-xl"
            >
              <h1 className="text-5xl font-black tracking-tight text-white mb-8 border-l-4 border-primary-500 pl-8">
                Build a better <br />
                <span className="text-primary-400 italic">workplace culture.</span>
              </h1>
              
              <div className="space-y-8 mt-12">
                {[
                  { title: "One-Click Scheduling", desc: "Automate your weekly rosters with our AI-powered engine." },
                  { title: "Real-time Compliance", desc: "Stay ahead of labor laws with automatic break and overtime tracking." },
                  { title: "Employee Empowerment", desc: "Give your team the flexibility to swap shifts and manage time off." }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="mt-1 h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-none">{feature.title}</h3>
                      <p className="text-slate-400 mt-2 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating Dashboard Card Preview */}
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-[-100px] w-[500px] h-[300px] bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8 shadow-2xl hidden lg:block"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="h-4 w-32 bg-white/10 rounded-full"></div>
              <div className="h-10 w-10 rounded-full bg-primary-500/20 shadow-inner"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-3">
                  <div className="h-2 w-full bg-white/5 rounded-full"></div>
                  <div className="h-24 w-full bg-white/10 rounded-2xl"></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

