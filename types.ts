export enum UserRole {
  CEO_CFO = 'CEO / CFO',
  MANAGER = 'Manager',
  AUDITOR = 'Auditor'
}

export enum ComplianceStatus {
  COMPLETED = 'Completed',
  WIP = 'Work In Progress',
  NOT_COMPLETED = 'Not Completed'
}

export enum Criticality {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Frequency {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  ANNUAL = 'Annual'
}

export interface UserPreferences {
  defaultFrequencyFilter: string;
  preferredReportFormat: 'PDF' | 'XLS' | 'CSV';
  visibleWidgets: {
    statsSummary: boolean;
    compliancePieChart: boolean;
    pendingTable: boolean;
    deadlineTracker: boolean;
  };
  notifications: {
    types: {
      missedDeadlines: boolean;
      newRemarks: boolean;
      upcomingDeadlines: boolean;
      revenueAlerts: boolean;
    };
    channels: {
      inApp: boolean;
      email: boolean;
    };
  };
}

export interface ComplianceRecord {
  id: string;
  name: string;
  dueDate: string;
  frequency: Frequency;
  status: ComplianceStatus;
  criticality: Criticality;
  actualCompletionDate?: string;
  delayReason?: string;
  delayDays?: number;
  expectedCompletionDate?: string;
  auditorRemarks?: string;
  leadershipRemarks?: string;
  otherObservations?: string;
  lastUpdated: string;
}

export interface RevenueRecord {
  id: string;
  date: string;
  source: string;
  mode: string;
  amount: number;
  category: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  preferences: UserPreferences;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetId: string;
  targetName: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'reminder' | 'success';
  timestamp: string;
  read: boolean;
  targetId?: string;
}