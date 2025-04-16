// src/utils/formUtils.ts

import type { Dispatch, SetStateAction } from 'react';

// --- Types ---
export type Region = {
  name: string;
  frequencyBand: string;
};

export type ApplicationTypeInfo = {
  type: string;
  subtypes: string[];
};

// Represents the structure of the entire form data
export type InquiryFormData = {
  clientInfo: {
    name: string;
    email: string;
    company?: string;
    contactNumber: string; // Changed from optional in original repo's ClientInfoStep
  };
  region: {
    selected: string;
    frequencyBand: string;
  };
  deployment: {
    environment: "Indoor" | "Outdoor" | "Both" | null;
  };
  application: {
    type: string;
    subtypes: string[];
    otherSubtype?: string;
  };
  scale: string;
  connectivity: {
    lorawanType: "Public" | "Private" | null;
    options: string[]; // e.g., ['Cellular', 'Wi-Fi']
  };
  power: string[]; // e.g., ['Battery Powered', 'Solar Powered']
  additionalDetails: string;
};

// Props for individual step components
export interface StepComponentProps {
    formData: InquiryFormData;
    setFormData: Dispatch<SetStateAction<InquiryFormData>>; // Use SetStateAction
    onNext: () => void;
    onPrev: () => void;
}

// --- Constants ---

export const regions: Region[] = [
  { name: "North America", frequencyBand: "US915" },
  { name: "Europe", frequencyBand: "EU868" },
  { name: "Asia Pacific", frequencyBand: "AS923" }, // Combine AS regions if needed
  { name: "Australia", frequencyBand: "AU915" },
  { name: "Korea", frequencyBand: "KR920" },
  { name: "India", frequencyBand: "IN865" },
  { name: "Russia", frequencyBand: "RU864" },
  { name: "Other / Unsure", frequencyBand: "Check Regional Parameters" } // Add an 'Other'
];

export const applicationTypes: ApplicationTypeInfo[] = [
  {
    type: "Monitoring",
    subtypes: ["Temperature", "Humidity", "Air Quality", "Water Quality", "Vibration", "Pressure", "Light", "Motion", "Presence", "Energy", "Level Sensing", "Other"]
  },
  {
     type: "Asset Tracking",
     subtypes: ["GPS Tracking", "BLE Beacons", "LoRaWAN Geolocation", "Indoor Positioning", "Fleet Management", "Livestock Tracking", "Other"]
  },
  {
    type: "Control & Automation",
    subtypes: ["Actuators", "Smart Relays", "Smart Switches", "Valve Control", "Motor Control", "Lighting Control", "Building Automation", "Other"]
  },
  {
    type: "Gateway & Network",
    subtypes: ["Public Network Gateway", "Private Network Gateway", "Network Server", "Connectivity Solutions", "Mesh Network", "Other"]
  },
  {
    type: "Smart Agriculture",
    subtypes: ["Soil Monitoring", "Climate Monitoring", "Irrigation Control", "Pest Detection", "Other"]
  },
  {
     type: "Smart City / Utility",
     subtypes: ["Smart Metering", "Waste Management", "Street Lighting", "Environmental Sensing", "Parking", "Other"]
  },
  {
     type: "Other Application",
     subtypes: ["Please specify in Additional Details"]
  }
];

export const deploymentScales: string[] = [
  "Proof of Concept (< 5 devices)",
  "Pilot (5-20 devices)",
  "Small Scale (21-100 devices)",
  "Medium Scale (101-500 devices)",
  "Large Scale (501-2000 devices)",
  "Very Large Scale (2000+ devices)",
  "Unsure / TBD"
];

export const powerOptions: string[] = [
  "Battery Powered (Primary)",
  "Solar Powered (with Battery Backup)",
  "Mains Powered (AC/DC)",
  "Power over Ethernet (PoE)",
  "Energy Harvesting (Specify in details)",
  "Mix of sources",
  "Unsure / TBD"
];

export const connectivityOptions: string[] = [
  "Cellular (LTE-M/NB-IoT)",
  "Cellular (4G/5G)",
  "Wi-Fi",
  "Ethernet",
  "Bluetooth (BLE)",
  "Other (Specify in details)"
];

export const networkTypes: ("Public" | "Private")[] = [
    "Public",
    "Private"
];


// --- Initial State ---

export const initialInquiryFormData: InquiryFormData = {
  clientInfo: {
    name: "",
    email: "",
    company: "",
    contactNumber: "",
  },
  region: {
    selected: "",
    frequencyBand: "",
  },
  deployment: {
    environment: null,
  },
  application: {
    type: "",
    subtypes: [],
    otherSubtype: "",
  },
  scale: "",
  connectivity: {
    lorawanType: null,
    options: [],
  },
  power: [],
  additionalDetails: "",
};

// --- Utility Functions ---

// Checks if client information is complete
export const isClientInfoComplete = (clientInfo: InquiryFormData["clientInfo"]): boolean => {
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email);
  return clientInfo.name.trim() !== "" &&
         clientInfo.email.trim() !== "" &&
         isEmailValid && // Added email validation check
         clientInfo.contactNumber.trim() !== ""; // Make contact number required
};

// Format form data for display or simple logging
export const formatInquiryFormData = (formData: InquiryFormData): string => {
  return JSON.stringify(formData, null, 2);
};

// Helper to check if a specific step's data is valid/complete enough to proceed
// This is used for enabling/disabling Next buttons and progress bar navigation
export const isStepValid = (step: number, formData: InquiryFormData): boolean => {
  switch (step) {
    case 1: // Client Info
      return isClientInfoComplete(formData.clientInfo);
    case 2: // Region
      return formData.region.selected !== "";
    case 3: // Deployment Environment
      return formData.deployment.environment !== null;
    case 4: // Application Type
      return formData.application.type !== "" && formData.application.subtypes.length > 0;
    case 5: // Deployment Scale
      return formData.scale !== "";
    case 6: // Connectivity & Power
      // Require LoRaWAN type AND at least one power source
      return formData.connectivity.lorawanType !== null && formData.power.length > 0;
    case 7: // Additional Details
      return true; // This step is always "valid" as details are optional
    default:
      return false;
  }
};