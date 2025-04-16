// src/components/inquiry/steps/RegionSelection.tsx

import React, { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuestionContainer from "../QuestionContainer";
// Removed unused 'Region' type import here
import { InquiryFormData, regions } from "@/utils/formUtils";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import type { SetStateAction } from 'react';

type RegionSelectionProps = {
  formData: InquiryFormData;
  setFormData: React.Dispatch<SetStateAction<InquiryFormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const RegionSelection: React.FC<RegionSelectionProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  // --- Handlers and useEffect remain the same ---
   const handleRegionChange = (regionName: string) => {
        const selectedRegion = regions.find((region) => region.name === regionName);
        if (selectedRegion) {
            setFormData((prev) => ({
                ...prev, region: { selected: selectedRegion.name, frequencyBand: selectedRegion.frequencyBand },
            }));
        } else {
            setFormData((prev) => ({ ...prev, region: { selected: "", frequencyBand: "" } }));
        }
    };
    useEffect(() => {
        if (formData.region.selected === "" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    let detectedRegionName: string | undefined;
                    if (latitude > 24 && latitude < 49 && longitude < -66 && longitude > -125) { detectedRegionName = "North America"; }
                    else if (latitude > 36 && latitude < 70 && longitude > -10 && longitude < 40) { detectedRegionName = "Europe"; }
                    // Find uses the constant 'regions' which implicitly uses the Region type structure
                    const detectedRegion = regions.find(r => r.name === detectedRegionName);
                    if (detectedRegion) {
                        console.log("Detected region:", detectedRegion.name);
                        setFormData((prev) => {
                            if (prev.region.selected === "") {
                                return { ...prev, region: { selected: detectedRegion!.name, frequencyBand: detectedRegion!.frequencyBand } };
                            } return prev;
                        });
                    }
                },
                (error) => { console.warn("Geolocation unavailable:", error.message); }, { timeout: 5000 }
            );
        }
    }, [formData.region.selected, setFormData]);
  // --- End Handlers/Effect ---

  const isNextDisabled = formData.region.selected === "";

  return (
    <QuestionContainer
      title="Region Selection"
      description="Select the primary geographical region for your deployment."
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={false}
      isLastStep={false}
      nextDisabled={isNextDisabled}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="region-select" className="flex items-center space-x-2 font-medium">
            <MapPin className="text-iot-blue h-5 w-5" />
            <span>Select Your Region <span className="text-red-500">*</span></span>
          </Label>

          <Select
            value={formData.region.selected}
            onValueChange={handleRegionChange}
            required
          >
            <SelectTrigger id="region-select" className="w-full" aria-required="true">
              <SelectValue placeholder="Select a region..." />
            </SelectTrigger>
            <SelectContent>
              {/* Here 'regions' constant is used, which has the 'Region' type structure */}
              {regions.map((region) => (
                <SelectItem key={region.name} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           {isNextDisabled && (
              <p className="text-red-600 text-xs mt-1">Please select a deployment region.</p>
           )}
        </div>

        {formData.region.selected && (
          <div className="p-4 bg-iot-pastel-blue border border-iot-blue/30 rounded-md animate-fade-in">
            <h4 className="font-medium mb-1 text-iot-dark-blue">Associated LoRaWAN® Frequency Band</h4>
            <p className="text-sm">
              Based on your selection ({formData.region.selected}), the typical frequency band is:
              <span className="font-semibold block mt-1 text-base">
                {formData.region.frequencyBand}
              </span>
              <span className="block text-xs text-gray-500 mt-1"> (Ensure local regulations are met)</span>
            </p>
          </div>
        )}
      </div>
    </QuestionContainer>
  );
};

export default RegionSelection;