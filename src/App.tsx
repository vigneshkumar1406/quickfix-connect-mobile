
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LanguageSelectionPage from "./pages/LanguageSelectionPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import VerificationPage from "./pages/VerificationPage";
import GuestExplorerPage from "./pages/GuestExplorerPage";
import FAQPage from "./pages/FAQPage";
import AboutUsPage from "./pages/AboutUsPage";

// Worker Pages
import WorkerRegistrationPage from "./pages/worker/WorkerRegistrationPage";
import WorkerTermsPage from "./pages/worker/WorkerTermsPage";
import WorkerPaymentPage from "./pages/worker/WorkerPaymentPage";
import WorkerDashboardPage from "./pages/worker/WorkerDashboardPage";
import WorkerJobDetailsPage from "./pages/worker/WorkerJobDetailsPage";

// Customer Pages
import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";
import BookServicePage from "./pages/customer/BookServicePage";
import FindingServicePage from "./pages/customer/FindingServicePage";
import ServiceTrackingPage from "./pages/customer/ServiceTrackingPage";
import ReviewServicePage from "./pages/customer/ReviewServicePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <LocationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* General Pages */}
                <Route path="/guest-explorer" element={<GuestExplorerPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                
                {/* Authentication Flow */}
                <Route path="/language-selection" element={<LanguageSelectionPage />} />
                <Route path="/role-selection" element={<RoleSelectionPage />} />
                <Route path="/verify" element={<VerificationPage />} />
                
                {/* Worker Flow */}
                <Route path="/worker/registration" element={<WorkerRegistrationPage />} />
                <Route path="/worker/terms" element={<WorkerTermsPage />} />
                <Route path="/worker/payment" element={<WorkerPaymentPage />} />
                <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
                <Route path="/worker/job-details" element={<WorkerJobDetailsPage />} />
                
                {/* Customer Flow */}
                <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
                <Route path="/customer/book-service" element={<BookServicePage />} />
                <Route path="/customer/finding-service" element={<FindingServicePage />} />
                <Route path="/customer/tracking" element={<ServiceTrackingPage />} />
                <Route path="/customer/review" element={<ReviewServicePage />} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LocationProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
