
import { ComplianceRecord, Frequency, ComplianceStatus, Criticality, RevenueRecord } from './types';

export const COMPLIANCE_CHECKLIST: Partial<ComplianceRecord>[] = [
  { name: 'TDS / TCS Challan Payment', frequency: Frequency.MONTHLY, criticality: Criticality.HIGH, dueDate: '7' },
  { name: 'GSTR-1 Filing', frequency: Frequency.MONTHLY, criticality: Criticality.HIGH, dueDate: '11' },
  { name: 'PF & ESI Payment', frequency: Frequency.MONTHLY, criticality: Criticality.MEDIUM, dueDate: '15' },
  { name: 'GSTR-3B Filing', frequency: Frequency.MONTHLY, criticality: Criticality.HIGH, dueDate: '20' },
  { name: 'Quarter 1 TDS Filing', frequency: Frequency.QUARTERLY, criticality: Criticality.MEDIUM, dueDate: '2024-07-31' },
  { name: 'Quarter 2 TDS Filing', frequency: Frequency.QUARTERLY, criticality: Criticality.MEDIUM, dueDate: '2024-09-30' },
  { name: 'Quarter 3 TDS Filing', frequency: Frequency.QUARTERLY, criticality: Criticality.MEDIUM, dueDate: '2025-01-31' },
  { name: 'Quarter 4 TDS Filing', frequency: Frequency.QUARTERLY, criticality: Criticality.MEDIUM, dueDate: '2025-05-31' },
  { name: 'Quarter 1 Advance Tax', frequency: Frequency.QUARTERLY, criticality: Criticality.HIGH, dueDate: '2024-06-15' },
  { name: 'Quarter 2 Advance Tax', frequency: Frequency.QUARTERLY, criticality: Criticality.HIGH, dueDate: '2024-09-15' },
  { name: 'Quarter 3 Advance Tax', frequency: Frequency.QUARTERLY, criticality: Criticality.HIGH, dueDate: '2024-12-15' },
  { name: 'Quarter 4 Advance Tax', frequency: Frequency.QUARTERLY, criticality: Criticality.HIGH, dueDate: '2025-03-15' },
  { name: 'Non-Audit Cases – IT Filing', frequency: Frequency.ANNUAL, criticality: Criticality.MEDIUM, dueDate: '2024-07-31' },
  { name: 'Tax Audit Cases – IT Filing', frequency: Frequency.ANNUAL, criticality: Criticality.HIGH, dueDate: '2024-09-30' },
  { name: 'GST 9 & 9C Filing', frequency: Frequency.ANNUAL, criticality: Criticality.HIGH, dueDate: '2024-12-31' },
];

export const MOCK_REVENUE: RevenueRecord[] = [
  { id: '1', date: '2024-01-05', source: 'Global Tech Solutions', mode: 'Wire Transfer', amount: 450000, category: 'Services' },
  { id: '2', date: '2024-01-12', source: 'Initech Corp', mode: 'ACH', amount: 280000, category: 'Product License' },
  { id: '3', date: '2024-02-08', source: 'Hooli Ltd', mode: 'Wire Transfer', amount: 620000, category: 'Consulting' },
  { id: '4', date: '2024-03-15', source: 'Dunder Mifflin', mode: 'Check', amount: 150000, category: 'Retail' },
  { id: '5', date: '2024-04-20', source: 'Stark Ind.', mode: 'Wire Transfer', amount: 980000, category: 'SaaS' },
];

export const MOCK_COMPLIANCES: ComplianceRecord[] = COMPLIANCE_CHECKLIST.map((c, i) => ({
  ...c,
  id: `comp-${i}`,
  status: Math.random() > 0.3 ? ComplianceStatus.COMPLETED : (Math.random() > 0.5 ? ComplianceStatus.WIP : ComplianceStatus.NOT_COMPLETED),
  lastUpdated: new Date().toISOString(),
  actualCompletionDate: Math.random() > 0.3 ? '2024-01-10' : undefined,
  delayReason: Math.random() > 0.8 ? 'Pending bank verification' : undefined,
})) as ComplianceRecord[];
