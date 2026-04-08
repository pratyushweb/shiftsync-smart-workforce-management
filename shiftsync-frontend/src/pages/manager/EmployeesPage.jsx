import React, { useState } from 'react';
import { useShiftStore } from '../../store/shiftStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';


export function EmployeesPage() {
  const { employees, updateEmployee } = useShiftStore();
  const { sendInvite, isLoading } = useAuthStore();
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    try {
      await sendInvite(inviteEmail);
      setSuccessMessage(`Invitation successfully sent to ${inviteEmail}`);
      setInviteEmail('');
      setTimeout(() => {
        setIsInviteModalOpen(false);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      // Handle error
    }
  };

  const openEditModal = (emp) => {
    setEditingEmployee({ ...emp });
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = (e) => {
    e.preventDefault();
    updateEmployee(editingEmployee.id, { name: editingEmployee.name, role: editingEmployee.role });
    setIsEditModalOpen(false);
    setEditingEmployee(null);
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

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite New Employee">
        <div className="space-y-6">
          {successMessage ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center justify-center text-center"
            >
              <p className="text-sm font-semibold">{successMessage}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSendInvite} className="space-y-6">
              <p className="text-sm text-slate-500 leading-relaxed">
                Invite a new team member to join your workspace. They'll receive an email with instructions to set up their profile.
              </p>
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  Send Invitation
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
              <Input
                label="Primary Role"
                type="text"
                required
                value={editingEmployee.role}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
              />
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
            {employees.map((emp) => (
              <TableRow key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shadow-sm transition-transform group-hover:scale-105">
                      {emp.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{emp.name}</p>
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
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

