'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Step1BasicDetails } from './Step1BasicDetails';
import { Step2EligibilityCriteria } from './Step2EligibilityCriteria';
import { Step3RequiredDocuments } from './Step3RequiredDocuments';
import { Step4EvaluationSettings } from './Step4EvaluationSettings';
import { Step5ReviewPublish } from './Step5ReviewPublish';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface TenderFormData {
  // Step 1
  title: string;
  department: string;
  description: string;
  deadline: Date;
  budgetMin: number;
  budgetMax: number;
  category: string;

  // Step 2
  eligibilityCriteria: Array<{
    id: string;
    name: string;
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
    description?: string;
  }>;

  // Step 4
  evaluationRules: {
    allMandatoryMustPass: boolean;
  };
  confidenceThresholds: {
    autoAccept: number;
    needsReview: number;
  };
}

const steps = [
  { number: 1, label: 'Basic Details', description: 'Tender information' },
  { number: 2, label: 'Eligibility Criteria', description: 'Rules for qualifying' },
  { number: 3, label: 'Required Documents', description: 'Document types needed' },
  { number: 4, label: 'Evaluation Settings', description: 'Decision rules' },
  { number: 5, label: 'Review & Publish', description: 'Confirm and publish' },
];

const initialFormData: TenderFormData = {
  title: '',
  department: '',
  description: '',
  deadline: new Date(),
  budgetMin: 0,
  budgetMax: 0,
  category: '',
  eligibilityCriteria: [],
  requiredDocuments: [],
  evaluationRules: { allMandatoryMustPass: true },
  confidenceThresholds: { autoAccept: 0.9, needsReview: 0.6 },
};

export function CreateTenderWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TenderFormData>(initialFormData);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Publishing tender:', formData);
    // API call to save tender
  };

  const updateFormData = (updates: Partial<TenderFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`flex-1 ${idx < steps.length - 1 ? 'relative' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.number}
                </div>
                <div>
                  <p className="font-medium text-sm">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-12 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].label}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {currentStep === 1 && (
            <Step1BasicDetails
              data={formData}
              onUpdate={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <Step2EligibilityCriteria
              data={formData}
              onUpdate={updateFormData}
            />
          )}
          {currentStep === 3 && (
            <Step3RequiredDocuments
              data={formData}
              onUpdate={updateFormData}
            />
          )}
          {currentStep === 4 && (
            <Step4EvaluationSettings
              data={formData}
              onUpdate={updateFormData}
            />
          )}
          {currentStep === 5 && (
            <Step5ReviewPublish
              data={formData}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button onClick={handleSubmit} className="gap-2">
                Publish Tender
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
