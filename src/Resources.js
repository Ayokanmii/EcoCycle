import React from 'react';

const Resources = () => (
  <section className="py-12 sm:py-16 bg-customBlack">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-customRed mb-6">
        📌 Project Resources
      </h2>
      <div className="text-base sm:text-lg text-customGray space-y-3">
        <p>Drop-off Locations: Abeokuta, Ijebu-Ode, Sango Ota, Ota, Ifo</p>
        <p>
          Support Contact:{' '}
          <a
            href="mailto:support@3mtt.gov.ng"
            className="text-customRed hover:underline"
            aria-label="Email 3MTT support"
          >
            support@3mtt.gov.ng
          </a>
        </p>
        <p>
          3MTT Portal:{' '}
          <a
            href="https://3mtt.gov.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-customRed hover:underline"
            aria-label="Visit 3MTT website"
          >
            https://3mtt.gov.ng
          </a>
        </p>
        <p>Guidance: Maximize returns by selling plastics for ₦30/kg to registered partners.</p>
      </div>
    </div>
  </section>
);

export default Resources;