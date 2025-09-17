export default function Footer() {
  return (
    <footer className="py-6 bg-customBlack text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center space-x-4 sm:space-x-6 mb-4">
          <a
            href="https://3mtt.gov.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-customGray hover:text-customRed transition-colors"
            aria-label="Visit 3MTT website"
          >
            3MTT Portal
          </a>
          <a
            href="mailto:support@3mtt.gov.ng"
            className="text-customGray hover:text-customRed transition-colors"
            aria-label="Email 3MTT support"
          >
            Support
          </a>
        </div>
        <p className="text-sm sm:text-base text-customGray">
          &copy; {new Date().getFullYear()} EcoCycle Team: Damilola, Enoch, and Precious. All rights reserved.
        </p>
      </div>
    </footer>
  );
}