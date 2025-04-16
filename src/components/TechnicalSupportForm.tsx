// src/components/TechnicalSupportForm.tsx
import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import SupportForm from './support/form/SupportForm';
import { useSupportForm } from '@/contexts/SupportFormContext';
import { Button } from '@/components/ui/button';

interface TechnicalSupportFormProps {
  goBack: () => void;
}

// Internal component to render content based on step
const SupportFormContent: React.FC<TechnicalSupportFormProps> = ({ goBack }) => {
    const { currentStep } = useSupportForm();

    if (currentStep === 'confirmation') {
        return <SupportForm />;
    }

    return (
        // --- RE-ADD max-width/container classes here ---
        <div className="container mx-auto px-4 max-w-3xl">
            {/* Back Button */}
            <Button
                variant="outline"
                onClick={goBack}
                className="mb-6 flex items-center text-support-blue border-support-blue hover:bg-blue-50"
            >
                <ArrowLeft size={18} className="mr-2" /> Back to Selection
            </Button>

             {/* Header Section */}
            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    RAKwireless Technical Support
                </h1>
                 <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                   Submit a ticket for help with device setup, configuration, firmware, and other technical issues.
                </p>
            </header>

             {/* Informational Message */}
             <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md relative mb-6 text-sm flex gap-3 items-start" role="alert">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                    For Technical Support requests (device setup, configuration, firmware, etc.), your ticket will be handled by the RAK technical team via the Technical-Support channel/group in Zendesk.
                </span>
             </div>

            {/* Render the core multi-step form component */}
            <SupportForm />
        </div>
    );
}

// Main Exported Component
const TechnicalSupportForm: React.FC<TechnicalSupportFormProps> = ({ goBack }) => {
  return (
    // --- RE-ADD py-8 to this outer div ---
    <div className="min-h-screen bg-gray-50 py-8">
       <SupportFormContent goBack={goBack} />
    </div>
  );
};

export default TechnicalSupportForm;