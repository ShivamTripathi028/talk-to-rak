// src/components/support/form/FormProgressBar.tsx

import React from "react";
import { useSupportForm } from "@/contexts/SupportFormContext"; // Corrected context path
import { FormStep } from "@/types/supportForm"; // Corrected types path
import { Check } from "lucide-react"; // Package import is OK

// Interface for step definition within this component
interface StepInfo {
  label: string;
  value: FormStep; // Use the imported FormStep type
}

const FormProgressBar: React.FC = () => { // No props needed
  const { currentStep, goToStep, formData } = useSupportForm();

  // Define steps for the progress bar (excluding confirmation step)
  // Ensure the 'value' matches the FormStep type strings exactly
  const steps: StepInfo[] = [
    { label: "Client Info", value: "clientInfo" },
    { label: "Device Info", value: "deviceInfo" },
    { label: "Issue Details", value: "issueDescription" },
    { label: "Review", value: "review" },
  ];

  const currentVisibleStepIndex = steps.findIndex(s => s.value === currentStep);

  // Check if navigation to a previous step is allowed based on completed data
  const canGoToStep = (targetStepIndex: number): boolean => {
    // If the target step hasn't been reached yet, cannot jump via progress bar
    if (targetStepIndex > currentVisibleStepIndex) {
        return false;
    }

    // Can always go back to the first step
    if (targetStepIndex === 0) return true;

    // Validation checks for required data *before* the target step
    // Modify these checks based on the absolute minimum required data to render the target step meaningfully

    // To go back to Step 1 (Device Info) or later, need Name/Email
    if (targetStepIndex >= 1) {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        if (!formData.name.trim() || !formData.email.trim() || !isEmailValid) return false;
    }
    // To go back to Step 2 (Issue Details) or later, need Device Model
    if (targetStepIndex >= 2) {
        if (!formData.deviceModel.trim()) return false;
    }
    // To go back to Step 3 (Review) or later, need Issue Description and Urgency
    if (targetStepIndex >= 3) {
         // Added check for urgencyLevel based on previous validation logic
        if (!formData.issueDescription.trim() || !formData.urgencyLevel) return false;
    }

    return true; // Allow navigation if prerequisite data exists
  };


  // Don't show progress bar on confirmation page
  if (currentStep === "confirmation") {
    return null;
  }

  // Calculate progress for mobile bar (0-100%)
  const totalVisibleSteps = steps.length;
  // Ensure index is valid before calculation
  const progressIndex = currentVisibleStepIndex >= 0 ? currentVisibleStepIndex : 0;
  const mobileProgress = Math.min(100, Math.round(((progressIndex + 1) / totalVisibleSteps) * 100));

  return (
    <div className="mb-8"> {/* Increased bottom margin */}
      {/* Progress bar for mobile */}
      <div className="block sm:hidden mb-4">
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-support-blue rounded-full transition-all duration-500 ease-out"
            style={{ width: `${mobileProgress}%` }}
            role="progressbar"
            aria-valuenow={mobileProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Form progress"
          ></div>
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-gray-600 font-medium">
          {/* Ensure index is valid before accessing steps array */}
          <span>{currentVisibleStepIndex >= 0 ? steps[currentVisibleStepIndex]?.label : 'Start'}</span>
          <span>{currentVisibleStepIndex >= 0 ? currentVisibleStepIndex + 1 : 1} / {totalVisibleSteps}</span>
        </div>
      </div>

      {/* Full progress bar for larger screens */}
      <div className="hidden sm:flex justify-between items-start">
        {steps.map((step, index) => {
          const isActive = step.value === currentStep;
          // A step is considered "past" if the current step's index is greater than this step's index
          const isPast = currentVisibleStepIndex > index;
          const isClickable = canGoToStep(index); // Determine if clicking is allowed

          return (
            // Use div with "contents" to avoid breaking flex layout while allowing data attributes
            <React.Fragment key={step.value}> {/* Use Fragment for key */}
              {/* Step circle and label container */}
              <div className="flex flex-col items-center text-center flex-shrink-0 w-24"> {/* Adjusted width */}
                <button
                  type="button"
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm mb-1.5 transition-all duration-200 border-2 ${ // Consistent styling
                    isActive
                      ? "bg-support-blue text-white border-support-blue ring-2 ring-offset-2 ring-support-blue/50 scale-110" // Active style with scale
                      : isPast
                      ? "bg-support-blue text-white border-support-blue" // Completed style
                      : isClickable
                      ? "bg-white text-support-blue border-support-blue hover:bg-blue-50" // Clickable future step
                      : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed opacity-70" // Disabled future step
                  } ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                  onClick={() => isClickable && goToStep(step.value)}
                  disabled={!isClickable}
                  aria-label={`Go to step ${index + 1}: ${step.label}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isPast ? <Check className="w-5 h-5" /> : index + 1} {/* Show checkmark */}
                </button>
                <span className={`text-xs w-full truncate px-1 ${isActive ? "font-semibold text-support-blue" : "text-gray-600"}`}>{step.label}</span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center pt-4 mx-1 self-start"> {/* Align line */}
                  <div
                    className={`h-1 w-full transition-colors duration-300 rounded ${ // Line styling
                      isPast ? "bg-support-blue" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FormProgressBar;