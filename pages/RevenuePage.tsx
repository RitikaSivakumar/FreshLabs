import React, { useState, useMemo } from 'react';
import { RevenueRecord, UserRole } from '../types';
import { Plus, IndianRupee, Wallet, CreditCard, Building2, Calendar, Download, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenuePageProps {
  revenues: RevenueRecord[];
  userRole: UserRole;
  onAdd: (record: RevenueRecord) => void;
}

const RevenuePage: React.FC<RevenuePageProps> = ({ revenues, userRole, onAdd }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [newRevenue, setNewRevenue] = useState<Partial<RevenueRecord>>({
    date: new Date().toISOString().split('T')[0],
    category: 'Consulting'
  });

  const categories = useMemo(() => {
    const cats = new Set(revenues.map(r => r.category));
    return ['All', ...Array.from(cats)].sort();
  }, [revenues]);

  const filteredRevenues = useMemo(() => {
    if (categoryFilter === 'All') return revenues;
    return revenues.filter(r => r.category === categoryFilter);
  }, [revenues, categoryFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRevenue.amount && newRevenue.source) {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        date: newRevenue.date!,
        source: newRevenue.source!,
        mode: newRevenue.mode || 'Wire Transfer',
        amount: Number(newRevenue.amount),
        category: newRevenue.category!
      });
      setShowAddForm(false);
      setNewRevenue({ date: new Date().toISOString().split('T')[0], category: 'Consulting' });
    }
  };

  const chartData = useMemo(() => {
    return [...filteredRevenues].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredRevenues]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Management</h1>
          <p className="text-slate-400">Detailed tracking of organization inflows and tax categories.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#0f172a] border border-slate-800 text-slate-300 pl-10 pr-8 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {userRole === UserRole.AUDITOR && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-indigo-500/30 flex items-center space-x-2 transition-transform active:scale-95"
            >
              <Plus size={18} />
              <span>Record Revenue</span>
            </button>
          )}
          <button className="bg-[#0f172a] border border-slate-800 text-slate-300 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 flex items-center space-x-2 transition-colors">
            <Download size={18} />
            <span>Export XLS</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Revenue Trend {categoryFilter !== 'All' ? `(${categoryFilter})` : ''}</h3>
          {categoryFilter !== 'All' && (
            <button 
              onClick={() => setCategoryFilter('All')}
              className="text-xs text-indigo-400 font-bold hover:text-indigo-300"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.4)' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-600 italic">
              No revenue data available for the selected category.
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="bg-[#0f172a] p-8 rounded-3xl border border-indigo-600/30 shadow-2xl animate-in zoom-in-95 duration-300">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Wallet className="mr-3 text-indigo-400" /> New Revenue Entry
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Source / Client</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-indigo-600 text-white placeholder-slate-700"
                  placeholder="Company name..."
                  value={newRevenue.source || ''}
                  onChange={(e) => setNewRevenue({...newRevenue, source: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Amount (INR)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type="number" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-indigo-600 text-white placeholder-slate-700"
                  placeholder="0.00"
                  value={newRevenue.amount || ''}
                  onChange={(e) => setNewRevenue({...newRevenue, amount: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <input 
                required
                type="text"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600 text-white"
                placeholder="e.g. Consulting, SaaS, Retail"
                value={newRevenue.category || ''}
                onChange={(e) => setNewRevenue({...newRevenue, category: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Mode of Receipt</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600 text-white appearance-none"
                value={newRevenue.mode || 'Wire Transfer'}
                onChange={(e) => setNewRevenue({...newRevenue, mode: e.target.value})}
              >
                <option>Wire Transfer</option>
                <option>ACH</option>
                <option>Check</option>
                <option>UPI</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end space-x-4 pt-4">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-900/20 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white">Recent Transactions {categoryFilter !== 'All' ? `in ${categoryFilter}` : ''}</h3>
          <Calendar className="text-slate-600" size={20} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRevenues.length > 0 ? (
                filteredRevenues.slice().reverse().map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-400">{rev.date}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-100">{rev.source}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-900 text-slate-400 rounded-md text-xs font-medium border border-slate-800">{rev.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{rev.mode}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-white">₹{rev.amount.toLocaleString('en-IN')}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-600 italic">
                    No transactions found for the selected category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;