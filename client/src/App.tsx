import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import BookCourt from "@/pages/BookCourt";
import BookingConfirmation from "@/pages/BookingConfirmation";
import Memberships from "@/pages/Memberships";
import Coaching from "@/pages/Coaching";
import Classes from "@/pages/Classes";
import Events from "@/pages/Events";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/AdminDashboard";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Login from "@/pages/Login";
import { AuthProvider } from "@/contexts/AuthContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/book" component={BookCourt} />
      <Route path="/booking-confirmation" component={BookingConfirmation} />
      <Route path="/memberships" component={Memberships} />
      <Route path="/coaching" component={Coaching} />
      <Route path="/classes" component={Classes} />
      <Route path="/events" component={Events} />
      <Route path="/about" component={AboutUs} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#0f141a]">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
