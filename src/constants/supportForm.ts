// src/constants/supportForm.ts

import { ProblemType, SupportMethod, UrgencyLevel } from "../types/supportForm";

// Common RAK device models - based on Technical Support repo
export const DEVICE_MODELS: string[] = [
    "RAK7268 Wisgate Edge Lite 2",
    "RAK7271 WisGate Edge Prime",
    "RAK7289 WisGate Edge Pro",
    "RAK7258 WisGate Edge",
    "RAK7249 WisGate Edge Max",
    "RAK7240 WisGate Edge Prime",
    "RAK7268C WisGate Edge Lite 2",
    "RAK7391 WisBlock Base Board Pro",
    "RAK5010 WisTrio NB-IoT Tracker",
    "RAK4631 WisBlock Core",
    "RAK4200 WisDuo LPWAN Module",
    "RAK4270 WisDuo LPWAN Module",
    "RAK3172 WisDuo LPWAN Module",
    "RAK11300 WisBlock Core",
    "RAK11200 WisBlock Core",
    "RAK11720 Module",
    "RAK12500 WisBlock Sensor",
    "RAK2013 Cellular NB-IoT",
    "Other RAK Device", // Added generic 'Other'
    "Non-RAK Device", // Added option for non-RAK hardware
    "Unknown / Not Applicable", // For general queries
];

export const PROBLEM_TYPES: Record<ProblemType, string> = {
  connectivity: "Connectivity Issues (LoRaWAN, Wi-Fi, Cellular)",
  installation: "Installation Problems / Setup Help",
  configuration: "Device/Gateway Configuration",
  hardware: "Hardware Malfunction / Defect",
  software: "Software / Firmware Issues / Bugs",
  other: "Other Issue / General Question"
};

// Keep this if supportMethod is used
export const SUPPORT_METHODS: Record<SupportMethod, string> = {
  email: "Email Support",
  phone: "Phone Support",
  remote: "Remote Assistance"
};

export const URGENCY_LEVELS: Record<UrgencyLevel, string> = {
  low: "Low - General question or minor issue",
  medium: "Medium - Affecting functionality, workaround may exist",
  high: "High - Critical system down or major impact"
};