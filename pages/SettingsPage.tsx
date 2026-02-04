import React from 'react';
import { UserPreferences } from '../types';
import { Layout, Filter, FileText, CheckCircle, Bell, Mail, Smartphone } from 'lucide-react';

interface SettingsPageProps {
  preferences: UserPreferences;
  onUpdate: (prefs: UserPreferences) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ preferences, onUpdate }) => {
  const handleToggleWidget = (widget: keyof UserPreferences['visibleWidgets']) => {
    onUpdate({
      ...preferences,
      visibleWidgets: {
        ...preferences.visibleWidgets,
        [widget]: !preferences.visibleWidgets[widget]
      }
    });
  };

  const handleToggleNotificationType = (type: keyof UserPreferences['notifications']['types']) => {
    onUpdate({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        types: {
          ...preferences.notifications.types,
          [type]: !preferences.notifications.types[type]
        }
      }
    });
  };

  const handleToggleNotificationChannel = (channel: keyof UserPreferences['notifications']['channels']) => {
    onUpdate({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        channels: {
          ...preferences.notifications.channels,
          [channel]: !preferences.notifications.channels[channel]
        }
      }
    });
  };

  const handleSelectDefaultFilter = (filter: string) => {
    onUpdate({ ...preferences, defaultFrequencyFilter: filter });
  };

  const handleSelectReportFormat = (format: UserPreferences['preferredReportFormat']) => {
    onUpdate({ ...preferences, preferredReportFormat: format });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">User Preferences</h1>
          <p className="text-slate-400">Customize your workspace and default application behavior.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dashboard Customization */}
        <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <Layout className="text-indigo-400" size={24} />
            <h3 className="text-lg font-bold text-white">Dashboard Layout</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Choose which widgets are visible on your executive dashboard.</p>
          
          <div className="space-y-4">
            {[
              { id: 'statsSummary', label: 'Stats Summary' },
              { id: 'compliancePieChart', label: 'Compliance Pie Chart' },
              { id: 'pendingTable', label: 'Pending Table' },
              { id: 'deadlineTracker', label: 'Deadline Tracker' },
            ].map((widget) => (
              <label 
                key={widget.id} 
                className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-800 transition-colors group"
              >
                <span className="font-bold text-slate-300">{widget.label}</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.visibleWidgets[widget.id as keyof UserPreferences['visibleWidgets']]}
                    onChange={() => handleToggleWidget(widget.id as keyof UserPreferences['visibleWidgets'])}
                  />
                  <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center space-x-3">
            <Bell className="text-indigo-400" size={24} />
            <h3 className="text-lg font-bold text-white">Notification Settings</h3>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alert Types</label>
            {[
              { id: 'missedDeadlines', label: 'Missed Deadlines' },
              { id: 'upcomingDeadlines', label: 'Upcoming Deadlines' },
              { id: 'newRemarks', label: 'New Remarks/Feedback' },
              { id: 'revenueAlerts', label: 'Revenue Threshold Alerts' },
            ].map((type) => (
              <label 
                key={type.id} 
                className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-800 transition-colors group"
              >
                <span className="font-bold text-slate-300">{type.label}</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.notifications.types[type.id as keyof UserPreferences['notifications']['types']]}
                    onChange={() => handleToggleNotificationType(type.id as keyof UserPreferences['notifications']['types'])}
                  />
                  <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            ))}
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Delivery Channels</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'inApp', label: 'In-App Alerts', icon: Smartphone },
                { id: 'email', label: 'Email Digest', icon: Mail },
              ].map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleToggleNotificationChannel(channel.id as keyof UserPreferences['notifications']['channels'])}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    preferences.notifications.channels[channel.id as keyof UserPreferences['notifications']['channels']]
                      ? 'bg-indigo-600/10 border-indigo-600/50 text-indigo-100'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <channel.icon size={18} className={preferences.notifications.channels[channel.id as keyof UserPreferences['notifications']['channels']] ? 'text-indigo-400' : 'text-slate-600'} />
                    <span className="font-bold text-sm">{channel.label}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${preferences.notifications.channels[channel.id as keyof UserPreferences['notifications']['channels']] ? 'bg-indigo-400 animate-pulse' : 'bg-slate-800'}`}></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Defaults */}
        <div className="space-y-8">
          <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Filter className="text-indigo-400" size={24} />
              <h3 className="text-lg font-bold text-white">Filtering Defaults</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Initial Frequency Filter</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['All', 'Monthly', 'Quarterly', 'Annual'].map((f) => (
                  <button
                    key={f}
                    onClick={() => handleSelectDefaultFilter(f)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      preferences.defaultFrequencyFilter === f 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-indigo-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="text-indigo-400" size={24} />
              <h3 className="text-lg font-bold text-white">Reporting Defaults</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Preferred Download Format</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['PDF', 'XLS', 'CSV'].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleSelectReportFormat(format as any)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      preferences.preferredReportFormat === format 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-indigo-800'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-emerald-900/10 rounded-3xl border border-emerald-800/30 text-emerald-400 animate-in slide-in-from-bottom-2">
        <CheckCircle className="mr-3" size={24} />
        <span className="font-bold">Settings are automatically synchronized across your devices.</span>
      </div>
    </div>
  );
};

export default SettingsPage;