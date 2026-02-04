import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, User, ComplianceRecord, RevenueRecord, ComplianceStatus, AuditLog, UserPreferences, Notification } from './types';
import { MOCK_COMPLIANCES, MOCK_REVENUE } from './constants';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AuditorDashboard from './pages/AuditorDashboard';
import CompliancePage from './pages/CompliancePage';
import RevenuePage from './pages/RevenuePage';
import ReportsPage from './pages/ReportsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AlertModal from './components/AlertModal';
import Toast, { ToastType } from './components/Toast';
import SplashAnimation from './components/SplashAnimation';

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultFrequencyFilter: 'All',
  preferredReportFormat: 'PDF',
  visibleWidgets: {
    statsSummary: true,
    compliancePieChart: true,
    pendingTable: true,
    deadlineTracker: true,
  },
  notifications: {
    types: {
      missedDeadlines: true,
      newRemarks: true,
      upcomingDeadlines: true,
      revenueAlerts: false,
    },
    channels: {
      inApp: true,
      email: true,
    },
  },
};

const calculateDelayDays = (dueDateStr: string, actualDateStr: string): number => {
  const actualDate = new Date(actualDateStr);
  let dueDate: Date;

  if (dueDateStr.length <= 2) {
    const day = parseInt(dueDateStr);
    dueDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), day);
  } else {
    dueDate = new Date(dueDateStr);
  }

  actualDate.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = actualDate.getTime() - dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'compliance' | 'revenue' | 'reports' | 'audit-trail' | 'settings'>('dashboard');
  const [compliances, setCompliances] = useState<ComplianceRecord[]>(MOCK_COMPLIANCES);
  const [revenues, setRevenues] = useState<RevenueRecord[]>(MOCK_REVENUE);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('freshlabs_splash_seen');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('freshlabs_splash_seen', 'true');
  };

  const handleLogin = (role: UserRole) => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Demo ${role.split(' ')[0]}`,
      email: `${role.toLowerCase().replace(' ', '')}@freshlabs.com`,
      role: role,
      preferences: { ...DEFAULT_PREFERENCES }
    };
    setCurrentUser(user);
    
    // Auto-generate reminders on login
    generateReminders(user);

    const pendingCount = compliances.filter(c => c.status === ComplianceStatus.NOT_COMPLETED).length;
    if (pendingCount > 0 && user.preferences.notifications.types.missedDeadlines) {
      setTimeout(() => setIsAlertOpen(true), 1500);
    }
  };

  const generateReminders = (user: User) => {
    if (!user.preferences.notifications.channels.inApp) {
      setNotifications([]);
      return;
    }

    const today = new Date();
    const newNotifications: Notification[] = [];

    compliances.forEach(comp => {
      let dueDate: Date;
      if (comp.dueDate.length <= 2) {
        dueDate = new Date(today.getFullYear(), today.getMonth(), parseInt(comp.dueDate));
      } else {
        dueDate = new Date(comp.dueDate);
      }

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (comp.status !== ComplianceStatus.COMPLETED) {
        if (diffDays < 0 && user.preferences.notifications.types.missedDeadlines) {
          newNotifications.push({
            id: `notif-overdue-${comp.id}`,
            title: 'Critical Overdue Task',
            message: `${comp.name} is ${Math.abs(diffDays)} days past due.`,
            type: 'urgent',
            timestamp: new Date().toISOString(),
            read: false,
            targetId: comp.id
          });
        } else if (diffDays >= 0 && diffDays <= 3 && user.preferences.notifications.types.upcomingDeadlines) {
          newNotifications.push({
            id: `notif-reminder-${comp.id}`,
            title: 'Upcoming Deadline',
            message: `${comp.name} is due in ${diffDays} days.`,
            type: 'reminder',
            timestamp: new Date().toISOString(),
            read: false,
            targetId: comp.id
          });
        }
      }
    });

    setNotifications(newNotifications);
    if (newNotifications.length > 0) {
      showToast(`Automated reminders generated: ${newNotifications.length} items`, 'info');
    }
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    setIsAlertOpen(false);
    setNotifications([]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updatePreferences = (prefs: UserPreferences) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, preferences: prefs });
      showToast('Dashboard preferences updated', 'info');
      // Regenerate reminders if notification settings changed
      generateReminders({ ...currentUser, preferences: prefs });
    }
  };

  const updateCompliance = (id: string, updates: Partial<ComplianceRecord>) => {
    if (!currentUser) return;

    setCompliances(prev => {
      const oldRecord = prev.find(c => c.id === id);
      if (!oldRecord) return prev;

      let finalUpdates = { ...updates };

      if (updates.actualCompletionDate) {
        finalUpdates.delayDays = calculateDelayDays(oldRecord.dueDate, updates.actualCompletionDate);
      }

      const changes: AuditLog['changes'] = [];
      Object.keys(finalUpdates).forEach((key) => {
        const field = key as keyof ComplianceRecord;
        if (finalUpdates[field] !== (oldRecord as any)[field]) {
          changes.push({
            field,
            oldValue: (oldRecord as any)[field],
            newValue: (finalUpdates as any)[field],
          });
        }
      });

      if (changes.length > 0) {
        const newLog: AuditLog = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: 'Updated Compliance',
          targetId: id,
          targetName: oldRecord.name,
          changes,
        };
        setAuditLogs(prevLogs => [newLog, ...prevLogs]);
        showToast(`Updated: ${oldRecord.name}`, 'success');

        // Check for "new remarks" notification trigger
        if (updates.leadershipRemarks && currentUser.preferences.notifications.types.newRemarks) {
          // In a real app, this would notify other users. Here we might toast or similar.
        }
      }

      return prev.map(c => c.id === id ? { ...c, ...finalUpdates, lastUpdated: new Date().toISOString() } : c);
    });
  };

  const addRevenue = (record: RevenueRecord) => {
    if (!currentUser) return;

    setRevenues(prev => [...prev, record]);
    showToast(`Added ₹${record.amount.toLocaleString()} from ${record.source}`, 'success');

    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Added Revenue Entry',
      targetId: record.id,
      targetName: record.source,
      changes: [{ field: 'amount', oldValue: null, newValue: record.amount }],
    };
    setAuditLogs(prevLogs => [newLog, ...prevLogs]);

    if (currentUser.preferences.notifications.types.revenueAlerts) {
       // logic for revenue alerts
    }
  };

  if (showSplash) {
    return <SplashAnimation onComplete={handleSplashComplete} />;
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return currentUser.role === UserRole.AUDITOR 
          ? <AuditorDashboard compliances={compliances} updateCompliance={updateCompliance} notifications={notifications} showToast={showToast} />
          : <Dashboard 
              compliances={compliances} 
              revenues={revenues} 
              role={currentUser.role} 
              onAddRemark={updateCompliance}
              preferences={currentUser.preferences}
              notifications={notifications}
            />;
      case 'compliance':
        return <CompliancePage compliances={compliances} userRole={currentUser.role} onUpdate={updateCompliance} />;
      case 'revenue':
        return <RevenuePage revenues={revenues} userRole={currentUser.role} onAdd={addRevenue} />;
      case 'reports':
        return <ReportsPage compliances={compliances} revenues={revenues} />;
      case 'audit-trail':
        return <AuditTrailPage logs={auditLogs} />;
      case 'settings':
        return <SettingsPage preferences={currentUser.preferences} onUpdate={updatePreferences} />;
      default:
        return <Dashboard 
                  compliances={compliances} 
                  revenues={revenues} 
                  role={currentUser.role} 
                  onAddRemark={updateCompliance}
                  preferences={currentUser.preferences}
                  notifications={notifications}
               />;
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        role={currentUser.role} 
        onLogout={handleLogout} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar 
          user={currentUser} 
          viewName={currentView} 
          notifications={notifications} 
          markRead={markNotificationRead} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>

      <AlertModal 
        isOpen={isAlertOpen} 
        onClose={() => setIsAlertOpen(false)} 
        pendingTasks={compliances.filter(c => c.status !== ComplianceStatus.COMPLETED)} 
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;