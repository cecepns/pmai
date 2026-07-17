import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import VisionMission from "./components/VisionMission";
import RolesObjectives from "./components/RolesObjectives";
import Directory from "./components/Directory";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";
import RegisterModal from "./components/RegisterModal";
import Login from "./components/admin/Login";
import Dashboard from "./components/admin/Dashboard";
import { request } from "./utils/request";
import { API_ENDPOINTS } from "./utils/endpoints";

// Wrap public sections into a Single Page view
function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [content, setContent] = useState(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch dynamic content from Express backend API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await request.get(API_ENDPOINTS.CONTENT.GET);
        if (res.success && res.data) {
          setContent(res.data);
        }
      } catch (err) {
        console.warn("Failed to fetch landing content from API, using default fallbacks.", err);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Dynamic Nav Header */}
      <Navbar 
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
      />

      {/* Visual layouts */}
      <main className="flex-grow">
        <Hero content={content} setIsRegisterModalOpen={setIsRegisterModalOpen} />
        <About content={content} />
        <VisionMission content={content} />
        <RolesObjectives content={content} />
        <Directory />
        <Contact setIsContactModalOpen={setIsContactModalOpen} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Input dialog popups */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
