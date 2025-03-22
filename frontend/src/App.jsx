import { useState } from "react";
import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/header";
import Hero from "./components/Hero";
import ThreeJSBackground from "./components/ThreeJSBackground";
import FeatureCards from "./components/FeatureCards";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTAsection";
import AuthForm from "./components/AuthForm";
import Login from "./components/Login";
import Footer from "./components/Footer"; // Footer stays only on Home & Marketplace

const HomePage = () => (
  <>
    <Hero />
    <FeatureCards />
    <Testimonials />
    <CTASection />
  </>
);

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

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Layout>
        <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<AuthForm />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

export default App;
