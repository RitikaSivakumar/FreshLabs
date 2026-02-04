import React, { useState } from 'react';
import { UserRole } from '../types';
import { Briefcase, ShieldCheck, TrendingUp, Users, Lock, ChevronLeft, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const roles = [
    { 
      role: UserRole.CEO_CFO, 
      desc: 'Executive oversight, report approvals, and strategic review.',
      icon: TrendingUp,
      color: 'bg-blue-900/20 text-blue-400 border-blue-800/50'
    },
    { 
      role: UserRole.MANAGER, 
      desc: 'Operational monitoring and tracking of compliance status.',
      icon: Users,
      color: 'bg-indigo-900/20 text-indigo-400 border-indigo-800/50'
    },
    { 
      role: UserRole.AUDITOR, 
      desc: 'Data entry, compliance updates, and audit trails.',
      icon: ShieldCheck,
      color: 'bg-emerald-900/20 text-emerald-400 border-emerald-800/50'
    },
  ];

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '12345') {
      if (selectedRole) onLogin(selectedRole);
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl text-white mb-6 shadow-xl shadow-indigo-900/20">
            <Briefcase size={40} />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">FreshLabs</h1>
          <p className="mt-4 text-slate-400 text-lg max-w-lg mx-auto">
            Finance & Tax Compliance & Revenue Management System.
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {roles.map((item) => (
              <button
                key={item.role}
                onClick={() => handleRoleSelect(item.role)}
                className="group bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-600/50 transition-all duration-300 text-left flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <item.icon size={80} />
                </div>
                <div className={`w-14 h-14 rounded-2xl ${item.color} border flex items-center justify-center mb-6`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">{item.role}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                  {item.desc}
                </p>
                <div className="mt-auto flex items-center text-indigo-400 font-semibold group-hover:translate-x-2 transition-transform">
                  Login as {item.role.split(' ')[0]}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-[#0f172a] p-10 rounded-3xl border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedRole(null)}
              className="flex items-center text-slate-500 hover:text-indigo-400 transition-colors mb-8 font-medium text-sm group"
            >
              <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to roles
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-slate-400 mt-1">Authenticating as <span className="font-bold text-indigo-400">{selectedRole}</span></p>
            </div>

            <form onSubmit={handleLoginAttempt} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    autoFocus
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className={`w-full bg-slate-950 border ${error ? 'border-rose-900 focus:ring-rose-500' : 'border-slate-800 focus:ring-indigo-600'} rounded-xl p-3.5 pl-10 text-sm outline-none transition-all ring-offset-2 ring-offset-slate-900 focus:ring-2 text-slate-100`}
                  />
                </div>
                {error && <p className="mt-2 text-xs font-bold text-rose-500 animate-in shake duration-300">{error}</p>}
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-900/40 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>Authorize Access</span>
                <ArrowRight size={18} />
              </button>
            </form>
            
            <p className="mt-8 text-center text-xs text-slate-500">
              Forgot password? Please contact system administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
