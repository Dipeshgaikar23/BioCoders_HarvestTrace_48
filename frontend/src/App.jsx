import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ThreeJSBackground from "./components/ThreeJSBackground";
import Hero from "./components/Hero";
import FeatureCards from "./components/FeatureCards";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTAsection";
// import Checkout from "./components/Checkout";
import AuthForm from "./components/AuthForm";
import Login from "./components/Login";
import Marketplace from "./components/Marketplace";
import Footer from "./components/Footer"; // Footer stays only on Home & Marketplace
import Cart from "./components/Cart";
// import Invoice from "./components/Invoice";
// import OrderConfirm from "./components/OrderConfirm";
// import UserProfile from "./components/UserProfile";
import ProductCard from "./components/ProductCard";
// import Qrscanned from "./components/QrScanned";
// import PaymentGateway from "./components/PaymentGateway";
import AdminLogin from "./components/adminLogin";
import AdminDashboard from "./components/AdminDashboard";
import FarmerDashboard from "./components/FarmerDashboard";

// Home Page Layout
const HomePage = () => (
  <>
    <Hero />
    <FeatureCards />
    <Testimonials />
    <CTASection />
  </>
);

// Layout Component (Footer only on Home & Marketplace)
const Layout = ({ children }) => {
  const location = useLocation();
  const showFooter =
    location.pathname === "/" || location.pathname === "/marketplace";

  return (
    <>
      <ThreeJSBackground />
      <Header />
      {children}
      {showFooter && <Footer />} {/* ✅ Footer only for Home & Marketplace */}
    </>
  );
};

const App = () => {
  return (
    <Layout>
      <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
          <Route path="/register" element={<AuthForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ObviouslyNotAdmin/login" element={<AdminLogin />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />{" "}
          <Route path="/farmerdashboard" element={<FarmerDashboard />} />{" "}
          {/* <Route path="/invoice" element={<Invoice />} /> */}
          {/* <Route path="/orderconfirm" element={<OrderConfirm />} />{" "} */}
          {/* <Route path="/userprofile" element={<UserProfile />} />{" "} */}
          {/* <Route path="/payment" element={<PaymentGateway />} />{" "} */}
          <Route
            path="/marketplace"
            element={<ProductCard product={{ id: 1 }} />}
          />
          {/* <Route path="/product/:id" element={<Qrscanned />} /> */}
          {/* ✅ Lazy Loaded */}
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
