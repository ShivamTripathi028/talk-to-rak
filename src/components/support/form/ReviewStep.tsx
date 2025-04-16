// src/components/support/form/ReviewStep.tsx

import React from "react";
import { useSupportForm } from "@/contexts/SupportFormContext"; // Corrected context path
import { Button } from "@/components/ui/button"; // Corrected ui path
import { Card, CardContent } from "@/components/ui/card"; // Corrected ui path
import { FileText, AlertCircle, User, Cpu, MessageSquare, Loader2 } from "lucide-react"; // Removed unused Info, HelpCircle. Added Loader2
import { PROBLEM_TYPES, URGENCY_LEVELS } from "@/constants/supportForm"; // Corrected constants path
// Assuming SupportMethod is no longer used based on previous steps, removed its import
// import { SupportMethod } from "@/types/supportForm"; // Corrected types path if needed
// import { SUPPORT_METHODS } from "@/constants/supportForm"; // Corrected constants path if needed

const ReviewStep: React.FC = () => { // No props needed
  const { formData, prevStep, submitForm, isSubmitting, downloadSummary } = useSupportForm();

  // Form submission is directly called by the button onClick now
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   await submitForm(); // Call submitForm from context
  // };

  // Helper to render a field only if it has a non-empty value
  const renderField = (label: string, value: string | number | undefined | null) => {
    // Check for null/undefined and empty strings after trimming
    const displayValue = typeof value === 'string' ? value.trim() : value;
    if (displayValue === null || displayValue === undefined || displayValue === '') return null;
    return (
        // Use div for better control over layout if needed
        <div>
            <span className="font-semibold text-gray-600">{label}:</span>
            <span className="ml-2 text-gray-800">{displayValue}</span>
        </div>
    );
  };

   // Helper to render a text area field, handling line breaks and checking for content
  const renderTextAreaField = (label: string, value: string | undefined | null) => {
    if (!value || value.trim() === '') return null;
    return (
      <div className="mt-2">
        <p className="font-semibold text-gray-600 mb-1">{label}:</p>
        {/* Use pre-wrap to preserve line breaks from textarea */}
        <div className="whitespace-pre-wrap pl-1 pt-1 text-sm text-gray-800 bg-white border border-gray-200 rounded p-2">
            {value.trim()}
        </div>
      </div>
    );
  };

  // Render section only if it contains valid, non-null children elements
  const renderSection = (title: string, icon: React.ReactNode, content: (JSX.Element | null)[]) => {
     // Filter out null results from renderField/renderTextAreaField
     const validChildren = content.filter(child => child !== null);
     if (!validChildren || validChildren.length === 0) {
         return null; // Don't render the section if all fields within it were empty
     }
    return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0">
      <h3 className="font-semibold text-base md:text-lg text-gray-700 flex items-center gap-2 mb-2"> {/* Adjusted text size */}
        {icon}
        {title}
      </h3>
      {/* Indent content for readability */}
      <div className="pl-7 space-y-2 text-sm">{validChildren}</div>
    </div>
  )};

  return (
    // Changed from form to div, submit button now triggers context function
    <div className="step-container animate-fade-in">
      <Card className="border-support-light-blue shadow-lg">
        <CardContent className="pt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6 text-support-blue">Review Your Support Request</h2>

          {/* Review Data Section */}
          <div className="space-y-5 text-sm bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
            {renderSection("Client Information", <User className="w-5 h-5 text-support-blue" />, [
                renderField("Name", formData.name),
                renderField("Email", formData.email),
                renderField("Company", formData.company),
                renderField("Phone", formData.phone),
            ])}

            {renderSection("Device Information", <Cpu className="w-5 h-5 text-support-blue" />, [
                renderField("Device Model", formData.deviceModel),
                renderField("Device EUI Number", formData.serialNumber),
                renderField("Firmware Version", formData.firmwareVersion),
            ])}

            {renderSection("Issue Details", <MessageSquare className="w-5 h-5 text-support-blue" />, [
                renderField("Problem Type", formData.problemType ? PROBLEM_TYPES[formData.problemType] : 'N/A'), // Handle potential undefined key
                renderTextAreaField("Description", formData.issueDescription),
                renderField("Previous Ticket ID", formData.previousTicketId),
                renderTextAreaField("Error Message", formData.errorMessage),
                renderTextAreaField("Steps to Reproduce", formData.stepsToReproduce),
                renderField("Urgency Level", formData.urgencyLevel ? URGENCY_LEVELS[formData.urgencyLevel] : 'N/A'), // Handle potential undefined key
                // Support method removed as per comment
            ])}

            {/* Attachments Section - Render only if attachments exist */}
            {formData.attachments && formData.attachments.length > 0 && (
              renderSection("Uploaded Files", <FileText className="w-5 h-5 text-support-blue" />, [
                <ul key="attachment-list" className="list-disc space-y-1 pl-5 text-gray-700">
                  {formData.attachments.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="break-words"> {/* Use file name and index for key */}
                      {file.name} <span className="text-gray-500 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                    </li>
                  ))}
                </ul>
              ])
            )}
          </div>

          {/* Final Confirmation Notice */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md flex gap-3 items-start mt-6">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
                Please review all information carefully. Clicking "Submit Support Request" will send this data to the RAKwireless Technical Support team.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t mt-6 gap-3">
            <Button
                type="button"
                onClick={prevStep} // Go back to previous step
                variant="outline"
                className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting} // Disable if submitting
            >
              Go Back & Edit
            </Button>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                 <Button
                    type="button"
                    onClick={downloadSummary} // Trigger download from context
                    variant="outline"
                    className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting} // Disable if submitting
                >
                  Download Summary
                </Button>
                <Button
                  type="button" // Changed from submit
                  onClick={submitForm} // Directly call submitForm from context
                  className="w-full sm:w-auto bg-support-blue hover:bg-support-dark-blue text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting} // Disable if submitting
                  aria-disabled={isSubmitting}
                >
                  {isSubmitting ? (
                       <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                  ) : (
                       "Submit Support Request"
                  )}
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;