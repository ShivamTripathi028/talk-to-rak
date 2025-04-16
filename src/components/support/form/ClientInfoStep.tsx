// src/components/support/form/ClientInfoStep.tsx

import React from "react";
import { useSupportForm } from "@/contexts/SupportFormContext"; // Corrected context path
import { Input } from "@/components/ui/input"; // Corrected ui path
import { Label } from "@/components/ui/label"; // Corrected ui path
import { Button } from "@/components/ui/button"; // Corrected ui path
import { AtSign, User, Phone, Building2 } from "lucide-react"; // Package import is OK
import { Card, CardContent } from "@/components/ui/card"; // Corrected ui path

const ClientInfoStep: React.FC = () => { // No props needed if not explicitly passed
  const { formData, updateFormData, nextStep } = useSupportForm();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation (name and valid email format)
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!formData.name.trim() || !formData.email.trim() || !isEmailValid) {
        // Optionally show a toast or inline error
        console.warn("ClientInfo validation failed");
        // Example using toast (make sure useToast is available via context or import)
        // toast({ title: "Missing Information", description: "Please enter your name and a valid email address.", variant: "destructive" });
        return;
    }
    nextStep();
  };

  // Derive validation state for button disabling
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = formData.name.trim().length > 0 && formData.email.trim().length > 0 && isEmailValid;

  return (
    // Using 'div' instead of 'form' as submission is handled by button onClick -> context -> nextStep
    <div className="step-container">
      <Card className="border-support-light-blue shadow-md">
        <CardContent className="pt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6 text-support-blue">Client Information</h2>

          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="support-name" className="flex items-center gap-2 font-medium"> {/* Added font-medium */}
                <User className="h-4 w-4 text-gray-600" /> Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="support-name" // Use unique ID prefix
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                className="border-gray-300 focus:border-support-blue focus:ring-support-blue" // Adjusted styling slightly
                required
                aria-required="true"
              />
            </div>

            {/* Company Field */}
            <div className="space-y-2">
              <Label htmlFor="support-company" className="flex items-center gap-2 font-medium">
                <Building2 className="h-4 w-4 text-gray-600" /> Company Name
              </Label>
              <Input
                id="support-company" // Use unique ID prefix
                placeholder="Your Company (Optional)"
                value={formData.company || ''}
                onChange={(e) => updateFormData({ company: e.target.value })}
                className="border-gray-300 focus:border-support-blue focus:ring-support-blue"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="support-email" className="flex items-center gap-2 font-medium">
                <AtSign className="h-4 w-4 text-gray-600" /> Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="support-email" // Use unique ID prefix
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                className={`border-gray-300 focus:border-support-blue focus:ring-support-blue ${formData.email && !isEmailValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                required
                aria-required="true"
                aria-invalid={formData.email ? !isEmailValid : undefined}
              />
              {formData.email && !isEmailValid && (
                <p className="text-red-600 text-xs mt-1">Please enter a valid email address.</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="support-phone" className="flex items-center gap-2 font-medium">
                <Phone className="h-4 w-4 text-gray-600" /> Phone Number
              </Label>
              <Input
                id="support-phone" // Use unique ID prefix
                type="tel"
                placeholder="+1 (123) 456-7890 (Optional)"
                value={formData.phone || ''}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                className="border-gray-300 focus:border-support-blue focus:ring-support-blue"
              />
            </div>
          </div>

          {/* Navigation Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="button" // Changed from submit as form tag removed
              onClick={handleNext} // Trigger next step via context
              disabled={!isFormValid}
              className="bg-support-blue hover:bg-support-dark-blue text-white disabled:opacity-50 disabled:cursor-not-allowed" // Adjusted disabled style
              aria-disabled={!isFormValid}
            >
              Next Step
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientInfoStep;