import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { User, Shield, Key, Bell, Camera } from 'lucide-react';
import { motion } from 'framer-motion';


export function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your professional profile and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Secondary Navigation/Info */}
        <div className="space-y-6">
          <Card className="p-1 border-slate-100 shadow-premium">
            <nav className="flex flex-col">
              {[
                { label: 'Profile Information', icon: User, active: true },
                { label: 'Security', icon: Key, active: false },
                { label: 'Notifications', icon: Bell, active: false },
                { label: 'Compliance', icon: Shield, active: false },
              ].map((item, i) => (
                <button
                  key={i}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    item.active 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${item.active ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Right Col: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-slate-100 shadow-premium">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-8 border-b border-slate-50">
              <div className="relative group">
                <div className="h-24 w-24 rounded-[32px] bg-gradient-to-tr from-primary-600 to-indigo-600 p-1 shadow-xl shadow-primary-100 transform transition-transform group-hover:scale-105">
                  <div className="h-full w-full rounded-[28px] bg-white flex items-center justify-center text-primary-700 font-black text-3xl">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-500 hover:text-primary-600 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-900">{user?.name || 'User Name'}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-2 space-x-3">
                  <Badge variant="primary" className="font-bold tracking-tight uppercase px-2.5">
                    {user?.role || 'Member'}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee ID: #SS-4829</span>
                </div>
              </div>
            </div>

            <form className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Full Name" defaultValue={user?.name} />
                <Input label="Email Address" type="email" defaultValue={user?.email} />
                <div className="sm:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Bio / Professional Summary</label>
                  <textarea 
                    className="w-full rounded-2xl border border-slate-200/80 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                    rows={3}
                    placeholder="Briefly describe your role and experience..."
                  ></textarea>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-50 flex justify-end">
                <Button>Update Profile</Button>
              </div>
            </form>
          </Card>

          <Card className="p-8 border-slate-100 shadow-premium">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                <Key className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Security Credentials</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3">
              <Shield className="h-5 w-5 text-slate-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700 tracking-tight">Two-Factor Authentication</p>
                <p className="text-[10px] text-slate-500 font-medium">Add an extra layer of security to your account by enabling 2FA.</p>
                <button className="text-[10px] font-bold text-primary-600 hover:text-primary-500 transition-colors mt-2">Enable Now →</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

