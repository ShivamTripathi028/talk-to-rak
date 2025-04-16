// src/components/inquiry/steps/ClientInformation.tsx

import React from "react";
import { Input } from "@/components/ui/input"; // Assuming alias is correct
import { Label } from "@/components/ui/label"; // Assuming alias is correct
import QuestionContainer from "../QuestionContainer"; // Relative path should be correct
import { InquiryFormData } from "@/utils/formUtils"; // Use InquiryFormData // Assuming alias is correct
import type { SetStateAction } from 'react'; // Import SetStateAction type

// Updated Props Type
type ClientInformationProps = {
  formData: InquiryFormData; // Use InquiryFormData
  setFormData: React.Dispatch<SetStateAction<InquiryFormData>>; // Use InquiryFormData
  onNext: () => void;
  onPrev: () => void;
};

const ClientInformation: React.FC<ClientInformationProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  // --- Functionality remains the same ---
  const updateClientInfo = (field: keyof InquiryFormData['clientInfo'], value: string) => { // More specific type for field
    setFormData((prev) => ({
      ...prev,
      clientInfo: {
        ...prev.clientInfo,
        [field]: value,
      },
    }));
  };

  // Use the validation function from formUtils if preferred, or keep local
  // import { isClientInfoComplete } from "@/utils/formUtils";
  const isFormValid = () => {
    const { name, email, contactNumber } = formData.clientInfo;
    const isEmailValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Added email format check
    return name.trim() !== "" && email.trim() !== "" && isEmailValidFormat && contactNumber.trim() !== "";
  };

  return (
    <QuestionContainer
      title="Client Information"
      description="Please provide your contact details"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={true}
      isLastStep={false}
      nextDisabled={!isFormValid()} // Use validation function
    >
      <div className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.clientInfo.name}
            onChange={(e) => updateClientInfo("name", e.target.value)}
            placeholder="Enter your full name"
            required
            aria-required="true"
          />
          {/* Basic validation message example (optional) */}
          {/* {formData.clientInfo.name.trim() === '' && <p className="text-red-600 text-xs mt-1">Name is required.</p>} */}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            value={formData.clientInfo.email}
            onChange={(e) => updateClientInfo("email", e.target.value)}
            placeholder="Enter your email address"
            required
            aria-required="true"
            // Add visual feedback for invalid email format (optional)
            className={formData.clientInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientInfo.email) ? 'border-red-500' : ''}
          />
           {formData.clientInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientInfo.email) && (
              <p className="text-red-600 text-xs mt-1">Please enter a valid email address.</p>
            )}
        </div>

        {/* Company Field */}
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label> {/* Marked as optional */}
          <Input
            id="company"
            value={formData.clientInfo.company ?? ''} // Handle potential undefined
            onChange={(e) => updateClientInfo("company", e.target.value)}
            placeholder="Enter your company name (Optional)"
          />
        </div>

        {/* Contact Number Field */}
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></Label>
          <Input
            id="contactNumber"
            type="tel" // Use tel type for phone numbers
            value={formData.clientInfo.contactNumber}
            onChange={(e) => updateClientInfo("contactNumber", e.target.value)}
            placeholder="Enter your contact number"
            required
            aria-required="true"
          />
           {/* Basic validation message example (optional) */}
           {/* {formData.clientInfo.contactNumber.trim() === '' && <p className="text-red-600 text-xs mt-1">Contact number is required.</p>} */}
        </div>
      </div>
    </QuestionContainer>
  );
};

export default ClientInformation;