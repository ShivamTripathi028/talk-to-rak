// src/App.tsx
import { useState } from 'react'; // Added React back just in case
import LandingPage from './components/LandingPage';
import InquiryForm from './components/InquiryForm';
import TechnicalSupportForm from './components/TechnicalSupportForm';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupportFormProvider } from './contexts/SupportFormContext';

type ViewState = 'landing' | 'inquiry' | 'support';

const queryClient = new QueryClient();

function App() {
  const [view, setView] = useState<ViewState>('landing');

  const goBackToLanding = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Removed the outer main container and max-width classes */}
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Conditional Rendering Logic */}
            {view === 'landing' && <LandingPage setView={setView} />}

            {view === 'inquiry' && (
              <InquiryForm goBack={goBackToLanding} />
            )}

            {view === 'support' && (
              <SupportFormProvider>
                <TechnicalSupportForm goBack={goBackToLanding} />
              </SupportFormProvider>
            )}

          {/* Render Toasters globally */}
          <ShadcnToaster />
          <SonnerToaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;