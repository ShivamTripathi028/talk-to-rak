// src/components/support/form/IssueDescriptionStep.tsx

import React, { useCallback, useState } from "react";
import { useSupportForm } from "@/contexts/SupportFormContext";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Sparkles, Info, Upload, File as FileIcon, Image, X, HelpCircle, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PROBLEM_TYPES, URGENCY_LEVELS } from "@/constants/supportForm";
import { ProblemType, UrgencyLevel } from "@/types/supportForm";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const IssueDescriptionStep: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useSupportForm();
  const [isDragging, setIsDragging] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
       toast({ title: "Missing Information", description: "Please select a problem type, provide an issue description, and select an urgency level.", variant: "destructive"});
      return;
    }
    nextStep();
  };

  const isFormValid = !!formData.problemType && formData.issueDescription.trim().length > 0 && !!formData.urgencyLevel;

  // --- File Handling Logic ---

  // Function to handle file validation and state update
  // *** MOVED BEFORE handleFileDrop ***
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentFiles = formData.attachments || [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'text/plain', 'application/pdf', 'application/zip', ''];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.txt', '.log', '.pdf', '.zip'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 5;
    let currentCount = currentFiles.length;
    let filesToAdd: File[] = [];
    let errorsFound = false;

    Array.from(files).forEach(file => {
        if (currentCount >= maxFiles) {
            if (!errorsFound) {
               toast({ title: "File Limit Reached", description: `Maximum ${maxFiles} files allowed. Some files were not added.`, variant: "destructive"});
               errorsFound = true;
            }
            return;
        }

        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        const isTypeAllowed = allowedTypes.includes(file.type) || (!file.type && allowedExtensions.includes(fileExtension));

        if (!isTypeAllowed) {
            toast({ title: "Invalid File Type", description: `${file.name} is not an allowed file type.`, variant: "destructive"});
            errorsFound = true;
            return;
        }
        if (file.size > maxSize) {
            toast({ title: "File Too Large", description: `${file.name} exceeds the 5MB size limit.`, variant: "destructive"});
            errorsFound = true;
            return;
        }
        filesToAdd.push(file);
        currentCount++;
    });

    if(filesToAdd.length > 0) {
        updateFormData({ attachments: [...currentFiles, ...filesToAdd] });
    }
  }, [formData.attachments, updateFormData]); // Dependencies are correct

  // Drag and Drop Handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (!isDragging) setIsDragging(true); }, [isDragging]);
  // handleFileDrop now correctly uses handleFiles defined above
  const handleFileDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFiles(e.dataTransfer.files); }, [handleFiles]); // Dependency is handleFiles now
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { handleFiles(e.target.files); e.target.value = ''; };

  // Function to remove an attachment
  const removeAttachment = useCallback((index: number) => {
    if (formData.attachments) {
      const updatedFiles = [...formData.attachments];
      updatedFiles.splice(index, 1);
      updateFormData({ attachments: updatedFiles });
    }
  }, [formData.attachments, updateFormData]);

  // Function to get file icon
  // *** REMOVED DUPLICATE DEFINITION - This is the single correct one ***
  const getFileIcon = (file: File): React.ReactNode => { // Ensure return type includes null explicitly if needed, but JSX implies ReactNode
    const type = file.type;
    const name = file.name.toLowerCase();
    if (type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    if (type === 'application/pdf' || name.endsWith('.pdf')) return <FileIcon className="w-5 h-5 text-red-500 flex-shrink-0" />;
    if (type === 'text/plain' || name.endsWith('.txt') || name.endsWith('.log')) return <FileIcon className="w-5 h-5 text-gray-700 flex-shrink-0" />;
    if (type === 'application/zip' || name.endsWith('.zip')) return <FileIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />;
    return <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />; // Default
  };
  // --- End Combined File Handling Logic ---

  return (
    // Changed from form to div
    <div className="step-container">
      <Card className="border-support-light-blue shadow-md">
        <CardContent className="pt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6 text-support-blue">Issue Details</h2>
          <div className="space-y-6">
            {/* Problem Type */}
            <div className="space-y-3">
               <Label className="flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4 text-gray-600" /> Problem Type <span className="text-red-500">*</span></Label>
               <RadioGroup
                  value={formData.problemType}
                  onValueChange={(value) => updateFormData({ problemType: value as ProblemType })}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3" // Adjusted gap
                  required
                  aria-required="true"
                >
                {Object.entries(PROBLEM_TYPES).map(([value, label]) => (
                 <div key={value} className={`flex items-center space-x-3 p-3 border rounded-md transition-all cursor-pointer has-[:checked]:border-support-blue has-[:checked]:bg-blue-50 ${formData.problemType === value ? 'border-support-blue bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <RadioGroupItem value={value} id={`problem-${value}`} />
                    <Label htmlFor={`problem-${value}`} className="cursor-pointer flex-1 text-sm font-medium">{label}</Label>
                 </div>
                 ))}
               </RadioGroup>
               {!formData.problemType && <p className="text-red-600 text-xs mt-1">Problem type is required.</p>}
            </div>

            {/* Issue Description */}
            <div className="space-y-2">
              <Label htmlFor="support-issueDescription" className="flex items-center gap-2 font-medium"><Info className="h-4 w-4 text-gray-600" /> Detailed Issue Description <span className="text-red-500">*</span></Label>
              <Textarea id="support-issueDescription" placeholder="Please describe the issue in detail, including what you were doing when it occurred..." value={formData.issueDescription} onChange={(e) => updateFormData({ issueDescription: e.target.value })} className="min-h-[120px] border-gray-300 focus:border-support-blue focus:ring-support-blue" required aria-required="true" />
              {!formData.issueDescription.trim() && <p className="text-red-600 text-xs mt-1">Issue description is required.</p>}
            </div>

             {/* Previous Ticket Reference */}
             <div className="space-y-2">
              <Label htmlFor="support-previousTicketId" className="flex items-center gap-2 font-medium"><HelpCircle className="h-4 w-4 text-gray-600" /> Related Issue Reference (Optional)</Label>
              <p className="text-xs text-gray-500 -mt-1 mb-1 pl-6">Enter the Ticket ID if this relates to a past support request.</p>
              <Input id="support-previousTicketId" placeholder="e.g., #12345" value={formData.previousTicketId || ''} onChange={(e) => updateFormData({ previousTicketId: e.target.value })} className="border-gray-300 focus:border-support-blue focus:ring-support-blue" />
            </div>

             {/* Error Message */}
            <div className="space-y-2">
              <Label htmlFor="support-errorMessage" className="flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4 text-gray-600" /> Error Message (Optional)</Label>
              <Textarea id="support-errorMessage" placeholder="Copy and paste any relevant error messages here..." value={formData.errorMessage || ''} onChange={(e) => updateFormData({ errorMessage: e.target.value })} className="min-h-[80px] border-gray-300 focus:border-support-blue focus:ring-support-blue font-mono text-sm" />
            </div>

            {/* Steps to Reproduce */}
            <div className="space-y-2">
              <Label htmlFor="support-stepsToReproduce" className="flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4 text-gray-600" /> Steps to Reproduce (Optional)</Label>
               <p className="text-xs text-gray-500 -mt-1 mb-1 pl-6">List the steps clearly so we can replicate the issue.</p>
              <Textarea id="support-stepsToReproduce" placeholder="1. First I did...\n2. Then I clicked...\n3. The error occurred when..." value={formData.stepsToReproduce || ''} onChange={(e) => updateFormData({ stepsToReproduce: e.target.value })} className="min-h-[80px] border-gray-300 focus:border-support-blue focus:ring-support-blue" />
            </div>

            {/* Urgency Level */}
            <div className="space-y-2">
              <Label htmlFor="support-urgencyLevel" className="flex items-center gap-2 font-medium"><Timer className="h-4 w-4 text-gray-600" /> Urgency Level <span className="text-red-500">*</span></Label>
              <Select value={formData.urgencyLevel} onValueChange={(value) => updateFormData({ urgencyLevel: value as UrgencyLevel })} required aria-required="true">
                <SelectTrigger id="support-urgencyLevel" className="border-gray-300 focus:border-support-blue focus:ring-support-blue"><SelectValue placeholder="Select Urgency Level..." /></SelectTrigger>
                <SelectContent><SelectGroup>{Object.entries(URGENCY_LEVELS).map(([value, label]) => ( <SelectItem key={value} value={value}>{label}</SelectItem> ))}</SelectGroup></SelectContent>
              </Select>
              {!formData.urgencyLevel && <p className="text-red-600 text-xs mt-1">Urgency level is required.</p>}
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium"><Upload className="h-4 w-4 text-gray-600" /> Attach Files (Optional)</Label>
              <div
                 className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors file-upload-area",
                    isDragging ? "border-support-blue bg-blue-50" : "border-gray-300 hover:border-support-blue/50 hover:bg-gray-50"
                 )}
                 onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleFileDrop}
                 onClick={() => document.getElementById("support-attachment-upload")?.click()}
                 role="button" tabIndex={0} aria-label="Upload files area"
              >
                <div className="flex flex-col items-center gap-1 text-gray-600">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Drag & drop files, or <span className="text-support-blue font-semibold">click to browse</span></p>
                    <p className="text-xs text-gray-500 mt-1">Max 5 files, 5MB each. (Images, Logs, PDFs, ZIP)</p>
                </div>
                <input
                  id="support-attachment-upload"
                  type="file" multiple
                  accept="image/jpeg, image/png, image/gif, text/plain, application/pdf, application/zip, .log, .txt"
                  onChange={handleFileChange} className="hidden"
                 />
              </div>
              {/* Display uploaded files */}
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="mt-3 border border-gray-200 rounded-md p-3 space-y-2 bg-gray-50/50">
                  <p className="text-sm font-medium mb-1">Attached Files ({formData.attachments.length}/5):</p>
                  <ul className="space-y-1 max-h-32 overflow-y-auto">
                    {formData.attachments.map((file, index) => (
                     <li key={`${file.name}-${index}-${file.lastModified}`} className="flex items-center justify-between p-1.5 bg-white rounded text-sm border border-gray-200">
                       {/* This is where the ReactNode error might have been triggered if getFileIcon returned void */}
                       <div className="flex items-center gap-2 overflow-hidden min-w-0">{getFileIcon(file)}<span className="truncate flex-1" title={file.name}>{file.name}</span><span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span></div>
                       <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)} className="h-6 w-6 p-0 text-gray-500 hover:text-red-600 flex-shrink-0 ml-2" aria-label={`Remove ${file.name}`}><X className="h-4 w-4" /></Button>
                      </li>
                    ))}
                   </ul>
                </div>
              )}
            </div>
          </div>
          {/* Navigation */}
          <div className="flex justify-between pt-4">
             <Button type="button" onClick={prevStep} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">Previous</Button>
             <Button
                type="button" // Changed type
                onClick={handleNext} // Call handler
                disabled={!isFormValid}
                className="bg-support-blue hover:bg-support-dark-blue text-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-disabled={!isFormValid}
              >
                Review Request
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueDescriptionStep;