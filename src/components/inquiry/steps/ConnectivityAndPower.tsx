// src/components/inquiry/steps/ConnectivityAndPower.tsx

import React from "react";
import QuestionContainer from "../QuestionContainer"; // Relative path should be correct
// Import types and constants from formUtils
import { InquiryFormData, powerOptions, connectivityOptions, networkTypes } from "@/utils/formUtils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Alias should be correct
import { Label } from "@/components/ui/label"; // Alias should be correct
import { Checkbox } from "@/components/ui/checkbox"; // Alias should be correct
// Import icons from lucide-react - ADDED Bluetooth
import { Wifi, Signal, Network, Battery, Sun, Plug, Power, Bluetooth } from "lucide-react";
import type { SetStateAction } from 'react'; // Import SetStateAction type

// Updated Props Type
type ConnectivityAndPowerProps = {
  formData: InquiryFormData; // Use InquiryFormData
  setFormData: React.Dispatch<SetStateAction<InquiryFormData>>; // Use InquiryFormData
  onNext: () => void;
  onPrev: () => void;
};

const ConnectivityAndPower: React.FC<ConnectivityAndPowerProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  // --- Handlers remain the same, but type checks are improved ---
  const handleLoRaWANTypeChange = (value: "Public" | "Private") => {
    setFormData((prev) => ({
      ...prev,
      connectivity: {
        ...prev.connectivity,
        lorawanType: value,
      },
    }));
  };

  const handleConnectivityOptionToggle = (option: string) => {
    setFormData((prev) => {
      const currentOptions = prev.connectivity.options ? [...prev.connectivity.options] : [];
      const isSelected = currentOptions.includes(option);
      const newOptions = isSelected
        ? currentOptions.filter((item) => item !== option)
        : [...currentOptions, option];

      return {
        ...prev,
        connectivity: {
          ...prev.connectivity,
          options: newOptions,
        },
      };
    });
  };

  const handlePowerOptionToggle = (option: string) => {
    setFormData((prev) => {
      const currentOptions = prev.power ? [...prev.power] : [];
      const isSelected = currentOptions.includes(option);
       const newPowerOptions = isSelected
        ? currentOptions.filter((item) => item !== option)
        : [...currentOptions, option];

      return {
        ...prev,
        power: newPowerOptions,
      };
    });
  };

  // Define icons for additional connectivity options
  const getIconForConnectivityOption = (option: string) => {
      if (option.includes("Cellular")) return <Signal className="h-4 w-4" />;
      if (option.includes("Wi-Fi")) return <Wifi className="h-4 w-4" />;
      if (option.includes("Ethernet")) return <Network className="h-4 w-4" />;
      if (option.includes("Bluetooth")) return <Bluetooth className="h-4 w-4" />; // Now correctly references imported icon
      return null; // Default or other icons
  }

  // Define icons for power options based on keywords
  const getIconForPowerOption = (option: string) => {
    if (option.toLowerCase().includes("battery")) return <Battery className="h-5 w-5" />;
    if (option.toLowerCase().includes("solar")) return <Sun className="h-5 w-5" />;
    if (option.toLowerCase().includes("mains")) return <Plug className="h-5 w-5" />;
    if (option.toLowerCase().includes("poe")) return <Power className="h-5 w-5" />; // Using Power icon for PoE
    return null; // Default or other icons
  };

  // Descriptions for power options (can be moved to constants if preferred)
  const powerDescriptions: Record<string, string> = {
    "Battery Powered (Primary)": "Devices run primarily on batteries, suitable for locations without constant power.",
    "Solar Powered (with Battery Backup)": "Uses solar panels with battery storage, ideal for outdoor off-grid use.",
    "Mains Powered (AC/DC)": "Connects directly to the electrical grid for reliable, continuous power.",
    "Power over Ethernet (PoE)": "Receives power and data over a single Ethernet cable, simplifying installation.",
    "Energy Harvesting (Specify in details)": "Utilizes ambient energy sources (vibration, thermal). Requires specifics.",
    "Mix of sources": "Combines multiple power strategies across the deployment.",
    "Unsure / TBD": "Power requirements are still under consideration.",
  };

  // Validation: Require LoRaWAN type and at least one power source
  const isNextDisabled = formData.connectivity.lorawanType === null || !formData.power || formData.power.length === 0;


  return (
    <QuestionContainer
      title="Connectivity & Power"
      description="Specify network requirements and power sources for your devices"
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={isNextDisabled} // Use validation state
    >
      <div className="space-y-8">
        {/* --- Connectivity Section --- */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-800">Connectivity</h3>

          {/* LoRaWAN Network Type */}
          <div className="space-y-3">
            <h4 className="text-lg font-medium">LoRaWAN Network Type <span className="text-red-500">*</span></h4>
            <RadioGroup
              value={formData.connectivity.lorawanType ?? ""} // Handle null case
              onValueChange={(value) => handleLoRaWANTypeChange(value as "Public" | "Private")}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              aria-required="true"
            >
              {networkTypes.map((type) => (
                <Label // Use Label for better click area and accessibility
                  key={type}
                  htmlFor={`lorawan-${type.toLowerCase()}`}
                  className={`flex items-center space-x-3 p-3 border rounded-md transition-all cursor-pointer has-[:checked]:border-iot-blue has-[:checked]:bg-iot-pastel-blue ${
                    formData.connectivity.lorawanType === type ? "border-iot-blue bg-iot-pastel-blue" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                    <RadioGroupItem value={type} id={`lorawan-${type.toLowerCase()}`} />
                    <div className="flex-1">
                      <span className="text-sm font-medium">
                        {type} LoRaWAN® Network
                      </span>
                      {type === 'Public' && <span className="block text-xs text-gray-500 font-normal mt-0.5">Utilizing shared networks like The Things Network, Helium, etc.</span>}
                      {type === 'Private' && <span className="block text-xs text-gray-500 font-normal mt-0.5">Deploying your own dedicated gateways and network server.</span>}
                    </div>
                </Label>
              ))}
            </RadioGroup>
             {formData.connectivity.lorawanType === null && ( /* Basic validation feedback */
                <p className="text-red-600 text-xs mt-1">Please select a LoRaWAN network type.</p>
             )}
          </div>

          {/* Additional Connectivity Options */}
          <div className="space-y-1">
            <h4 className="text-lg font-medium mb-3">Additional Connectivity Needs (Optional)</h4>
            <div className="space-y-3">
              {connectivityOptions.map((option) => (
                <Label // Use Label for better click area
                   key={option}
                   htmlFor={`conn-${option.replace(/[\s/()]+/g, '-').toLowerCase()}`}
                   className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                 >
                  <Checkbox
                    id={`conn-${option.replace(/[\s/()]+/g, '-').toLowerCase()}`}
                    checked={formData.connectivity.options?.includes(option)} // Handle potentially undefined options array
                    onCheckedChange={() => handleConnectivityOptionToggle(option)}
                    className="mt-1"
                  />
                  <div className="space-y-1 flex-1">
                    <span className="flex items-center space-x-2 font-medium text-sm">
                      {getIconForConnectivityOption(option)}
                      <span>{option}</span>
                    </span>
                    {/* Add descriptions if needed */}
                    {/* <p className="text-xs text-gray-500 pl-6">Description for {option}</p> */}
                  </div>
                </Label>
              ))}
            </div>
          </div>
        </div>

        {/* --- Divider --- */}
        <div className="border-t border-gray-200 pt-6 mt-6"></div>

        {/* --- Power Section --- */}
        <div className="space-y-3">
          <h3 className="text-xl font-medium text-gray-800 mb-3">Power Sources <span className="text-red-500">*</span></h3>
           <p className="text-sm text-gray-600 mb-4">Select all available power sources for your device locations.</p>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {powerOptions.map((option) => (
              <Label // Use Label for better click area
                key={option}
                htmlFor={`power-${option.replace(/[\s/()]+/g, '-').toLowerCase()}`}
                className={`p-4 border rounded-md cursor-pointer transition-all flex items-start gap-3 ${
                  formData.power?.includes(option) // Handle potentially undefined power array
                    ? "border-iot-blue bg-iot-pastel-blue"
                    : "border-gray-200 hover:border-iot-blue/50 hover:bg-gray-50"
                }`}
              >
                <Checkbox
                    checked={formData.power?.includes(option)}
                    onCheckedChange={() => handlePowerOptionToggle(option)} // Keep direct control
                    id={`power-${option.replace(/[\s/()]+/g, '-').toLowerCase()}`}
                    className="mt-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <span className="flex items-center space-x-2 font-medium text-sm">
                      {getIconForPowerOption(option)}
                      <span>{option}</span>
                    </span>
                    {powerDescriptions[option] && (
                        <p className="text-xs text-gray-600 mt-1">{powerDescriptions[option]}</p>
                    )}
                </div>
              </Label>
            ))}
          </div>
            {(!formData.power || formData.power.length === 0) && ( /* Basic validation feedback */
              <p className="text-red-600 text-xs mt-1">Please select at least one power source.</p>
            )}
        </div>

        {/* --- Summary Section (Optional Enhancement) --- */}
        {(!isNextDisabled) && ( // Show summary only when step is valid
          <div className="p-4 bg-iot-pastel-blue border border-iot-blue/30 rounded-md animate-fade-in mt-6">
            <h4 className="font-medium text-iot-dark-blue">Current Selections:</h4>
            <div className="mt-2 space-y-1 text-sm">
              {formData.connectivity.lorawanType && (
                <div><span className="font-semibold">LoRaWAN Network:</span> {formData.connectivity.lorawanType}</div>
              )}
              {formData.connectivity.options?.length > 0 && ( // Check if options exists
                <div><span className="font-semibold">Other Connectivity:</span> {formData.connectivity.options.join(", ")}</div>
              )}
              {formData.power?.length > 0 && ( // Check if power exists
                <div><span className="font-semibold">Power Sources:</span> {formData.power.join(", ")}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </QuestionContainer>
  );
};

export default ConnectivityAndPower;