'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Step1BasicDetails } from './Step1BasicDetails';
import { Step2EligibilityCriteria } from './Step2EligibilityCriteria';
import { Step3RequiredDocuments } from './Step3RequiredDocuments';
import { Step4EvaluationSettings } from './Step4EvaluationSettings';
import { Step5ReviewPublish } from './Step5ReviewPublish';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateTenderPayload } from '@/lib/types/Tender';
import { tenderClientApi } from '@/api/client/TenderClientService';

const steps = [
  { number: 1, label: 'Basic Details', description: 'Tender identity & timeline' },
  { number: 2, label: 'Eligibility', description: 'Qualifying criteria' },
  { number: 3, label: 'Documents', description: 'Required document types' },
  { number: 4, label: 'Evaluation', description: 'Decision rules' },
  { number: 5, label: 'Review & Publish', description: 'Confirm and go live' },
];

const initialFormData: CreateTenderPayload = {
  title: '',
  department: '',
  description: '',
  submissionStartDate: null,
  submissionDeadline: null,
  budgetMin: 0,
  budgetMax: 0,
  category: '',
  eligibilityCriteria: [],
  requiredDocuments: [],
  evaluationRules: {
    allMandatoryMustPass: true,
    evaluationMode: 'confidence_based',
    manualOverrideAllowed: true,
  },
  confidenceThresholds: { autoAccept: 0.9, needsReview: 0.6 },
};

// Status colors as inline styles — avoids Tailwind purge issues
const STATUS_STYLES = {
  empty: {
    circle: { background: 'var(--color-muted, #f1f5f9)', border: '2px solid #cbd5e1', color: '#94a3b8' },
    label: { color: '#94a3b8' },
    connector: '#e2e8f0',
  },
  partial: {
    circle: { background: '#fefce8', border: '2px solid #f59e0b', color: '#92400e' },
    label: { color: '#b45309' },
    connector: '#fcd34d',
  },
  complete: {
    circle: { background: '#f0fdf4', border: '2px solid #22c55e', color: '#15803d' },
    label: { color: '#15803d' },
    connector: '#86efac',
  },
  active: {
    circle: { background: 'var(--background)', border: '2px solid currentColor', color: 'inherit' },
    label: { color: 'inherit', fontWeight: 500 },
  },
};

// ── Validation helpers ─────────────────────────────────────────────────────────

type StepStatus = 'empty' | 'partial' | 'complete';

export function getStep1Status(data: CreateTenderPayload): StepStatus {
  const required = [data.title, data.department, data.description, data.category];
  const filled = required.filter(Boolean).length;
  const datesOk = !!data.submissionStartDate && !!data.submissionDeadline;
  const budgetOk = data.budgetMin > 0 && data.budgetMax >= data.budgetMin;
  const totalFields = required.length + 2; // + dates + budget
  const filledTotal = filled + (datesOk ? 1 : 0) + (budgetOk ? 1 : 0);

  if (filledTotal === 0) return 'empty';
  if (filled === required.length && datesOk && budgetOk) return 'complete';
  return 'partial';
}

export function getStep2Status(data: CreateTenderPayload): StepStatus {
  if (data.eligibilityCriteria.length === 0) return 'empty';
  const allFilled = data.eligibilityCriteria.every(
    (c) => c.name && c.field && c.value
  );
  return allFilled ? 'complete' : 'partial';
}

export function getStep3Status(data: CreateTenderPayload): StepStatus {
  if (data.requiredDocuments.length === 0) return 'empty';
  const allFilled = data.requiredDocuments.every(
    (d) => d.name && d.validationType
  );
  return allFilled ? 'complete' : 'partial';
}

export function getStep4Status(_data: CreateTenderPayload): StepStatus {
  return 'complete'; // always has defaults
}

export function getStepStatus(step: number, data: CreateTenderPayload): StepStatus {
  switch (step) {
    case 1: return getStep1Status(data);
    case 2: return getStep2Status(data);
    case 3: return getStep3Status(data);
    case 4: return getStep4Status(data);
    default: return 'empty';
  }
}

export function isFormValid(data: CreateTenderPayload): boolean {
  return (
    getStep1Status(data) === 'complete' &&
    getStep2Status(data) === 'complete' &&
    getStep3Status(data) === 'complete'
  );
}

// ── Step indicator ─────────────────────────────────────────────────────────────

function StepIndicator({
  steps,
  currentStep,
  visitedSteps,
  data,
  onStepClick,
}: {
  steps: { number: number; label: string; description: string }[];
  currentStep: number;
  visitedSteps: Set<number>;
  data: CreateTenderPayload;
  onStepClick: (step: number) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem' }}>
      {steps.map((step, idx) => {
        const isActive = currentStep === step.number;
        const hasBeenVisited = visitedSteps.has(step.number);
        // Only compute status for steps that have been visited (and aren't step 5)
        const status = (hasBeenVisited && step.number < 5)
          ? getStepStatus(step.number, data)
          : 'empty';

        const isLast = idx === steps.length - 1;

        // Connector: green only if the step to the left is visited + complete
        const leftStepComplete =
          hasBeenVisited &&
          step.number < 5 &&
          getStepStatus(step.number, data) === 'complete';

        const circleStyle: React.CSSProperties = isActive
          ? {
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 500, flexShrink: 0,
              boxShadow: '0 0 0 3px rgba(0,0,0,0.08)',
              border: '2px solid currentColor',
              background: 'var(--background)',
            }
          : {
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 500, flexShrink: 0,
              transition: 'all 0.2s',
              ...STATUS_STYLES[status].circle,
            };

        const labelStyle: React.CSSProperties = isActive
          ? { fontSize: 11, fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }
          : { fontSize: 11, textAlign: 'center', lineHeight: 1.3, transition: 'color 0.2s', ...STATUS_STYLES[status].label };

        return (
          <div key={step.number} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
            {/* Circle + label */}
            <button
              onClick={() => onStepClick(step.number)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, background: 'none', border: 'none', cursor: 'pointer',
                padding: '0 2px', minWidth: 64,
              }}
            >
              <div style={circleStyle}>
                {!isActive && status === 'complete' ? (
                  <Check size={14} />
                ) : (
                  step.number
                )}
              </div>
              <div style={{ maxWidth: 72 }}>
                <p style={labelStyle}>{step.label}</p>
                <p style={{ fontSize: 10, textAlign: 'center', color: '#94a3b8', lineHeight: 1.3 }}>
                  {step.description}
                </p>
              </div>
            </button>

            {/* Connector */}
            {!isLast && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', paddingTop: 16 }}>
                <div style={{
                  height: 1.5,
                  width: '100%',
                  background: leftStepComplete ? '#86efac' : '#e2e8f0',
                  transition: 'background 0.3s',
                }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
// ── Wizard ─────────────────────────────────────────────────────────────────────

export default function CreateTenderWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([1]));
  const [formData, setFormData] = useState<CreateTenderPayload>(initialFormData);

  const updateFormData = useCallback((updates: Partial<CreateTenderPayload>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setVisitedSteps((prev) => new Set([...prev, step]));
  };

  const handleNext = () => {
    if (currentStep < steps.length) goToStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1); // going back doesn't add to visited
  };

  const handleSubmit = async () => {
    console.log('Publishing tender:', formData);
    await tenderClientApi.create(formData);
    // API call
  };

  const valid = isFormValid(formData);

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        visitedSteps={visitedSteps}
        data={formData}
        onStepClick={goToStep}
      />

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].label}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {currentStep === 1 && <Step1BasicDetails data={formData} onUpdate={updateFormData} />}
          {currentStep === 2 && <Step2EligibilityCriteria data={formData} onUpdate={updateFormData} />}
          {currentStep === 3 && <Step3RequiredDocuments data={formData} onUpdate={updateFormData} />}
          {currentStep === 4 && <Step4EvaluationSettings data={formData} onUpdate={updateFormData} />}
          {currentStep === 5 && <Step5ReviewPublish data={formData} />}

          <div className="flex justify-between gap-4 pt-6 border-t">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button onClick={handleSubmit} disabled={!valid}>
                Publish Tender
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}