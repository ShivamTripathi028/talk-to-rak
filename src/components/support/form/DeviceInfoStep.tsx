// src/components/support/form/DeviceInfoStep.tsx

import React from "react";
import { useSupportForm } from "@/contexts/SupportFormContext"; // Corrected context path
import { Input } from "@/components/ui/input"; // Corrected ui path
import { Label } from "@/components/ui/label"; // Corrected ui path
import { Button } from "@/components/ui/button"; // Corrected ui path
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Corrected ui path
import { Cpu, Hash, Activity } from "lucide-react"; // Package import OK
import { Card, CardContent } from "@/components/ui/card"; // Corrected ui path
import { DEVICE_MODELS } from "@/constants/supportForm"; // Corrected constants path

const DeviceInfoStep: React.FC = () => { // No props needed
  const { formData, updateFormData, nextStep, prevStep } = useSupportForm();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation: only requires deviceModel
    if (!isFormValid) { // Check derived state
      // Optional: Show toast or inline error
       console.warn("DeviceInfo validation failed: Device Model required.");
       // toast({ title: "Missing Information", description: "Please select the device model.", variant: "destructive" });
      return;
    }
    nextStep();
  };

  // Validation state: only requires deviceModel to be selected
  const isFormValid = !!formData.deviceModel && formData.deviceModel.trim().length > 0;

  return (
    // Changed from form to div, button now triggers handler
    <div className="step-container">
      <Card className="border-support-light-blue shadow-md">
        <CardContent className="pt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6 text-support-blue">Device Information</h2>

          <div className="space-y-4">
            {/* Device Model Field */}
            <div className="space-y-2">
              <Label htmlFor="support-deviceModel" className="flex items-center gap-2 font-medium"> {/* Use unique ID */}
                <Cpu className="h-4 w-4 text-gray-600" /> RAK Device Model <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.deviceModel}
                onValueChange={(value) => updateFormData({ deviceModel: value })}
                required // Keep for semantics
                aria-required="true"
              >
                <SelectTrigger
                   id="support-deviceModel" // Use unique ID
                   className="border-gray-300 focus:border-support-blue focus:ring-support-blue" // Adjusted styling
                   aria-invalid={!isFormValid && !formData.deviceModel} // Indicate invalid if required but not selected
                >
                  <SelectValue placeholder="Select Device Model..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DEVICE_MODELS.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* Optional: Inline validation message */}
               {!isFormValid && !formData.deviceModel && (
                  <p className="text-red-600 text-xs mt-1">Device model is required.</p>
               )}
            </div>

            {/* EUI Number Field */}
            <div className="space-y-2">
              <Label htmlFor="support-serialNumber" className="flex items-center gap-2 font-medium"> {/* Use unique ID */}
                <Hash className="h-4 w-4 text-gray-600" /> Device EUI Number
              </Label>
              <Input
                id="support-serialNumber" // Use unique ID
                placeholder="e.g., ACxxxxxxxxxxxxxxxx (Optional)"
                value={formData.serialNumber || ''} // Handle potential undefined
                onChange={(e) => updateFormData({ serialNumber: e.target.value })}
                className="border-gray-300 focus:border-support-blue focus:ring-support-blue"
                maxLength={16} // EUI-64 is 16 hex characters
                pattern="[a-fA-F0-9]{16}" // Basic pattern match (optional)
                title="Enter 16 hexadecimal characters (0-9, A-F)" // Tooltip for pattern (optional)
              />
              <p className="text-xs text-gray-500">Usually found on the device label (16 characters).</p>
            </div>

            {/* Firmware Version Field */}
            <div className="space-y-2">
              <Label htmlFor="support-firmwareVersion" className="flex items-center gap-2 font-medium"> {/* Use unique ID */}
                <Activity className="h-4 w-4 text-gray-600" /> Firmware Version
              </Label>
              <Input
                id="support-firmwareVersion" // Use unique ID
                placeholder="e.g., v1.2.3 (Optional)"
                value={formData.firmwareVersion || ''}
                onChange={(e) => updateFormData({ firmwareVersion: e.target.value })}
                className="border-gray-300 focus:border-support-blue focus:ring-support-blue"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50" // Adjusted styling
            >
              Previous
            </Button>
            <Button
              type="button" // Changed from submit
              onClick={handleNext} // Call handler
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

export default DeviceInfoStep;