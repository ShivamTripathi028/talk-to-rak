// src/components/inquiry/steps/ApplicationType.tsx

import React, { useState } from "react";
import QuestionContainer from "../QuestionContainer"; // Relative path should be correct
import { InquiryFormData, applicationTypes } from "@/utils/formUtils"; // Use InquiryFormData // Alias should be correct
import { Label } from "@/components/ui/label"; // Alias should be correct
// Corrected lucide-react imports - only import what's used
import { Cpu, Power, MapPin, Wifi, Home, Building, Cpu as DefaultIcon } from "lucide-react";
import OptionCard from "../OptionCard"; // Relative path should be correct
import { Checkbox } from "@/components/ui/checkbox"; // Alias should be correct
import { Input } from "@/components/ui/input"; // Alias should be correct
import type { SetStateAction } from 'react'; // Import SetStateAction type

// Updated Props Type
type ApplicationTypeProps = {
  formData: InquiryFormData; // Use InquiryFormData
  setFormData: React.Dispatch<SetStateAction<InquiryFormData>>; // Use InquiryFormData
  onNext: () => void;
  onPrev: () => void;
};

const ApplicationType: React.FC<ApplicationTypeProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  // --- State and handlers remain largely the same ---
  const [selectedType, setSelectedType] = useState(formData.application.type);
  const [otherSubtype, setOtherSubtype] = useState(formData.application.otherSubtype || "");

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setFormData((prev) => ({
      ...prev,
      application: {
        type,
        subtypes: [], // Reset subtypes when type changes
        otherSubtype: "" // Reset other text as well
      },
    }));
    setOtherSubtype(""); // Reset local state for other text
  };

  const handleSubtypeToggle = (subtype: string) => {
    setFormData((prev) => {
      const currentSubtypes = [...prev.application.subtypes];
      let newSubtypes: string[];
      let newOtherSubtype = prev.application.otherSubtype; // Keep current other text by default

      if (currentSubtypes.includes(subtype)) {
        newSubtypes = currentSubtypes.filter((item) => item !== subtype);
         // If unchecking "Other", also clear the text field
         if (subtype === "Other") {
           setOtherSubtype(""); // Clear local state
           newOtherSubtype = ""; // Clear form data state
         }
      } else {
        newSubtypes = [...currentSubtypes, subtype];
      }

      return {
        ...prev,
        application: {
          ...prev.application,
          subtypes: newSubtypes,
          otherSubtype: newOtherSubtype, // Update form data other text
        },
      };
    });
  };

  const handleOtherSubtypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherSubtype(value); // Update local state

    setFormData((prev) => ({ // Update form data state
      ...prev,
      application: {
        ...prev.application,
        otherSubtype: value
      }
    }));

    // Automatically check/uncheck "Other" subtype based on text input presence
    const otherIsSelected = formData.application.subtypes.includes("Other");
    if (value.trim() && !otherIsSelected) {
      // If text entered and "Other" not selected, select "Other"
       setFormData((prev) => ({
          ...prev,
          application: {
             ...prev.application,
             subtypes: [...prev.application.subtypes, "Other"],
             otherSubtype: value,
          },
       }));
    } else if (!value.trim() && otherIsSelected) {
      // If text cleared and "Other" is selected, deselect "Other"
       setFormData((prev) => ({
          ...prev,
          application: {
             ...prev.application,
             subtypes: prev.application.subtypes.filter(s => s !== "Other"),
             otherSubtype: value,
          },
       }));
    }
  };

  // Updated icon mapping based on applicationTypes in formUtils.ts
  const getIconForType = (type: string) => {
    switch (type) {
      case "Monitoring": return <Cpu />;
      case "Asset Tracking": return <MapPin />;
      case "Control & Automation": return <Power />;
      case "Gateway & Network": return <Wifi />;
      case "Smart Agriculture": return <Home />;
      case "Smart City / Utility": return <Building />;
      case "Other Application": return <DefaultIcon />;
      default: return <DefaultIcon />;
    }
  };

  // Find the selected application type details from the constants
  const selectedAppType = applicationTypes.find(
    (app) => app.type === selectedType
  );

  // Validation: Ensure type is selected and at least one subtype is chosen
  // Also ensure 'Other' subtype has text if selected
  const isNextDisabled = !formData.application.type || formData.application.subtypes.length === 0 || (formData.application.subtypes.includes("Other") && !formData.application.otherSubtype?.trim());

  return (
    <QuestionContainer
      title="Application Type"
      description="What is the primary use case for your IoT solution?"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={isNextDisabled} // Use calculated validation state
    >
      <div className="space-y-6">
        {/* Application Type Selection */}
        <div>
          <h3 className="text-lg font-medium mb-3">Select Primary Application Area <span className="text-red-500">*</span></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {applicationTypes.map((app) => (
              <OptionCard
                key={app.type}
                icon={getIconForType(app.type)}
                title={app.type}
                selected={selectedType === app.type}
                onClick={() => handleTypeSelect(app.type)}
                className="h-full" // Ensure cards have consistent height
              />
            ))}
          </div>
        </div>

        {/* Application Subtype Selection (Conditional) */}
        {selectedType && selectedAppType && (
          <div className="animate-fade-in mt-6">
            <h3 className="text-lg font-medium mb-3">Select Specific Use Cases <span className="text-red-500">*</span> (Choose one or more)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedAppType.subtypes.map((subtype) => (
                <div
                  key={subtype}
                  className={`p-3 border rounded-md cursor-pointer transition-all flex items-start gap-3 ${ // Use flex layout
                    formData.application.subtypes.includes(subtype)
                      ? "border-iot-blue bg-iot-pastel-blue" // Use pastel blue for selected
                      : "border-gray-200 hover:border-iot-blue/50 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSubtypeToggle(subtype)}
                  role="checkbox"
                  aria-checked={formData.application.subtypes.includes(subtype)}
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSubtypeToggle(subtype)}
                >
                  <Checkbox
                    id={`subtype-${subtype.replace(/[\s/]+/g, '-').toLowerCase()}`}
                    checked={formData.application.subtypes.includes(subtype)}
                    // Let the div's onClick handle the state update primarily
                    // onCheckedChange={() => handleSubtypeToggle(subtype)}
                    className="mt-1 flex-shrink-0" // Align checkbox slightly and prevent shrinking
                    aria-labelledby={`subtype-label-${subtype.replace(/[\s/]+/g, '-').toLowerCase()}`}
                  />
                  <div className="flex-1 min-w-0"> {/* Allow label/input to take space */}
                    <Label
                      htmlFor={`subtype-${subtype.replace(/[\s/]+/g, '-').toLowerCase()}`}
                      id={`subtype-label-${subtype.replace(/[\s/]+/g, '-').toLowerCase()}`}
                      className="cursor-pointer leading-tight"
                    >
                      {subtype}
                    </Label>
                    {/* Conditionally render input for "Other" */}
                    {subtype === "Other" && formData.application.subtypes.includes("Other") && (
                      <div className="mt-2">
                        <Input
                          placeholder="Please specify other use case"
                          value={otherSubtype}
                          onChange={handleOtherSubtypeChange}
                          onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with input
                          className="text-sm h-9" // Slightly smaller input
                          required={formData.application.subtypes.includes("Other")} // Make required if Other is checked
                          aria-required={formData.application.subtypes.includes("Other")}
                        />
                        {formData.application.subtypes.includes("Other") && !otherSubtype.trim() && (
                           <p className="text-red-600 text-xs mt-1">Specification is required when 'Other' is selected.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Display (Conditional) */}
        {formData.application.type && formData.application.subtypes.length > 0 && !isNextDisabled && ( // Show summary only if step is valid
          <div className="p-4 bg-iot-pastel-blue border border-iot-blue/30 rounded-md animate-fade-in mt-6">
            <h4 className="font-medium text-iot-dark-blue">Selected Application:</h4>
            <p className="mt-1 text-sm">
              <span className="font-semibold">{formData.application.type}</span>
              {/* Correctly encode the greater-than sign */}
              <span className="mx-1">{'>'}</span>
              {formData.application.subtypes
                .filter(sub => sub !== "Other") // Don't list "Other" itself
                .join(", ")
              }
              {/* Display "Other" subtype text if specified */}
              {formData.application.subtypes.includes("Other") && otherSubtype.trim() && (
                <>
                  {/* Add comma only if other subtypes *also* exist */}
                  {formData.application.subtypes.filter(s => s !== "Other").length > 0 && ', '}
                  <span className="italic">Other: {otherSubtype.trim()}</span>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </QuestionContainer>
  );
};

export default ApplicationType;