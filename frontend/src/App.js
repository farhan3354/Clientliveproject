import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import LoadingSpinner from "./component/Spinner";

const RegisterForm = lazy(() => import("./component/signup"));
const ProgramDetail = lazy(() => import("./component/adminPanel/ProgramDetail"));
const AdminDashboard = lazy(() => import("./component/adminPanel/dashboard"));
const UserDash = lazy(() => import("./component/mbaUsers/dashboard"));
const SignInForm = lazy(() => import("./component/signin"));
const NotFound = lazy(() => import("./component/Error"));
const ConfirmationPopup = lazy(() => import("./component/adminPanel/test_component"));
const Landing = lazy(() => import("./component/landing"));
const ContentLoader = lazy(() => import("./component/contentloader"));
const Forgotpassword = lazy(() => import("./component/Forgotpassword"));
const LeadGenerationPage = lazy(() => import("./component/LeadGenerationPage"));
const UserDetails = lazy(() => import("./component/customer-details")); // ✅ Add UserDetails

const queryClient = new QueryClient();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Landing />} />
              <Route exact path="/signin" element={<SignInForm onLogin={handleLogin} />} />
              <Route exact path="/forgotpassword" element={<Forgotpassword />} />
              <Route exact path="/register" element={<RegisterForm onLogin={handleLogin} />} />
              <Route exact path="/masteryma" element={<LeadGenerationPage />} />
              <Route exact path="/admindashboard" element={<AdminDashboard isLoggedIn={isLoggedIn} />} />
              <Route exact path="/admindashboard/user-details/:id" element={<UserDetails />} /> {/* ✅ User Details Route */}
              <Route exact path="/mba" element={<UserDash isLoggedIn={isLoggedIn} />} />
              <Route path="/programs" element={<ProgramDetail isLoggedIn={isLoggedIn} />} />
              <Route exact path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
