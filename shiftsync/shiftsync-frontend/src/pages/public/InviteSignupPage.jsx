import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function InviteSignupPage() {
  const { token } = useParams();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // In a real app we'd validate the token on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    // registration logic
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center">
          <div className="bg-primary-600 p-2 rounded-xl mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Accept Invitation
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Create your account to join your team
          </p>
        </div>

        <Card className="border-0 shadow-soft-lg">
          <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
                
                <Input
                  label="Set Password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
