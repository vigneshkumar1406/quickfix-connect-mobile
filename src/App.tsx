
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import LanguageSelectionPage from "./pages/LanguageSelectionPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import VerificationPage from "./pages/VerificationPage";
import NotFound from "./pages/NotFound";
import AboutUsPage from "./pages/AboutUsPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import GuestExplorerPage from "./pages/GuestExplorerPage";

// Customer pages
import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";
import BookServicePage from "./pages/customer/BookServicePage";
import FindingServicePage from "./pages/customer/FindingServicePage";
import ServiceEstimationPage from "./pages/customer/ServiceEstimationPage";
import ServiceTrackingPage from "./pages/customer/ServiceTrackingPage";
import ReviewServicePage from "./pages/customer/ReviewServicePage";
import CustomerProfilePage from "./pages/customer/CustomerProfilePage";
import CustomerSettingsPage from "./pages/customer/CustomerSettingsPage";
import CustomerNotificationsPage from "./pages/customer/CustomerNotificationsPage";
import EmergencySupportPage from "./pages/customer/EmergencySupportPage";
import MultipleEstimationPage from "./pages/customer/MultipleEstimationPage";
import QuickFixWalletPage from "./pages/customer/QuickFixWalletPage";
import EditableProfilePage from "./pages/customer/EditableProfilePage";
import MyBookingsPage from "./pages/customer/MyBookingsPage";
import NativeDevicesPage from "./pages/customer/NativeDevicesPage";
import MyRatingsPage from "./pages/customer/MyRatingsPage";
import PaymentMethodsPage from "./pages/customer/PaymentMethodsPage";
import BillingHistoryPage from "./pages/customer/BillingHistoryPage";
import ElectricalServiceEstimationPage from "./pages/customer/ElectricalServiceEstimationPage";
import CarpentryServiceEstimationPage from "./pages/customer/CarpentryServiceEstimationPage";
import PlumbingServiceEstimationPage from "./pages/customer/PlumbingServiceEstimationPage";

// Worker pages
import WorkerDashboardPage from "./pages/worker/WorkerDashboardPage";
import WorkerRegistrationPage from "./pages/worker/WorkerRegistrationPage";
import WorkerTermsPage from "./pages/worker/WorkerTermsPage";
import WorkerPaymentPage from "./pages/worker/WorkerPaymentPage";
import WorkerJobDetailsPage from "./pages/worker/WorkerJobDetailsPage";
import WorkerEstimationCheckPage from "./pages/worker/WorkerEstimationCheckPage";
import WorkerBillGenerationPage from "./pages/worker/WorkerBillGenerationPage";
import AadhaarKYCVerificationPage from "./pages/worker/AadhaarKYCVerificationPage";

// Admin pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CallCenterDashboardPage from "./pages/callcenter/CallCenterDashboardPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LocationProvider>
            <LanguageProvider>
              <TooltipProvider>
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/language-selection" element={<LanguageSelectionPage />} />
                  <Route path="/role-selection" element={<RoleSelectionPage />} />
                  <Route path="/verification" element={<VerificationPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/guest-explorer" element={<GuestExplorerPage />} />
                  
                  {/* Customer routes */}
                  <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
                  <Route path="/customer/book-service" element={<BookServicePage />} />
                  <Route path="/customer/finding-service" element={<FindingServicePage />} />
                  <Route path="/customer/estimation" element={<ServiceEstimationPage />} />
                  <Route path="/customer/service-estimation" element={<ServiceEstimationPage />} />
                  <Route path="/customer/electrical-estimation" element={<ElectricalServiceEstimationPage />} />
                  <Route path="/customer/carpentry-estimation" element={<CarpentryServiceEstimationPage />} />
                  <Route path="/customer/plumbing-estimation" element={<PlumbingServiceEstimationPage />} />
                  <Route path="/customer/tracking" element={<ServiceTrackingPage />} />
                  <Route path="/customer/service-tracking" element={<ServiceTrackingPage />} />
                  <Route path="/customer/review" element={<ReviewServicePage />} />
                  <Route path="/customer/review-service" element={<ReviewServicePage />} />
                  <Route path="/customer/profile" element={<CustomerProfilePage />} />
                  <Route path="/customer/edit-profile" element={<EditableProfilePage />} />
                  <Route path="/customer/my-bookings" element={<MyBookingsPage />} />
                  <Route path="/customer/native-devices" element={<NativeDevicesPage />} />
                  <Route path="/customer/my-ratings" element={<MyRatingsPage />} />
                  <Route path="/customer/payment-methods" element={<PaymentMethodsPage />} />
                  <Route path="/customer/billing-history" element={<BillingHistoryPage />} />
                  <Route path="/customer/settings" element={<CustomerSettingsPage />} />
                  <Route path="/customer/notifications" element={<CustomerNotificationsPage />} />
                  <Route path="/customer/emergency-support" element={<EmergencySupportPage />} />
                  <Route path="/customer/multiple-estimation" element={<MultipleEstimationPage />} />
                  <Route path="/customer/wallet" element={<QuickFixWalletPage />} />
                  
                  {/* Worker routes */}
                  <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
                  <Route path="/worker/registration" element={<WorkerRegistrationPage />} />
                  <Route path="/worker/terms" element={<WorkerTermsPage />} />
                  <Route path="/worker/payment" element={<WorkerPaymentPage />} />
                  <Route path="/worker/job-details" element={<WorkerJobDetailsPage />} />
                  <Route path="/worker/estimation-check" element={<WorkerEstimationCheckPage />} />
                  <Route path="/worker/bill-generation" element={<WorkerBillGenerationPage />} />
                  <Route path="/worker/kyc-verification" element={<AadhaarKYCVerificationPage />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/call-center/dashboard" element={<CallCenterDashboardPage />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </LanguageProvider>
          </LocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
