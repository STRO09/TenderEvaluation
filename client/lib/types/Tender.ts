export type Tender = {
  // Step 1
  id: string;
  title: string;
  department: string;
  status: 'draft' | 'published' | 'closed';
  description: string;
  submissionStartDate: Date | null;
  submissionDeadline: Date | null;
  budgetMin: number;
  budgetMax: number;
  category: string;
  createdAt: string;

  // Step 2
  eligibilityCriteria: Array<{
    id: string;
    name: string;
    field: string;       // e.g. 'annualTurnover', 'experienceYears', 'gstValid'
    unit: string;        // e.g. 'INR', 'years', ''
    type: 'numeric' | 'boolean' | 'document';
    condition: string;
    value: string;
    mandatory: boolean;
  }>;

  // Step 3
  requiredDocuments: Array<{
    id: string;
    name: string;
    mandatory: boolean;
    validationType: 'registration' | 'financial' | 'identity' | 'technical' | 'other';
    verificationSource: 'GST_API' | 'MCA_API' | 'manual' | 'none';
    description?: string;
  }>;

  // Step 4
  evaluationRules: {
    allMandatoryMustPass: boolean;
    evaluationMode: 'strict' | 'confidence_based';
    manualOverrideAllowed: boolean;
  };
  confidenceThresholds: {
    autoAccept: number;
    needsReview: number;
  };
};

export type CreateTenderPayload = Omit<Tender, 'id' | 'createdAt' | 'status'>;
