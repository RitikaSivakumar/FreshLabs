
import React, { useState } from 'react';
import { ComplianceRecord, RevenueRecord, ComplianceStatus, UserRole } from '../types';
import { Printer, Download, CheckCircle, FileText, FileCheck, Loader2, Table } from 'lucide-react';

interface ReportsPageProps {
  compliances: ComplianceRecord[];
  revenues: RevenueRecord[];
  userRole?: UserRole;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ compliances, revenues, userRole }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingCsvId, setDownloadingCsvId] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const simulateDownload = (reportTitle: string, id: string) => {
    setDownloadingId(id);
    
    // Simulating "Secure, fast" generation process
    setTimeout(() => {
      const reportData = `
        FRESHLABS ENTERPRISE AUDIT REPORT
        ---------------------------------
        Title: ${reportTitle}
        Audit Period: Q1 - 2024
        Status: Finalized & Approved
        Date Generated: ${new Date().toLocaleString()}
        
        SUMMARY FINDINGS:
        - Compliance Completion Rate: ${Math.round((compliances.filter(c => c.status === ComplianceStatus.COMPLETED).length / compliances.length) * 100)}%
        - Revenue Tracked: ₹${revenues.reduce((a, b) => a + b.amount, 0).toLocaleString()}
        
        This document is an official regulatory compliance record.
        FreshLabs Enterprise Secure Environment v3.1
      `;
      
      const blob = new Blob([reportData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportTitle.replace(/\s+/g, '_')}_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadingId(null);
    }, 1500);
  };

  const simulateCsvDownload = (report: any) => {
    setDownloadingCsvId(report.id);
    
    setTimeout(() => {
      const headers = [
        "Audit ID", 
        "Organization Name", 
        "Audit Period", 
        "Auditor Name", 
        "Compliance Status", 
        "Risk Level", 
        "Key Findings", 
        "Recommendations", 
        "Approval Status", 
        "Report Date"
      ];
      
      const dataRow = [
        report.id,
        "FreshLabs Enterprise",
        report.period,
        report.auditor,
        "Approved",
        "Low",
        "Statutory compliance maintained across all tested controls",
        "Continue periodic internal reviews",
        "Finalized",
        report.date
      ];

      // Simple CSV escaping for content that might have commas
      const escapedRow = dataRow.map(val => `"${String(val).replace(/"/g, '""')}"`);
      const csvContent = [headers.join(','), escapedRow.join(',')].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${report.title.replace(/\s+/g, '_')}_Data.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadingCsvId(null);
    }, 1200);
  };

  const totalRev = revenues.reduce((a, b) => a + b.amount, 0);
  const completedCount = compliances.filter(c => c.status === ComplianceStatus.COMPLETED).length;

  const finalizedReports = [
    { id: 'rep-001', title: 'Monthly Compliance Review', period: 'January 2024', auditor: 'Jane Smith', date: '2024-02-01' },
    { id: 'rep-002', title: 'Quarterly Tax Audit', period: 'Q4 2023', auditor: 'Robert Brown', date: '2024-01-15' },
    { id: 'rep-003', title: 'Annual Revenue Consolidation', period: 'FY 2023-24', auditor: 'Jane Smith', date: '2024-03-10' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Reports</h1>
          <p className="text-slate-400">Generate and download consolidated compliance and revenue reports.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handlePrint}
            className="bg-slate-100 text-slate-950 px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-white flex items-center space-x-2 transition-all active:scale-95"
          >
            <Printer size={18} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* CEO Special: Finalized Reports Section */}
      <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-sm no-print">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-900/30 text-indigo-400 rounded-2xl">
              <FileCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Finalized Audit Reports</h2>
              <p className="text-sm text-slate-400">Professionally formatted official documents for regulatory use.</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-800/30">
            CEO Secure Access
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalizedReports.map((report) => (
            <div key={report.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-indigo-600/50 transition-all flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <FileText className="text-slate-600 group-hover:text-indigo-400 transition-colors" size={32} />
                <span className="text-[10px] text-slate-500 font-bold">{report.date}</span>
              </div>
              <h3 className="font-bold text-slate-200 mb-1">{report.title}</h3>
              <p className="text-xs text-slate-500 mb-6">Period: {report.period} • {report.auditor}</p>
              
              <div className="mt-auto space-y-3">
                <button 
                  onClick={() => simulateDownload(report.title, report.id)}
                  disabled={downloadingId === report.id || downloadingCsvId === report.id}
                  className="flex items-center justify-center space-x-2 w-full bg-[#0f172a] border border-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all disabled:opacity-50"
                >
                  {downloadingId === report.id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-xs">Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span className="text-xs">Download PDF</span>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => simulateCsvDownload(report)}
                  disabled={downloadingCsvId === report.id || downloadingId === report.id}
                  className="flex items-center justify-center space-x-2 w-full bg-slate-900 border border-slate-800 text-indigo-400 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {downloadingCsvId === report.id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-xs">Exporting CSV...</span>
                    </>
                  ) : (
                    <>
                      <Table size={18} />
                      <span className="text-xs">Download as CSV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Report Preview */}
      <div className="bg-[#0f172a] rounded-none md:rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden p-8 md:p-12 max-w-5xl mx-auto print:bg-white print:text-black print:p-0 print:shadow-none print:border-none">
        <div className="flex justify-between items-start border-b-4 border-indigo-600 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black text-white print:text-slate-900 tracking-tighter">FRESHLABS</h1>
            <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-sm">Enterprise Executive Audit Summary</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-white print:text-slate-900">Generated On: {new Date().toLocaleDateString()}</p>
            <p className="text-slate-500 text-sm">Ref ID: AUD-2024-X92-J</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-slate-950 print:bg-slate-50 rounded-2xl border border-slate-800 print:border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Completion Rate</p>
            <p className="text-3xl font-black text-white print:text-slate-900">{Math.round((completedCount/compliances.length)*100)}%</p>
            <p className="text-sm text-emerald-400 font-medium mt-1">Status: Stable</p>
          </div>
          <div className="p-6 bg-slate-950 print:bg-slate-50 rounded-2xl border border-slate-800 print:border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">YTD Revenue</p>
            <p className="text-3xl font-black text-white print:text-slate-900">₹{(totalRev/100000).toFixed(1)}L</p>
            <p className="text-sm text-slate-500 font-medium mt-1">Growth: Organic</p>
          </div>
          <div className="p-6 bg-slate-950 print:bg-slate-50 rounded-2xl border border-slate-800 print:border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Pending High Risk</p>
            <p className="text-3xl font-black text-rose-500">{compliances.filter(c => c.status === ComplianceStatus.NOT_COMPLETED).length}</p>
            <p className="text-sm text-rose-400 font-medium mt-1">Requires Priority</p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white print:text-slate-900 mb-6 flex items-center">
          <CheckCircle className="mr-2 text-indigo-500" size={24} /> Compliance Audit Details
        </h3>
        
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 print:bg-slate-100 text-slate-500 font-bold uppercase text-[10px]">
              <tr className="text-left border-b border-slate-800 print:border-slate-200">
                <th className="p-4">Compliance Name</th>
                <th className="p-4">Frequency</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Actual Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Findings / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-slate-100">
              {compliances.map((item) => (
                <tr key={item.id} className="print:text-slate-800">
                  <td className="p-4 font-bold text-slate-200 print:text-slate-900">{item.name}</td>
                  <td className="p-4 text-slate-500">{item.frequency}</td>
                  <td className="p-4 text-slate-500">{item.dueDate}</td>
                  <td className="p-4 text-slate-500">{item.actualCompletionDate || '-'}</td>
                  <td className="p-4">
                    <span className={`font-black ${item.status === ComplianceStatus.COMPLETED ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 print:text-slate-600 italic text-xs leading-relaxed">
                    {item.delayReason || (item.status === ComplianceStatus.COMPLETED ? 'Compliant' : '-')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-950 print:bg-slate-900 text-white p-10 rounded-[2.5rem] mb-12 border border-slate-800 print:border-none">
          <h3 className="text-lg font-bold mb-6 flex items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
            Auditor Assessment & Recommendation
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            The organization maintains a robust compliance framework with {completedCount} milestones achieved. 
            Immediate focus is recommended for statutory filings currently in "Not Completed" status to mitigate regulatory exposure. 
            Revenue data points to healthy capital inflow aligned with forecasted growth.
          </p>
          <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-800/50">
            <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Lead Internal Auditor</p>
              <div className="h-px bg-slate-800 w-full"></div>
              <p className="text-sm font-bold text-slate-300">Jane Smith, CPA</p>
            </div>
            <div className="text-right space-y-6">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Executive Approval (CEO/CFO)</p>
              <div className="h-px bg-slate-800 w-full ml-auto"></div>
              <p className="text-sm font-bold text-slate-300">Finalized - Digital Signature Applied</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-slate-700 text-[10px] font-bold uppercase tracking-widest">
          <p>Confidential Regulatory Document</p>
          <p>Page 01 of 01</p>
          <p>© 2024 FreshLabs Enterprise</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
