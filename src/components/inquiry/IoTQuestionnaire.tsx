// src/components/inquiry/IoTQuestionnaire.tsx

import React, { useState } from "react";
// Corrected import: Use InquiryFormData
import { InquiryFormData, initialInquiryFormData} from "@/utils/formUtils"; // Use InquiryFormData and initialInquiryFormData
// Import step components using relative paths (assuming they are in ./steps/)
import ClientInformation from "./steps/ClientInformation";
import RegionSelection from "./steps/RegionSelection";
import DeploymentEnvironment from "./steps/DeploymentEnvironment";
import ApplicationType from "./steps/ApplicationType";
import DeploymentScale from "./steps/DeploymentScale";
import ConnectivityAndPower from "./steps/ConnectivityAndPower"; // Ensure this is used, not ConnectivityOptions or PowerSource
import AdditionalDetails from "./steps/AdditionalDetails";
import SummaryPage from "./steps/SummaryPage";
// Optionally import the stepper if you want to add it back
// import QuestionnaireStepper from './QuestionnaireStepper';

const IoTQuestionnaire: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  // Corrected state type: Use InquiryFormData
  const [formData, setFormData] = useState<InquiryFormData>(initialInquiryFormData); // Use InquiryFormData and initialInquiryFormData
  const [showSummary, setShowSummary] = useState(false);

  // Define step labels for display
  const stepLabels = [
    "Client Info",
    "Region",
    "Environment",
    "Application",
    "Scale",
    "Connectivity & Power",
    "Details",
    "Summary", // Added Summary label
  ];
  const totalInputSteps = stepLabels.length - 1; // Total steps before summary

  const nextStep = () => {
    // Validate current step before proceeding (optional but good practice)
    // if (!isStepValid(currentStep, formData)) {
    //   // Optionally show toast or error message
    //   console.warn(`Step ${currentStep} is not valid.`);
    //   return;
    // }

    if (currentStep === totalInputSteps) {
      setShowSummary(true); // Show summary after the last input step
    } else if (currentStep < totalInputSteps) {
      setCurrentStep((prev) => prev + 1);
    }
     window.scrollTo(0, 0); // Scroll to top on step change
  };

  const prevStep = () => {
    if (showSummary) {
      setShowSummary(false); // Go back from summary to the last input step
      // No need to change currentStep here, it stays at the last input step number
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
     window.scrollTo(0, 0); // Scroll to top on step change
  };

  const resetForm = () => {
    setFormData(initialInquiryFormData); // Use initialInquiryFormData
    setCurrentStep(1);
    setShowSummary(false);
     window.scrollTo(0, 0); // Scroll to top on reset
  };

  // Function to render the current step component
  const renderStep = () => {
    if (showSummary) {
      return (
        <SummaryPage
          formData={formData}
          onPrev={prevStep} // Go back to the last input step
          onReset={resetForm} // Reset the form
        />
      );
    }

    // Render step based on currentStep number
    switch (currentStep) {
      case 1: return <ClientInformation formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />;
      case 2: return <RegionSelection formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />;
      case 3: return <DeploymentEnvironment formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />;
      case 4: return <ApplicationType formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />;
      case 5: return <DeploymentScale formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />;
      case 6: return <ConnectivityAndPower formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />; // Ensure this is the correct component
      case 7: return <AdditionalDetails formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />; // nextStep here will trigger summary
      default: return <div>Invalid Step</div>; // Fallback case
    }
  };

  // Determine the label for the current step indicator
  const currentStepLabel = showSummary ? stepLabels[totalInputSteps] : stepLabels[currentStep - 1];
  const currentStepNumber = showSummary ? totalInputSteps + 1 : currentStep;

  return (
    // Removed py-8, as parent InquiryForm adds padding
    <div className="w-full">
       {/* Optional: Add QuestionnaireStepper component here if desired */}
       {/* <QuestionnaireStepper currentStep={currentStep} steps={stepLabels.slice(0, totalInputSteps)} /> */}

      {/* Step Indicator */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center mb-2 px-4 py-1 bg-iot-pastel-blue border border-iot-blue/50 rounded-full text-sm font-medium text-iot-dark-blue shadow-sm">
          Step {currentStepNumber} of {stepLabels.length}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{currentStepLabel}</h3>
      </div>

      {/* Render the active step component */}
      <div className="mt-4 relative"> {/* Added relative positioning for potential transitions */}
        {renderStep()}
      </div>
    </div>
  );
};

export default IoTQuestionnaire;