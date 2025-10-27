// src/pages/Impact.jsx
import React from 'react';
import { FaRecycle, FaCoins, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BackToHome from "../components/BackToHome";

const Impact = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: <FaRecycle className="text-[#16A34A] text-4xl mb-4" />,
      title: "Waste Recycled",
      value: "500 tons",
      desc: "Diverted from Ogun State landfills, protecting our environment.",
      delay: "animate-fadeIn"
    },
    {
      icon: <FaCoins className="text-yellow-500 text-4xl mb-4" />,
      title: "Cash Rewards",
      value: "₦37,200",
      desc: "Paid to citizens for recycling. Earn while cleaning.",
      delay: "animate-fadeIn delay-300"
    },
    {
      icon: <FaUsers className="text-blue-500 text-4xl mb-4" />,
      title: "Active Users",
      value: "1,247",
      desc: "Citizens turning waste into wealth every day.",
      delay: "animate-fadeIn delay-600"
    },
    {
      icon: <FaMapMarkerAlt className="text-red-500 text-4xl mb-4" />,
      title: "Live Tracking",
      value: "Real-Time",
      desc: "Illegal dumps reported and cleared instantly.",
      button: true,
      delay: "animate-fadeIn delay-900"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-green-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-primary mb-12 text-center">
          EcoCycle Impact
        </h2>
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`${stat.delay} bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100`}
            >
              {stat.icon}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {stat.title}
              </h3>
              <p className="text-3xl font-extrabold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {stat.desc}
              </p>
              {stat.button && (
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition font-medium text-sm"
                >
                  View Live Map
                </button>
              )}
            </div>
          ))}
        </div>
        <BackToHome />
      </div>
    </section>
  );
};

export default Impact;