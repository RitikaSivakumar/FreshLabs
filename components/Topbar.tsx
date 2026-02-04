
import React, { useState } from 'react';
import { User, Notification } from '../types';
import { Bell, Search, User as UserIcon, CalendarClock, AlertCircle, CheckCircle } from 'lucide-react';

interface TopbarProps {
  user: User;
  viewName: string;
  notifications: Notification[];
  markRead: (id: string) => void;
}

const Topbar: React.FC<TopbarProps> = ({ user, viewName, notifications, markRead }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-8 no-print relative z-[60]">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-slate-100 capitalize">{viewName}</h2>
        <div className="h-6 w-px bg-slate-800 mx-2" />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search reports or items..." 
            className="pl-10 pr-4 py-1.5 bg-slate-950 border-transparent focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 rounded-lg text-sm transition-all outline-none w-64 text-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-slate-400 hover:text-indigo-400 transition-colors relative p-2"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0f172a]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 bg-[#0f172a] border border-slate-800 shadow-2xl rounded-[1.5rem] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-bold text-white text-sm">Automated Reminders</h3>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase font-black">Beta</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle className="mx-auto text-slate-700 mb-2" size={32} />
                    <p className="text-slate-500 text-sm italic">All caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-slate-900/50 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-900/10' : ''}`}
                        onClick={() => markRead(n.id)}
                      >
                        <div className="flex space-x-3">
                          <div className={`mt-1 flex-shrink-0 ${n.type === 'urgent' ? 'text-rose-500' : 'text-amber-500'}`}>
                            {n.type === 'urgent' ? <AlertCircle size={16} /> : <CalendarClock size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white leading-tight mb-1">{n.title}</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-slate-600 mt-2">Recently synced</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-900/30 border-t border-slate-800 text-center">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                >
                  Close Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-100 leading-none">{user.name}</p>
            <p className="text-xs text-slate-500 mt-1">{user.role}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-900/30 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-800">
            <UserIcon size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
