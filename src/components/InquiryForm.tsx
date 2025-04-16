// src/components/InquiryForm.tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import IoTQuestionnaire from './inquiry/IoTQuestionnaire'; // Ensure this path is correct now
import { Button } from '@/components/ui/button';

interface InquiryFormProps {
  goBack: () => void;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ goBack }) => {
  return (
    // --- RE-ADD container/max-width classes to this div ---
    <div className="min-h-screen bg-gradient-to-b from-white to-iot-light-blue py-8">
      <div className="container mx-auto px-4 max-w-5xl"> {/* Re-added container */}

        {/* Back Button */}
        <Button
            variant="outline"
            onClick={goBack}
            className="mb-6 flex items-center text-iot-dark-blue border-iot-dark-blue hover:bg-iot-light-blue"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Selection
        </Button>

        {/* Header Section */}
        <header className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center mb-4">
                <div className="w-10 h-10 rounded-full bg-iot-blue flex items-center justify-center mr-2 shadow">
                    <span className="text-white font-bold text-lg">R</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                RAK <span className="text-iot-blue">IoT</span> Device Requirements
                </h1>
            </div>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                Complete this questionnaire to help us understand your project needs and recommend the best RAKwireless solutions.
            </p>
        </header>

        {/* Main Questionnaire Content */}
        {/* Changed back to main tag */}
        <main className="bg-white/80 backdrop-blur-sm rounded-xl shadow-card p-4 md:p-6 border border-gray-100">
            <IoTQuestionnaire />
        </main>

        {/* Footer Section */}
        {/* Changed back to footer tag */}
        <footer className="mt-16 mb-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} RAKwireless Technology Limited. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default InquiryForm;