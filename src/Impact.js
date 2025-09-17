import React from 'react';

const Impact = () => (
  <section className="py-12 sm:py-16 bg-customBlack">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-customRed mb-8">📊 Impact Metrics</h2>
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        <div className="bg-customBlack p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl sm:text-2xl font-semibold text-customWhite mb-3">
            Waste Management
          </h3>
          <p className="text-sm sm:text-base text-customGray mb-4">
            EcoCycle has successfully diverted over 10,000 tons of waste from Ogun State, contributing to sustainable environmental management.
          </p>
        </div>
        <div className="bg-customBlack p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl sm:text-2xl font-semibold text-customWhite mb-3">
            Economic Contribution
          </h3>
          <p className="text-sm sm:text-base text-customGray mb-4">
            The initiative has generated approximately ₦5 million in recycling rewards, benefiting over 5,000 residents across Ogun State.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Impact;