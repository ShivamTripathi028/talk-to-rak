// src/components/LandingPage.tsx
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'; // Import icons used

// Define the props type
interface LandingPageProps {
  setView: (view: 'inquiry' | 'support') => void;
}

// --- Replicated Header Component ---
const LandingHeader = () => {
  return (
    <header className="relative bg-gradient-to-b from-blue-700 to-blue-600 text-white py-12 md:py-16 overflow-hidden mb-6">
      {/* Optional: Add background elements like SVG if you have them */}
      {/* <div className="absolute inset-0 z-0"> ... </div> */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          {/* You can replace this with an actual RAK logo if available */}
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
             <span className="text-3xl font-bold text-blue-600">R</span>
           </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
            Welcome to the RAK Help Hub
          </h1>
          <p className="text-lg text-blue-100 text-center max-w-3xl mb-8">
            Find the support or information you need for your RAKwireless products and solutions.
          </p>
          {/* Search bar - purely visual for this component */}
          <div className="w-full max-w-xl relative">
            <input
              type="text"
              placeholder="Search help articles..." // Placeholder text
              className="w-full py-3 px-4 pl-12 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
              readOnly // Make it read-only as search is not implemented here
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Replicated InfoBox Component ---
const InfoBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-md shadow-sm my-8 max-w-4xl mx-auto">
      <button
        className="w-full px-4 md:px-6 py-4 flex justify-between items-center cursor-pointer text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <h2 className="text-base md:text-lg font-medium text-blue-800">📘 How does this work?</h2>
        {isExpanded ? (
          <ChevronUp className="text-blue-500 flex-shrink-0" size={20} />
        ) : (
          <ChevronDown className="text-blue-500 flex-shrink-0" size={20} />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 md:px-6 pb-4 space-y-3 text-sm text-blue-900 animate-fade-in">
          <p>
            Select the type of assistance you need below. Your request will be routed to the appropriate RAKwireless team.
          </p>
          <div>
            <h3 className="font-semibold">Technical Support Requests:</h3>
            <p className="mt-1">For issues like device setup, configuration problems, firmware updates, or troubleshooting hardware/software. Handled by the RAK Technical Support Team.</p>
          </div>
          <div>
            <h3 className="font-semibold">Inquiries & Pre-Sales:</h3>
            <p className="mt-1">For help choosing the right LoRaWAN® device, understanding product capabilities, deployment advice, or getting quotes. Handled by the RAK Sales and Solution Engineering Teams.</p>
          </div>
          <div>
            <h3 className="font-semibold">⏰ Working Hours:</h3>
            <p className="mt-1">Our teams primarily operate between 9 AM - 6 PM (GMT+8), Monday to Friday. Response times vary based on request type and urgency.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Replicated FormSelector Component ---
const FormSelector = ({ onSelectForm }: { onSelectForm: (formType: 'support' | 'inquiry') => void }) => {
  return (
    <div className="py-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Your Request Type</h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Technical Support Card */}
        <div
          onClick={() => onSelectForm('support')}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-400 cursor-pointer flex flex-col h-full group" // Added group class
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectForm('support')}
        >
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">RAKwireless Technical Support</h3>
            <p className="text-gray-600 text-sm">
              Get help with device setup, configuration, firmware issues, troubleshooting, and more.
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <span className="flex items-center text-blue-600 font-medium group-hover:text-blue-800"> {/* Use span instead of button */}
              Request Technical Support <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </div>
        </div>

        {/* Inquiry Card */}
        <div
          onClick={() => onSelectForm('inquiry')}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-400 cursor-pointer flex flex-col h-full group" // Added group class
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectForm('inquiry')}
        >
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">RAKwireless Inquiry</h3>
            <p className="text-gray-600 text-sm">
              Need guidance choosing the right product? Fill out our form detailing your use case, region, and application field.
            </p>
          </div>
          <div className="mt-4 flex justify-end">
             <span className="flex items-center text-blue-600 font-medium group-hover:text-blue-800"> {/* Use span instead of button */}
              Submit Inquiry <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Landing Page Main Component ---
const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  return (
    <div className="flex flex-col min-h-screen"> {/* Ensure it takes full height */}
      <LandingHeader />
      <main className="flex-grow container mx-auto px-4">
        <InfoBox />
        <FormSelector onSelectForm={setView} />
      </main>
       <footer className="py-6 bg-gray-100 border-t mt-10">
         <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
           <p>© {new Date().getFullYear()} RAKwireless Technology Limited. All rights reserved.</p>
         </div>
       </footer>
    </div>
  );
};

export default LandingPage;