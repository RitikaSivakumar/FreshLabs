import React from 'react';
import { ComplianceRecord, RevenueRecord, ComplianceStatus, UserRole, UserPreferences, Notification } from '../types';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Clock, TrendingUp, MessageSquare, CalendarClock, ArrowRight, Download } from 'lucide-react';

interface DashboardProps {
  compliances: ComplianceRecord[];
  revenues: RevenueRecord[];
  role: UserRole;
  onAddRemark: (id: string, updates: Partial<ComplianceRecord>) => void;
  preferences: UserPreferences;
  notifications: Notification[];
}

const Dashboard: React.FC<DashboardProps> = ({ compliances, revenues, role, onAddRemark, preferences, notifications }) => {
  const stats = {
    completed: compliances.filter(c => c.status === ComplianceStatus.COMPLETED).length,
    wip: compliances.filter(c => c.status === ComplianceStatus.WIP).length,
    notCompleted: compliances.filter(c => c.status === ComplianceStatus.NOT_COMPLETED).length,
    totalRevenue: revenues.reduce((acc, curr) => acc + curr.amount, 0),
  };

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'WIP', value: stats.wip, color: '#f59e0b' },
    { name: 'Not Completed', value: stats.notCompleted, color: '#ef4444' },
  ];

  const isLeadership = role === UserRole.CEO_CFO || role === UserRole.MANAGER;

  const handleQuickDownload = () => {
    window.print(); // Quick print/download shortcut
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Summary</h1>
          <p className="text-slate-400">Real-time visibility into organization compliance and revenue health.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleQuickDownload}
            className="bg-[#0f172a] border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-800 flex items-center space-x-2 transition-colors no-print"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Download Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {preferences.visibleWidgets.statsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-900/30 text-emerald-400 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-900/50 px-2 py-1 rounded-full border border-emerald-800/50">HEALTHY</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Compliances Finished</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.completed}</h3>
          </div>
          
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-900/30 text-amber-400 rounded-xl">
                <Clock size={24} />
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-900/50 px-2 py-1 rounded-full border border-amber-800/50">IN PROGRESS</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Pending Tasks</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.wip}</h3>
          </div>

          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-900/30 text-rose-400 rounded-xl">
                <AlertCircle size={24} />
              </div>
              <span className="text-xs font-bold text-rose-400 bg-rose-900/50 px-2 py-1 rounded-full border border-rose-800/50">HIGH RISK</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Missed Deadlines</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.notCompleted}</h3>
          </div>

          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-900/30 text-indigo-400 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-900/50 px-2 py-1 rounded-full border border-indigo-800/50">REVENUE</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">YTD Revenue</p>
            <h3 className="text-3xl font-bold text-white mt-1">₹{(stats.totalRevenue/100000).toFixed(1)}L</h3>
          </div>
        </div>
      )}

      {/* Deadline Tracker - Automated Reminders View */}
      {preferences.visibleWidgets.deadlineTracker && notifications.length > 0 && (
        <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <CalendarClock className="mr-2 text-amber-400" size={20} />
              Upcoming Deadline Tracker
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-bold">AUTOMATED ALERTS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {notifications.slice(0, 4).map(notif => (
              <div 
                key={notif.id} 
                className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] cursor-default ${
                  notif.type === 'urgent' 
                    ? 'bg-rose-950/20 border-rose-900/30 text-rose-100' 
                    : 'bg-amber-950/20 border-amber-900/30 text-amber-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${notif.type === 'urgent' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                    {notif.type === 'urgent' ? <AlertCircle size={16} /> : <CalendarClock size={16} />}
                  </div>
                  <ArrowRight size={14} className="text-slate-600" />
                </div>
                <p className="font-bold text-sm mb-1">{notif.title}</p>
                <p className="text-xs opacity-70 line-clamp-2">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(preferences.visibleWidgets.compliancePieChart || preferences.visibleWidgets.pendingTable) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Compliance Distribution Chart */}
          {preferences.visibleWidgets.compliancePieChart && (
            <div className="lg:col-span-1 bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-white mb-6">Compliance Health</h3>
              <div className="flex-1 min-h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                       itemStyle={{ color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Critical Items */}
          {preferences.visibleWidgets.pendingTable && (
            <div className={`${preferences.visibleWidgets.compliancePieChart ? 'lg:col-span-2' : 'lg:col-span-3'} bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-sm overflow-hidden flex flex-col`}>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                Critical Pending Items
                <span className="ml-3 px-2 py-0.5 bg-rose-900/30 text-rose-400 text-xs rounded-full border border-rose-800/50">ATTENTION REQUIRED</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="pb-4">Compliance Name</th>
                      <th className="pb-4">Frequency</th>
                      <th className="pb-4">Auditor Remark</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {compliances.filter(c => c.status !== ComplianceStatus.COMPLETED).slice(0, 5).map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-900/50 transition-colors">
                        <td className="py-4">
                          <p className="font-semibold text-slate-200">{item.name}</p>
                          <p className="text-xs text-rose-400 font-medium">Due: {item.dueDate}</p>
                        </td>
                        <td className="py-4 text-sm text-slate-400">{item.frequency}</td>
                        <td className="py-4 text-sm text-slate-500 italic">
                          {item.delayReason || <span className="text-slate-700">No reason provided</span>}
                        </td>
                        <td className="py-4 text-right">
                          {isLeadership && (
                            <button 
                              onClick={() => {
                                const remark = prompt(`Add escalation note or reason for delay for "${item.name}":`, item.leadershipRemarks || "");
                                if(remark !== null) onAddRemark(item.id, { leadershipRemarks: remark });
                              }}
                              className="inline-flex p-2 text-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-colors items-center space-x-1"
                              title="Add leadership remark"
                            >
                              <MessageSquare size={18} />
                              <span className="text-xs font-bold uppercase">Remark</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;