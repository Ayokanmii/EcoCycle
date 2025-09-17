import React from 'react';

const Team = () => (
  <section className="py-12 sm:py-16 bg-customBlack">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-customRed mb-2">
        EcoCycle Development Team
      </h1>
      <h2 className="text-xl sm:text-2xl font-semibold text-customWhite mb-6">
        Damilola, Enoch, and Precious
      </h2>
      <p className="text-base sm:text-lg text-customGray leading-relaxed mb-4">
        The EcoCycle team, comprising 3MTT Cohort 3 graduates, brings expertise in React, Firebase, and innovative technology solutions. This group is committed to addressing Ogun State’s waste management challenges through a scalable and impactful platform.
      </p>
      <p className="text-base sm:text-lg text-customGray leading-relaxed mb-6">
        Future Outlook: The team is exploring AI-powered waste scanning to further enhance the efficiency and reach of EcoCycle.
      </p>
    </div>
  </section>
);

export default Team;