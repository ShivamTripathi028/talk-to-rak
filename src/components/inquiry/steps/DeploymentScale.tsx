// src/components/inquiry/steps/DeploymentScale.tsx

import React from "react";
import QuestionContainer from "../QuestionContainer"; // Relative path should be correct
import { InquiryFormData, deploymentScales } from "@/utils/formUtils"; // Use InquiryFormData // Alias should be correct
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Alias should be correct
import { Label } from "@/components/ui/label"; // Alias should be correct
import type { SetStateAction } from 'react'; // Import SetStateAction type

// Updated Props Type
type DeploymentScaleProps = {
  formData: InquiryFormData; // Use InquiryFormData
  setFormData: React.Dispatch<SetStateAction<InquiryFormData>>; // Use InquiryFormData
  onNext: () => void;
  onPrev: () => void;
};

const DeploymentScale: React.FC<DeploymentScaleProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  // --- Functionality remains the same ---
  const handleScaleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      scale: value,
    }));
  };

  // Validation: Check if a scale has been selected
  const isNextDisabled = formData.scale === "";

  // Helper for descriptions (adjust based on actual strings in deploymentScales)
  const getScaleDescription = (scale: string): string | null => {
     if (scale.includes("Proof of Concept")) return "Ideal for testing concepts and initial validation.";
     if (scale.includes("Pilot")) return "Suitable for small trials in a limited environment.";
     if (scale.includes("Small Scale")) return "Appropriate for single sites or focused deployments.";
     if (scale.includes("Medium Scale")) return "Covers larger facilities or multiple locations.";
     if (scale.includes("Large Scale")) return "For extensive deployments across broad areas or many sites.";
     if (scale.includes("Very Large Scale")) return "Massive deployments requiring robust network management.";
     if (scale.includes("Unsure")) return "Helps us understand if scalability planning is needed.";
     return null; // Default no description
  }


  return (
    <QuestionContainer
      title="Deployment Scale"
      description="Estimate the total number of end-devices you plan to deploy for this project."
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={isNextDisabled} // Use validation state
    >
      <div className="space-y-6">
        <RadioGroup
          value={formData.scale}
          onValueChange={handleScaleChange}
          className="space-y-3"
          aria-label="Deployment Scale Options"
          aria-required="true"
        >
          {deploymentScales.map((scale) => (
            // Use Label for better accessibility and click area
            <Label
              key={scale}
              htmlFor={`scale-${scale.replace(/[\s/()<>+-]+/g, '-').toLowerCase()}`} // Generate safer ID
              className={`flex items-center space-x-3 p-3 border rounded-md transition-all cursor-pointer has-[:checked]:border-iot-blue has-[:checked]:bg-iot-pastel-blue ${
                formData.scale === scale
                  ? "border-iot-blue bg-iot-pastel-blue"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <RadioGroupItem
                value={scale}
                id={`scale-${scale.replace(/[\s/()<>+-]+/g, '-').toLowerCase()}`}
              />
              <span className="flex-1 text-sm font-medium">{scale}</span>
            </Label>
          ))}
        </RadioGroup>

         {isNextDisabled && ( /* Basic validation feedback */
             <p className="text-red-600 text-xs mt-1">Please select the estimated deployment scale.</p>
         )}

        {/* Conditional Description */}
        {formData.scale && getScaleDescription(formData.scale) && (
          <div className="p-4 bg-iot-pastel-blue border border-iot-blue/30 rounded-md animate-fade-in mt-4">
            <h4 className="font-medium text-iot-dark-blue">Selected Scale: {formData.scale}</h4>
            <p className="mt-1 text-sm text-gray-700">
              {getScaleDescription(formData.scale)}
            </p>
          </div>
        )}
      </div>
    </QuestionContainer>
  );
};

export default DeploymentScale;