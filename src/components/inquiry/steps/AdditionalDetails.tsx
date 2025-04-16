// src/components/inquiry/steps/AdditionalDetails.tsx

import React from "react";
import QuestionContainer from "../QuestionContainer"; // Relative path should be correct
import { InquiryFormData } from "@/utils/formUtils"; // Use InquiryFormData // Assuming alias is correct
import { Textarea } from "@/components/ui/textarea"; // Assuming alias is correct
import type { SetStateAction } from 'react'; // Import SetStateAction type

// Updated Props Type
type AdditionalDetailsProps = {
  formData: InquiryFormData; // Use InquiryFormData
  setFormData: React.Dispatch<SetStateAction<InquiryFormData>>; // Use InquiryFormData
  onNext: () => void;
  onPrev: () => void;
};

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  // --- Functionality remains the same ---
  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      additionalDetails: e.target.value,
    }));
  };

  return (
    <QuestionContainer
      title="Additional Project Details"
      description="Please provide any specific requirements or challenges"
      onNext={onNext} // This will now trigger the SummaryPage
      onPrev={onPrev}
      isFirstStep={false}
      // This is conceptually the last *input* step before Summary
      // The QuestionContainer prop 'isLastStep' determines button text ("Submit" vs "Next")
      // Let's keep it false so the button says "Next" to go to Summary
      isLastStep={false}
      nextDisabled={false} // Additional details are optional
    >
      <div className="space-y-4">
        <Textarea
          placeholder="Enter any additional project details, specific requirements, challenges, or expectations..."
          className="min-h-[200px]"
          value={formData.additionalDetails}
          onChange={handleDetailsChange}
        />
        <p className="text-sm text-gray-500">
          This information helps our team better understand your project needs and provide more accurate recommendations.
        </p>
      </div>
    </QuestionContainer>
  );
};

export default AdditionalDetails;