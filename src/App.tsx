import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import LanguageSelectionPage from "@/pages/LanguageSelectionPage";
import RoleSelectionPage from "@/pages/RoleSelectionPage";
import VerificationPage from "@/pages/VerificationPage";
import GuestExplorerPage from "@/pages/GuestExplorerPage";
import FAQPage from "@/pages/FAQPage";
import AboutUsPage from "@/pages/AboutUsPage";
import ContactPageWrapper from "./pages/ContactPage";

// Customer Pages
import CustomerDashboardPage from "@/pages/customer/CustomerDashboardPage";
import BookServicePage from "@/pages/customer/BookServicePage";
import FindingServicePage from "@/pages/customer/FindingServicePage";
import ServiceTrackingPage from "@/pages/customer/ServiceTrackingPage";
import ReviewServicePage from "@/pages/customer/ReviewServicePage";
import QuickFixWalletPage from "@/pages/customer/QuickFixWalletPage";
import ServiceEstimationPage from "@/pages/customer/ServiceEstimationPage";

// Worker Pages
import WorkerDashboardPage from "@/pages/worker/WorkerDashboardPage";
import WorkerRegistrationPage from "@/pages/worker/WorkerRegistrationPage";
import WorkerTermsPage from "@/pages/worker/WorkerTermsPage";
import WorkerJobDetailsPage from "@/pages/worker/WorkerJobDetailsPage";
import WorkerPaymentPage from "@/pages/worker/WorkerPaymentPage";
import WorkerEstimationCheckPage from "@/pages/worker/WorkerEstimationCheckPage";
import WorkerBillGenerationPage from "@/pages/worker/WorkerBillGenerationPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <LocationProvider>
              <Toaster />
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/language-selection" element={<LanguageSelectionPage />} />
                  <Route path="/role-selection" element={<RoleSelectionPage />} />
                  <Route path="/verification" element={<VerificationPage />} />
                  <Route path="/guest-explorer" element={<GuestExplorerPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/contact" element={<ContactPageWrapper />} />
                  
                  {/* Customer Routes */}
                  <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
                  <Route path="/customer/book-service" element={<BookServicePage />} />
                  <Route path="/customer/finding-service" element={<FindingServicePage />} />
                  <Route path="/customer/service-tracking" element={<ServiceTrackingPage />} />
                  <Route path="/customer/review-service" element={<ReviewServicePage />} />
                  <Route path="/customer/wallet" element={<QuickFixWalletPage />} />
                  <Route path="/customer/estimation" element={<ServiceEstimationPage />} />
                  
                  {/* Worker Routes */}
                  <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
                  <Route path="/worker/registration" element={<WorkerRegistrationPage />} />
                  <Route path="/worker/terms" element={<WorkerTermsPage />} />
                  <Route path="/worker/job-details" element={<WorkerJobDetailsPage />} />
                  <Route path="/worker/payment" element={<WorkerPaymentPage />} />
                  <Route path="/worker/estimation-check" element={<WorkerEstimationCheckPage />} />
                  <Route path="/worker/bill-generation" element={<WorkerBillGenerationPage />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </LocationProvider>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
