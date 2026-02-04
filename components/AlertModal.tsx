
import React from 'react';
import { AlertTriangle, X, ArrowRight, Calendar, Clock } from 'lucide-react';
import { ComplianceRecord, ComplianceStatus } from '../types';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingTasks: ComplianceRecord[];
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, pendingTasks }) => {
  if (!isOpen || pendingTasks.length === 0) return null;

  const today = new Date();
  
  const getTaskUrgency = (task: ComplianceRecord) => {
    let dueDate: Date;
    if (task.dueDate.length <= 2) {
      dueDate = new Date(today.getFullYear(), today.getMonth(), parseInt(task.dueDate));
    } else {
      dueDate = new Date(task.dueDate);
    }
    return dueDate < today ? 'overdue' : 'upcoming';
  };

  const overdue = pendingTasks.filter(t => getTaskUrgency(t) === 'overdue');
  const upcoming = pendingTasks.filter(t => getTaskUrgency(t) === 'upcoming');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f172a] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="bg-rose-600 p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl text-white">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black">System Reminders</h2>
              <p className="text-rose-100 font-medium">Auto-synced compliance status alerts.</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {overdue.length > 0 && (
              <div>
                <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-3">Critical Overdue</h3>
                <div className="space-y-3">
                  {overdue.map((task) => (
                    <div key={task.id} className="flex items-start space-x-4 p-4 bg-rose-950/20 rounded-2xl border border-rose-900/30 group">
                      <div className="mt-1">
                        <AlertTriangle className="text-rose-400" size={18} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-100 text-sm">{task.name}</h4>
                        <p className="text-[10px] font-black text-rose-500/80 mt-1 uppercase">MISSING SINCE {task.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {upcoming.length > 0 && (
              <div>
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] mb-3">Approaching Deadlines</h3>
                <div className="space-y-3">
                  {upcoming.map((task) => (
                    <div key={task.id} className="flex items-start space-x-4 p-4 bg-amber-950/20 rounded-2xl border border-amber-900/30 group">
                      <div className="mt-1">
                        <Clock className="text-amber-400" size={18} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-100 text-sm">{task.name}</h4>
                        <p className="text-[10px] font-black text-amber-500/80 mt-1 uppercase">DUE ON {task.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 pt-4">
          <button 
            onClick={onClose}
            className="w-full bg-slate-100 text-slate-950 py-4 rounded-2xl font-bold hover:bg-white transition-all active:scale-[0.98] shadow-lg shadow-slate-950/50"
          >
            Acknowledge Automated Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
