import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-customBlack shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-customRed">
          EcoCycle
        </h1>
        <div className="flex space-x-4 sm:space-x-6">
          <Link
            to="/"
            className="text-base sm:text-lg font-medium text-customGray hover:text-customRed transition-colors"
            aria-label="Navigate to Home section"
          >
            Home
          </Link>
          <Link
            to="/impact"
            className="text-base sm:text-lg font-medium text-customGray hover:text-customRed transition-colors"
            aria-label="Navigate to Impact section"
          >
            Impact
          </Link>
          <Link
            to="/team"
            className="text-base sm:text-lg font-medium text-customGray hover:text-customRed transition-colors"
            aria-label="Navigate to Team section"
          >
            Team
          </Link>
          <Link
            to="/resources"
            className="text-base sm:text-lg font-medium text-customGray hover:text-customRed transition-colors"
            aria-label="Navigate to Resources section"
          >
            Resources
          </Link>
        </div>
      </div>
    </nav>
  );
}