// src/types/supportForm.ts

export type ProblemType =
  | 'connectivity'
  | 'installation'
  | 'configuration'
  | 'hardware'
  | 'software'
  | 'other';

export type UrgencyLevel = 'low' | 'medium' | 'high';

// Keep this if you merge the SupportRequestStep or logic that uses it.
// If not merging that specific step, you might not need this type.
export type SupportMethod = 'email' | 'phone' | 'remote';

export interface SupportFormData {
  // Client Information
  name: string;
  company?: string;
  email: string;
  phone?: string;

  // Device Information
  deviceModel: string; // Required field in the Device step now
  serialNumber: string;  // EUI, kept as string, optional validation
  firmwareVersion?: string;

  // Issue Description & Details
  problemType: ProblemType; // Required
  issueDescription: string; // Required
  errorMessage?: string;
  stepsToReproduce?: string;
  previousTicketId?: string;
  urgencyLevel: UrgencyLevel; // Required
  supportMethod: SupportMethod; // If support method step/logic is merged

  // File Upload
  attachments?: File[]; // Combined attachments

  // Consent (If used)
  privacyAgreed: boolean; // If consent step/logic is merged

  // Field for confirmation page state
  submittedTicketId?: number | string | null;
}

// Define the valid steps in the support form flow
export type FormStep =
  | 'clientInfo'
  | 'deviceInfo'
  | 'issueDescription'
  // | 'fileUpload' // This logic is often merged into issueDescription or review
  // | 'supportRequest' // Often merged into issueDescription or review
  | 'review'
  | 'confirmation';