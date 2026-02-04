import React, { useState } from 'react';
import { AuditLog } from '../types';
import { History, Search, Calendar, User, ArrowRight, Layers } from 'lucide-react';

interface AuditTrailPageProps {
  logs: AuditLog[];
}

const AuditTrailPage: React.FC<AuditTrailPageProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">System Audit Trail</h1>
          <p className="text-slate-400">Historical log of all modifications made by auditors and leadership.</p>
        </div>
        <div className="flex items-center bg-indigo-950/30 text-indigo-400 px-4 py-2 rounded-xl border border-indigo-900/50">
          <Layers size={18} className="mr-2" />
          <span className="text-sm font-bold">{logs.length} Total Logs</span>
        </div>
      </div>

      <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-sm flex items-center no-print">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
          <input 
            type="text" 
            placeholder="Search by user, action, or target..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm text-slate-100 placeholder-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-800">
              <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Item</th>
                <th className="px-6 py-4">Modifications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-600 italic">
                    No activity logs found for the current period.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition-colors align-top">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-100">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 text-slate-500">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-100">{log.userName}</span>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{log.userRole}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-400">{log.action}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-indigo-400">{log.targetName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {log.changes.map((change, i) => (
                          <div key={i} className="text-xs flex flex-wrap items-center gap-1.5">
                            <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-500">{change.field}</span>
                            <span className="text-slate-600 italic">{String(change.oldValue || 'None')}</span>
                            <ArrowRight size={10} className="text-slate-700" />
                            <span className="font-bold text-slate-300">{String(change.newValue)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditTrailPage;