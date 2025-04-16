// src/components/support/form/SupportForm.tsx

import React from "react";
import { useSupportForm } from "@/contexts/SupportFormContext"; // Corrected context path
// Import step components using relative paths within the form folder
import ClientInfoStep from "./ClientInfoStep";
import DeviceInfoStep from "./DeviceInfoStep";
import IssueDescriptionStep from "./IssueDescriptionStep";
import ReviewStep from "./ReviewStep";
import ConfirmationStep from "./ConfirmationStep";
import FormProgressBar from "./FormProgressBar"; // Relative path OK

const SupportForm: React.FC = () => { // No props needed
  const { currentStep } = useSupportForm();

  const renderStep = () => {
    switch (currentStep) {
      case "clientInfo":
        return <ClientInfoStep />;
      case "deviceInfo":
        return <DeviceInfoStep />;
      case "issueDescription":
        return <IssueDescriptionStep />;
      case "review":
        return <ReviewStep />;
      case "confirmation":
        return <ConfirmationStep />;
      default:
        // Fallback to clientInfo, should ideally not happen with strict step control
        console.warn(`SupportForm encountered unexpected step: ${currentStep}. Defaulting to clientInfo.`);
        return <ClientInfoStep />;
    }
  };

  return (
    // Max width and centering are now handled by the parent TechnicalSupportForm component
    <div className="w-full">
      <FormProgressBar />
       {/* Add a key to the container div to help React with transitions if needed */}
      <div key={currentStep} className="mt-4"> {/* Wrap rendering step */}
          {renderStep()}
      </div>
    </div>
  );
};

export default SupportForm;