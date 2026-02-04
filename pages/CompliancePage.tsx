import React, { useState } from 'react';
import { ComplianceRecord, ComplianceStatus, UserRole } from '../types';
import { Search, Filter, Calendar, AlertTriangle, MessageSquare, ExternalLink, Clock } from 'lucide-react';

interface CompliancePageProps {
  compliances: ComplianceRecord[];
  userRole: UserRole;
  onUpdate: (id: string, updates: Partial<ComplianceRecord>) => void;
}

const CompliancePage: React.FC<CompliancePageProps> = ({ compliances, userRole, onUpdate }) => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = compliances.filter(c => {
    const matchesFilter = filter === 'All' || c.frequency === filter;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const isLeadership = userRole === UserRole.CEO_CFO || userRole === UserRole.MANAGER;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance Directory</h1>
          <p className="text-slate-400">View and track all statutory tax and payroll compliances.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-sm no-print">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search compliance name..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {['All', 'Monthly', 'Quarterly', 'Annual'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-600/50 transition-all group overflow-hidden flex flex-col">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  item.frequency === 'Monthly' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 
                  item.frequency === 'Quarterly' ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' : 'bg-amber-900/30 text-amber-400 border border-amber-800/50'
                }`}>
                  {item.frequency}
                </span>
                <div className="flex space-x-2">
                  {item.delayDays && item.delayDays > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-900/30 text-rose-400 flex items-center border border-rose-800/50">
                      <Clock size={10} className="mr-1" /> {item.delayDays}d DELAY
                    </span>
                  ) : null}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.status === ComplianceStatus.COMPLETED ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' :
                    item.status === ComplianceStatus.WIP ? 'bg-amber-900/30 text-amber-400 border border-amber-800/50' : 'bg-rose-900/30 text-rose-400 border border-rose-800/50'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                {item.name}
              </h3>
              
              <div className="flex items-center space-x-4 text-slate-400 text-sm mb-6">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1.5 text-slate-500" />
                  Due: {item.dueDate}
                </div>
                {item.status === ComplianceStatus.NOT_COMPLETED && (
                  <div className="flex items-center text-rose-400 font-bold">
                    <AlertTriangle size={14} className="mr-1.5" />
                    Pending
                  </div>
                )}
              </div>

              {item.delayReason && (
                <div className="p-4 bg-rose-900/10 rounded-2xl mb-6 border border-rose-800/30">
                  <p className="text-xs font-bold text-rose-400 uppercase mb-1 flex items-center">
                    <AlertTriangle size={12} className="mr-1" /> Auditor Reason
                  </p>
                  <p className="text-sm text-rose-200/80 italic leading-relaxed">"{item.delayReason}"</p>
                </div>
              )}

              {item.leadershipRemarks && (
                <div className="p-4 bg-indigo-900/10 rounded-2xl mb-6 border border-indigo-800/30">
                  <p className="text-xs font-bold text-indigo-400 uppercase mb-1 flex items-center">
                    <MessageSquare size={12} className="mr-1" /> Leadership Feedback
                  </p>
                  <p className="text-sm text-indigo-200/80 leading-relaxed">"{item.leadershipRemarks}"</p>
                </div>
              )}
            </div>

            <div className="mt-auto p-6 pt-0 border-t border-slate-800 flex items-center justify-between">
              <button 
                onClick={() => {
                  if(userRole === UserRole.AUDITOR) {
                    alert('Go to Dashboard to edit status');
                  } else if(isLeadership) {
                    const r = prompt(`Add escalation note or reason for delay for "${item.name}":`, item.leadershipRemarks || "");
                    if(r !== null) onUpdate(item.id, { leadershipRemarks: r });
                  }
                }}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center transition-colors py-2 px-3 bg-indigo-950/50 rounded-lg group-hover:bg-indigo-900/50"
              >
                <MessageSquare size={14} className="mr-1.5" /> 
                {isLeadership ? (item.leadershipRemarks ? 'EDIT REMARK' : 'ADD REMARK') : 'VIEW DETAILS'}
              </button>
              <button className="p-2 text-slate-600 hover:text-indigo-400 transition-colors">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompliancePage;