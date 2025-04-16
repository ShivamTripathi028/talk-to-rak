// src/components/support/form/ConfirmationStep.tsx

import React from "react";
import { useSupportForm } from "@/contexts/SupportFormContext"; // Corrected context path
import { Button } from "@/components/ui/button"; // Corrected ui path
import { Card, CardContent } from "@/components/ui/card"; // Corrected ui path
import { CheckCircle2, CalendarClock, Mail, Loader2, RotateCcw } from "lucide-react"; // Package import OK, Added RotateCcw

const ConfirmationStep: React.FC = () => { // No props needed
  // Get formData (to display ticket ID, email, device) and resetForm function from context
  const { formData, resetForm } = useSupportForm(); // Changed goToStep to resetForm

  // Handler now directly calls resetForm from the context
  const handleNewRequest = () => {
    resetForm(); // Call the reset function provided by the context
  };

  // Get the actual ticket ID from the form data
  const actualTicketId = formData.submittedTicketId;

  return (
    <div className="step-container animate-fade-in"> {/* Added animation */}
      <Card className="border-support-light-blue shadow-lg max-w-2xl mx-auto"> {/* Centered card */}
        <CardContent className="pt-8 pb-8 space-y-8">
          <div className="flex flex-col items-center text-center"> {/* Centered text */}
            <CheckCircle2 className="h-20 w-20 text-green-500 mb-5" />
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">
              Support Request Submitted!
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Thank you for contacting RAKwireless Technical Support. Your request is being processed.
            </p>
          </div>

          {/* Ticket Details Section */}
          <div className="bg-gray-50 border border-gray-200 p-4 sm:p-6 rounded-lg space-y-5">
            {/* Display Actual Ticket ID */}
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Your Ticket ID</p>
              <p className="font-bold text-2xl text-support-blue mt-1 break-words"> {/* Added break-words */}
                {actualTicketId ? `#${actualTicketId}` : <Loader2 className="h-6 w-6 animate-spin inline-block text-gray-500" />}
              </p>
              {actualTicketId && (
                 <p className="text-xs text-gray-500 mt-1">Please use this ID for any follow-up inquiries.</p>
              )}
            </div>

            {/* Separator */}
            <hr className="border-gray-200" />

            {/* Device Submitted For */}
             <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Device Model</p>
              <p className="font-medium text-gray-800 mt-1">{formData.deviceModel || "N/A"}</p>
            </div>

             {/* Separator */}
             <hr className="border-gray-200" />

             {/* Email Confirmation */}
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-support-blue flex-shrink-0" />
              <p className="text-sm font-medium text-gray-700 break-all"> {/* Use text-sm and break-all */}
                A confirmation email has been sent to: <span className="font-semibold text-black">{formData.email}</span>
              </p>
            </div>

             {/* Separator */}
             <hr className="border-gray-200" />

            {/* What Happens Next */}
            <div className="flex items-start gap-3">
              <CalendarClock className="h-5 w-5 text-support-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">What Happens Next?</p>
                <p className="text-sm text-gray-600 mt-1">
                  Our support team will review your request and respond based on the urgency level provided. Estimated initial response times:
                  {/* Updated response time descriptions */}
                  <ul className="list-disc pl-5 mt-2 text-xs space-y-1">
                      <li><b>High Urgency:</b> Typically within 4 business hours</li>
                      <li><b>Medium Urgency:</b> Typically within 1 business day</li>
                      <li><b>Low Urgency:</b> Typically within 2 business days</li>
                  </ul>
                   <span className="block text-xs text-gray-500 italic mt-2">Business hours: 9 AM - 6 PM (GMT+8), Mon-Fri. Actual response times may vary based on ticket volume and complexity.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              onClick={handleNewRequest} // Calls resetForm via handler
              variant="outline" // Changed variant
              className="border-support-blue text-support-blue hover:bg-blue-50 px-6 py-2.5"
            >
               <RotateCcw className="mr-2 h-4 w-4" /> {/* Added icon */}
               Submit Another Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationStep;