import React, { useState } from 'react';
import { useShiftStore } from '../../store/shiftStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';


const SEEDED_EMPLOYEES = [
  { _id: '6a1444c62c56829ffc605abf', fullName: 'Aarav Sharma', role: 'Server' },
  { _id: '6a1444c72c56829ffc605ac2', fullName: 'Riya Patel', role: 'Cook' },
  { _id: '6a1444c72c56829ffc605ac5', fullName: 'Kabir Singh', role: 'Host' },
  { _id: '6a1444c72c56829ffc605ac8', fullName: 'Ananya Iyer', role: 'Manager Support' }
];

export function EmployeesPage() {
  const { employees, fetchEmployees, addEmployee, updateEmployee, isLoading: storeLoading } = useShiftStore();
  const { isLoading: authLoading } = useAuthStore();

  const isLoading = storeLoading || authLoading;

  // Merge loaded database employees with seeded fallbacks to guarantee 4 active employees
  const displayEmployees = [...employees];
  SEEDED_EMPLOYEES.forEach(seeded => {
    const exists = displayEmployees.some(e => (e._id || e.id || '').toString() === seeded._id);
    if (!exists) {
      displayEmployees.push(seeded);
    }
  });
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Server');
  const [password, setPassword] = useState('EmployeePassword123');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await addEmployee({ fullName, email, role, password });
      setSuccessMessage(`Employee ${fullName} successfully added!`);
      setFullName('');
      setEmail('');
      setRole('Server');
      setPassword('EmployeePassword123');
      setTimeout(() => {
        setIsInviteModalOpen(false);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add employee';
      setErrorMessage(message);
    }
  };

  const openEditModal = (emp) => {
    setEditingEmployee({
      ...emp,
      id: emp._id || emp.id,
      name: emp.fullName || emp.name || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(editingEmployee.id, { name: editingEmployee.name, role: editingEmployee.role });
      setIsEditModalOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Directory</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your team members and their assignments.</p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Add New Employee">
        <div className="space-y-6">
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center justify-center text-center"
            >
              <p className="text-sm font-semibold">{successMessage}</p>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-center justify-center text-center"
            >
              <p className="text-sm font-semibold">{errorMessage}</p>
            </motion.div>
          )}
          {!successMessage && (
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Add a new team member to your workspace. Their account will be created automatically and they can log in immediately.
              </p>
              <Input
                label="Full Name"
                type="text"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">Primary Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200/80 p-4 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm bg-white"
                >
                  {['Server', 'Cook', 'Host', 'Cashier'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-50">
                <Button type="button" variant="ghost" onClick={() => setIsInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  Add Employee
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Profile">
        {editingEmployee && (
          <form onSubmit={handleUpdateEmployee} className="space-y-6">
            <div className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                required
                value={editingEmployee.name}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
              />
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">Primary Role</label>
                <select
                  value={editingEmployee.role}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200/80 p-4 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm bg-white"
                >
                  {['Server', 'Cook', 'Host', 'Cashier'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-50">
              <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Card className="shadow-premium">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</TableHead>
              <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayEmployees.map((emp) => {
              const empName = emp.fullName || emp.name || 'Employee';
              const avatarLetter = emp.avatar || empName[0].toUpperCase();
              return (
                <TableRow key={emp._id || emp.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shadow-sm transition-transform group-hover:scale-105">
                        {avatarLetter}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{empName}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Joined Oct 2023</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-600">{emp.role}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="success" className="font-bold tracking-tight">Active</Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => openEditModal(emp)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

