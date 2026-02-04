import React from 'react';
import { UserRole } from '../types';
import { LayoutDashboard, ShieldCheck, Banknote, FileBarChart, LogOut, Briefcase, History, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
  role: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, role, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'compliance', label: 'Compliance Tracker', icon: ShieldCheck },
    { id: 'revenue', label: 'Revenue Records', icon: Banknote },
    { id: 'reports', label: 'Audit Reports', icon: FileBarChart },
    { id: 'audit-trail', label: 'Audit Trail', icon: History },
    { id: 'settings', label: 'User Preferences', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-full flex flex-col no-print">
      <div className="p-6 flex items-center space-x-3 text-white">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Briefcase size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-indigo-50">FreshLabs</span>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-4 py-2 bg-slate-800/50 rounded-lg text-xs uppercase tracking-wider font-bold text-slate-500">
          User Role: {role}
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
