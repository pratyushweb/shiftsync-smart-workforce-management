import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';
import { InviteSignupPage } from './pages/public/InviteSignupPage';

// Manager Pages
import { ManagerDashboardPage } from './pages/manager/ManagerDashboardPage';
import { EmployeesPage } from './pages/manager/EmployeesPage';

// Employee Pages
import { EmployeeDashboardPage } from './pages/employee/EmployeeDashboardPage';

// Shared Pages
import { AvailabilityPage } from './pages/shared/AvailabilityPage';
import { ShiftSwapPage } from './pages/shared/ShiftSwapPage';
import { LeaveRequestsPage } from './pages/shared/LeaveRequestsPage';
import { ProfilePage } from './pages/shared/ProfilePage';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'manager') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function RoleBasedDashboard() {
  const { user } = useAuthStore();
  
  if (user?.role === 'manager') {
    return <ManagerDashboardPage />;
  }
  return <EmployeeDashboardPage />;
}

function App() {
  const user = useAuthStore(state => state.user);
  const checkSession = useAuthStore(state => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);


  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/invite/:token" element={<InviteSignupPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout role={user?.role} />
          </ProtectedRoute>
        }>
          <Route index element={<RoleBasedDashboard />} />
          
          {/* Manager Only */}
          <Route path="employees" element={
            <ProtectedRoute requiredRole="manager">
              <EmployeesPage />
            </ProtectedRoute>
          } />
          <Route path="shifts" element={
            <ProtectedRoute requiredRole="manager">
              <ManagerDashboardPage />
            </ProtectedRoute>
          } />

          {/* Shared */}
          <Route path="availability" element={<AvailabilityPage />} />
          <Route path="swaps" element={<ShiftSwapPage />} />
          <Route path="leave" element={<LeaveRequestsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
