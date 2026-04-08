import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <motion.div 
          className="container mx-auto px-4 text-center md:px-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants} className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
            Smarter Shift Scheduling for <span className="text-primary-600">Modern Teams</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            ShiftSync empowers managers to build schedules in minutes, while giving employees the flexibility to swap shifts and manage their time—all in one seamless platform.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/signup">
              <Button size="lg" className="rounded-full shadow-soft-lg group">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="#features" className="text-sm font-semibold leading-6 text-slate-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white sm:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              No more scheduling headaches
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {[
                { name: 'Visual Calendar', description: 'Drag and drop shifts with confidence. Powerful tools to handle time off and team availability natively.', icon: Calendar },
                { name: 'Shift Swapping', description: 'Employee-driven shift swaps completely eliminate the back-and-forth headache for managers.', icon: ArrowRight },
                { name: 'Clock In / Out', description: 'Real-time attendance tracking integrated automatically with the schedule layout.', icon: Clock },
                { name: 'Team Hub', description: 'A centralized space to view notices, send announcements, and keep the team connected.', icon: Users },
              ].map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-slate-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-slate-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
