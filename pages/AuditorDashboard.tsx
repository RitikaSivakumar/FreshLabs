import React, { useState } from 'react';
import { ComplianceRecord, ComplianceStatus, Criticality, Frequency, Notification } from '../types';
import { CheckCircle2, CircleDashed, XCircle, AlertTriangle, MoreVertical, Plus, ChevronRight, Save, Calendar as CalendarIcon, Mail, Send, Download } from 'lucide-react';
import { ToastType } from '../components/Toast';

interface AuditorDashboardProps {
  compliances: ComplianceRecord[];
  updateCompliance: (id: string, updates: Partial<ComplianceRecord>) => void;
  notifications: Notification[];
  showToast: (message: string, type?: ToastType) => void;
}

const AuditorDashboard: React.FC<AuditorDashboardProps> = ({ compliances, updateCompliance, notifications, showToast }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ComplianceRecord>>({});
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleEdit = (c: ComplianceRecord) => {
    setEditingId(c.id);
    setEditForm({ ...c });
  };

  const handleSave = () => {
    if (editingId) {
      updateCompliance(editingId, editForm);
      setEditingId(null);
    }
  };

  const simulateEmailBatch = () => {
    setSendingEmail(true);
    setTimeout(() => {
      setSendingEmail(false);
      showToast('Automated email reminders sent to relevant stakeholders.', 'success');
    }, 2000);
  };

  const handleDownload = () => {
    window.print();
  };

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLETED: return <CheckCircle2 className="text-emerald-400" />;
      case ComplianceStatus.WIP: return <CircleDashed className="text-amber-400 animate-spin-slow" />;
      case ComplianceStatus.NOT_COMPLETED: return <XCircle className="text-rose-400" />;
    }
  };

  const getCriticalityClass = (c: Criticality) => {
    switch (c) {
      case Criticality.HIGH: return 'bg-rose-900/30 text-rose-400 border border-rose-800/50';
      case Criticality.MEDIUM: return 'bg-amber-900/30 text-amber-400 border border-amber-800/50';
      case Criticality.LOW: return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Management</h1>
          <p className="text-slate-400">Update compliance checklists and submit reports for review.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleDownload}
            className="bg-[#0f172a] border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center hover:bg-slate-800 transition-all no-print"
          >
            <Download size={16} className="mr-2" />
            <span>Download Report</span>
          </button>
          <button 
            onClick={simulateEmailBatch}
            disabled={sendingEmail}
            className="bg-[#0f172a] border border-indigo-600/30 text-indigo-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center hover:bg-indigo-900/20 transition-all disabled:opacity-50 no-print"
          >
            {sendingEmail ? (
              <div className="animate-spin h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full mr-2" />
            ) : (
              <Mail size={16} className="mr-2" />
            )}
            {sendingEmail ? 'Syncing...' : 'Batch Email Reminders'}
          </button>
          <div className="bg-emerald-900/20 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-800/50 text-sm flex items-center">
            <CheckCircle2 size={16} className="mr-2" />
            {compliances.filter(c => c.status === ComplianceStatus.COMPLETED).length} Completed
          </div>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-900/30 p-4 rounded-2xl flex items-center justify-between no-print">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-amber-500" size={20} />
            <p className="text-sm text-amber-100 font-medium">
              You have <span className="font-black">{notifications.length}</span> automated alerts for pending deadlines.
            </p>
          </div>
          <button 
            onClick={() => {}}
            className="text-amber-500 text-xs font-bold underline hover:text-amber-400"
          >
            View Reminders
          </button>
        </div>
      )}

      <div className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-800">
              <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Compliance Name</th>
                <th className="px-6 py-4">Frequency</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4 no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {compliances.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className={`hover:bg-slate-800/50 transition-colors ${editingId === item.id ? 'bg-indigo-900/10' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <span className="text-sm font-medium text-slate-300">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-100">{item.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{item.frequency}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getCriticalityClass(item.criticality)}`}>
                        {item.criticality}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">
                      {item.dueDate}
                    </td>
                    <td className="px-6 py-4 no-print">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors"
                        >
                          Update
                        </button>
                        <button 
                          onClick={() => showToast(`Manual email reminder sent for ${item.name}`, 'info')}
                          title="Send individual email reminder"
                          className="text-slate-600 hover:text-amber-500 transition-colors"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {editingId === item.id && (
                    <tr className="bg-indigo-950/20 no-print">
                      <td colSpan={6} className="px-6 py-6 border-b border-indigo-900/30">
                        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-indigo-500/20 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Update Status</label>
                            <select 
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 text-white"
                              value={editForm.status}
                              onChange={(e) => setEditForm({...editForm, status: e.target.value as ComplianceStatus})}
                            >
                              <option value={ComplianceStatus.COMPLETED}>Completed</option>
                              <option value={ComplianceStatus.WIP}>Work In Progress</option>
                              <option value={ComplianceStatus.NOT_COMPLETED}>Not Completed</option>
                            </select>
                          </div>

                          {editForm.status === ComplianceStatus.COMPLETED && (
                            <div className="animate-in fade-in">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Actual Completion Date</label>
                              <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                <input 
                                  type="date"
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 pl-10 text-sm outline-none focus:ring-2 focus:ring-indigo-600 text-white"
                                  value={editForm.actualCompletionDate || ''}
                                  onChange={(e) => setEditForm({...editForm, actualCompletionDate: e.target.value})}
                                />
                              </div>
                            </div>
                          )}
                          
                          {editForm.status === ComplianceStatus.NOT_COMPLETED && (
                            <div className="animate-in fade-in">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 text-rose-400">Reason for Delay (Mandatory)</label>
                              <textarea 
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600 h-20 text-white placeholder-slate-800"
                                placeholder="Explain why this compliance is delayed..."
                                value={editForm.delayReason}
                                onChange={(e) => setEditForm({...editForm, delayReason: e.target.value})}
                              />
                            </div>
                          )}

                          <div className="md:col-span-2 flex justify-end space-x-3">
                            <button 
                              onClick={() => setEditingId(null)}
                              className="px-4 py-2 text-slate-500 hover:text-slate-300 text-sm font-semibold"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleSave}
                              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/30 hover:bg-indigo-700 active:scale-95 transition-all"
                            >
                              <Save size={16} />
                              <span>Update Compliance</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditorDashboard;