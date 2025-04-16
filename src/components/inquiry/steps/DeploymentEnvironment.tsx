// src/components/inquiry/steps/DeploymentEnvironment.tsx

import React from "react";
import QuestionContainer from "../QuestionContainer"; // Relative path should be correct
import { InquiryFormData } from "@/utils/formUtils"; // Use InquiryFormData // Alias should be correct
import OptionCard from "../OptionCard"; // Relative path should be correct
import { Home, Trees } from "lucide-react"; // Removed unused HomeIcon
import type { SetStateAction } from 'react'; // Import SetStateAction type

// Define the specific environment types allowed
type EnvironmentType = "Indoor" | "Outdoor" | "Both";

// Updated Props Type
type DeploymentEnvironmentProps = {
  formData: InquiryFormData; // Use InquiryFormData
  setFormData: React.Dispatch<SetStateAction<InquiryFormData>>; // Use InquiryFormData
  onNext: () => void;
  onPrev: () => void;
};

const DeploymentEnvironment: React.FC<DeploymentEnvironmentProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  // --- Functionality remains the same ---
  const handleEnvironmentSelect = (environment: EnvironmentType) => {
    setFormData((prev) => ({
      ...prev,
      deployment: {
        ...prev.deployment,
        environment, // environment type is already correct 'Indoor' | 'Outdoor' | 'Both'
      },
    }));
  };

  // Validation: Check if an environment has been selected
  const isNextDisabled = formData.deployment.environment === null;

  return (
    <QuestionContainer
      title="Deployment Environment"
      description="Where will the IoT devices be deployed?"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={isNextDisabled} // Use validation state
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> {/* Changed to sm:grid-cols-3 */}
        <OptionCard
          icon={<Home />}
          title="Indoor"
          selected={formData.deployment.environment === "Indoor"}
          onClick={() => handleEnvironmentSelect("Indoor")}
          className="h-full" // Ensure consistent height
        />
        <OptionCard
          icon={<Trees />}
          title="Outdoor"
          selected={formData.deployment.environment === "Outdoor"}
          onClick={() => handleEnvironmentSelect("Outdoor")}
          className="h-full" // Ensure consistent height
        />
        {/* Combined Icon for 'Both' */}
        <OptionCard
          icon={<div className="flex items-center justify-center space-x-1"><Home className="w-5 h-5" /><Trees className="w-5 h-5" /></div>}
          title="Both Indoor & Outdoor"
          selected={formData.deployment.environment === "Both"}
          onClick={() => handleEnvironmentSelect("Both")}
          className="h-full" // Ensure consistent height
        />
      </div>

      {/* Conditional Description based on selection */}
      {formData.deployment.environment && (
        <div className="mt-6 p-4 bg-iot-pastel-blue border border-iot-blue/30 rounded-md animate-fade-in">
          <h4 className="font-medium text-iot-dark-blue">Selected Environment: {formData.deployment.environment}</h4>
          {formData.deployment.environment === "Indoor" && (
            <p className="mt-2 text-sm text-gray-700">
              Consider factors like signal penetration through walls, Wi-Fi/Ethernet availability, and standard temperature ranges.
            </p>
          )}
          {formData.deployment.environment === "Outdoor" && (
            <p className="mt-2 text-sm text-gray-700">
              Requires weatherproof (IP-rated) enclosures, potentially longer battery life or solar power, and robust LoRaWAN coverage.
            </p>
          )}
          {formData.deployment.environment === "Both" && (
            <p className="mt-2 text-sm text-gray-700">
              A mix of devices may be needed, balancing indoor requirements with outdoor durability and connectivity needs.
            </p>
          )}
        </div>
      )}
    </QuestionContainer>
  );
};

export default DeploymentEnvironment;