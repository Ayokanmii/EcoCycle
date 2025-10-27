// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Links */}
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 mb-6 text-sm">
          <a
            href="https://3mtt.nitda.gov.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-accent transition-colors underline"
          >
            3MTT Portal
          </a>
          <a
            href="mailto:support@3mtt.gov.ng"
            className="text-white hover:text-accent transition-colors underline"
          >
            Support
          </a>
          {/* Add YouTube if you have it */}
          <a
            href="https://www.youtube.com/@3MTTNigeria" // Example – replace with real
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-accent transition-colors underline"
          >
            YouTube
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-white/80">
          &copy; {new Date().getFullYear()} EcoCycle Team: Damilola, Enoch, and Precious. 
          Transforming Ogun State – 500 tons and counting. All rights reserved.
        </p>
      </div>
    </footer>
  );
}