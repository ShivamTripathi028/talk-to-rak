// src/contexts/SupportFormContext.tsx

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { FormStep, SupportFormData } from "../types/supportForm"; // Use correct path: '@/types/supportForm' usually
import { toast } from "@/hooks/use-toast"; // Use correct path: '@/hooks/use-toast' usually

interface SupportFormContextType {
  formData: SupportFormData;
  currentStep: FormStep;
  updateFormData: (data: Partial<SupportFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: FormStep) => void;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  downloadSummary: () => void;
  resetForm: () => void;
}

const defaultFormData: SupportFormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  deviceModel: "",
  serialNumber: "",
  firmwareVersion: "",
  problemType: "connectivity", // Default problem type
  issueDescription: "",
  errorMessage: "",
  stepsToReproduce: "",
  previousTicketId: "",
  supportMethod: "email", // Default support method
  urgencyLevel: "medium", // Default urgency
  attachments: [], // Initialize combined attachments
  privacyAgreed: false, // Default consent state (if used)
  submittedTicketId: null, // Initialize submitted ticket ID
};

// Define the order of steps relevant to the flow logic here
const steps: FormStep[] = [
  "clientInfo",
  "deviceInfo",
  "issueDescription",
  "review",
];
const confirmationStep: FormStep = "confirmation";

const API_ENDPOINT = "/.netlify/functions/support-ticket"; // Relative path for Netlify Functions

const SupportFormContext = createContext<SupportFormContextType | undefined>(undefined);

export const SupportFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<SupportFormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>("clientInfo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = useCallback((data: Partial<SupportFormData>) => {
    const updatedData = { ...data };
    if ('attachments' in data && !Array.isArray(data.attachments) && data.attachments !== undefined) {
        updatedData.attachments = [];
    }
    setFormData((prev) => ({ ...prev, ...updatedData }));
 }, []);

  const nextStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo(0, 0);
    } else if (currentStep === 'review') {
        submitForm(); // submitForm is defined below, dependency will be added
    }
  // Dependency on submitForm added below in useEffect to avoid circular dependency warning
  }, [currentStep]); // submitForm dependency handled via effect

  const prevStep = useCallback(() => {
    if (currentStep === confirmationStep) return;
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      window.scrollTo(0, 0);
    }
 }, [currentStep]);

 const resetForm = useCallback(() => {
    console.log("Resetting Support Form...");
    setFormData(defaultFormData);
    setCurrentStep("clientInfo");
    setIsSubmitting(false);
    window.scrollTo(0, 0);
 }, []);

 const goToStep = useCallback((step: FormStep) => {
    if (step === 'clientInfo' && currentStep !== 'clientInfo') {
        resetForm();
        return;
    }
    if (step === confirmationStep || isSubmitting) { return; }
    const targetIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStep);
    if (targetIndex !== -1 && targetIndex <= currentIndex) {
       setCurrentStep(step);
       window.scrollTo(0, 0);
    } else { console.warn(`Navigation to step "${step}" blocked.`); }
 }, [currentStep, isSubmitting, resetForm]);


  // *** submitForm: Corrected payload creation ***
  const submitForm = useCallback(async () => {
    if (currentStep !== 'review' || isSubmitting) {
      console.warn("Submit blocked: Not on review step or already submitting.");
      return;
    }
    setIsSubmitting(true);
    updateFormData({ submittedTicketId: null });

    // *** FIX: Construct specific payload instead of using delete ***
    const dataToSend: Omit<SupportFormData, 'attachments' | 'privacyAgreed' | 'submittedTicketId'> & { hasAttachments: boolean } = {
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      deviceModel: formData.deviceModel,
      serialNumber: formData.serialNumber,
      firmwareVersion: formData.firmwareVersion,
      problemType: formData.problemType,
      issueDescription: formData.issueDescription,
      errorMessage: formData.errorMessage,
      stepsToReproduce: formData.stepsToReproduce,
      previousTicketId: formData.previousTicketId,
      supportMethod: formData.supportMethod,
      urgencyLevel: formData.urgencyLevel,
      hasAttachments: Array.isArray(formData.attachments) && formData.attachments.length > 0,
    };

    console.log("Submitting support form data:", dataToSend);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();

      if (response.ok && response.status === 201 && result.success) {
        console.log("Form submission successful:", result);
        updateFormData({ submittedTicketId: result.ticketId || 'N/A' });
        setCurrentStep(confirmationStep);
        window.scrollTo(0, 0);
        toast({ title: "Support Request Submitted!", description: result.message || "Our team will review your request shortly.", duration: 7000 });
      } else {
        console.error("Submission Error:", response.status, result);
        toast({ title: "Submission Failed", description: result.message || `An error occurred (Status: ${response.status}). Please review your submission or try again.`, variant: "destructive", duration: 9000 });
        setCurrentStep('review'); // Stay on review on error
      }
    } catch (error) {
      console.error("Network or Fetch Error submitting form:", error);
      toast({ title: "Network Error", description: "Could not send your request. Please check your connection and try again.", variant: "destructive", duration: 9000 });
      setCurrentStep('review'); // Stay on review on error
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, currentStep, isSubmitting, updateFormData]);

   // Effect to link nextStep and submitForm dependency correctly
   // This is a way to handle the dependency without direct circular reference warnings in useCallback
   const stableSubmitForm = React.useRef(submitForm);
   React.useEffect(() => {
        stableSubmitForm.current = submitForm;
   }, [submitForm]);

   const stableNextStep = React.useRef(nextStep);
   React.useEffect(() => {
        stableNextStep.current = nextStep;
   }, [nextStep]);


  // *** downloadSummary: Corrected type definition ***
  const downloadSummary = useCallback(() => {
    // *** FIX: Define SummaryDataType correctly ***
    type SummaryDataType = Omit<SupportFormData, 'attachments'> & {
        attachments?: { name: string; size: number; type: string }[]; // attachments is array of simple objects or undefined
    };
    // Create summaryData object with the correct type
    const summaryData: SummaryDataType = { ...formData };

    // Transform attachments to the simplified structure
    summaryData.attachments = formData.attachments?.map(f => ({ name: f.name, size: f.size, type: f.type })) || [];

    // Stringify the correctly typed object
    const dataStr = JSON.stringify(summaryData, null, 2);

    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const clientName = formData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'user';
    const exportName = `rak_support_summary_${clientName}_${new Date().toISOString().slice(0,10)}`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", url);
    linkElement.setAttribute("download", `${exportName}.json`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
    toast({ title: "Summary Downloaded", description: "Your request summary has been saved as a JSON file.", duration: 5000 });
 }, [formData]); // formData is the dependency


  return (
    <SupportFormContext.Provider
      value={{
        formData,
        currentStep,
        updateFormData,
        nextStep: stableNextStep.current, // Use the ref here if needed for stability
        prevStep,
        goToStep,
        submitForm: stableSubmitForm.current, // Use the ref here
        isSubmitting,
        downloadSummary,
        resetForm
      }}
    >
      {children}
    </SupportFormContext.Provider>
  );
};

export const useSupportForm = (): SupportFormContextType => {
  const context = useContext(SupportFormContext);
  if (context === undefined) {
    throw new Error("useSupportForm must be used within a SupportFormProvider");
  }
  return context;
};