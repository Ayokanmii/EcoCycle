// src/pages/Impact.jsx
import React from 'react';
import { FaRecycle, FaCoins, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BackToHome from "../components/BackToHome";

const stats = [
  {
    icon: <FaRecycle className="text-[#16A34A] text-4xl mb-4" />,
    title: "Waste Recycled",
    value: "500 tons",
    desc: "Diverted from Ogun State landfills, protecting our environment.",
    tag: { icon: <FaRecycle className="text-[#16A34A]" />, name: "Recycling" },
    delay: "animate-fadeIn"
  },
  {
    icon: <FaCoins className="text-yellow-500 text-4xl mb-4" />,
    title: "Cash Rewards",
    value: "₦37,200",
    desc: "Paid to citizens for recycling. Earn while cleaning.",
    tag: { icon: <FaCoins className="text-yellow-500" />, name: "Rewards" },
    delay: "animate-fadeIn delay-300"
  },
  {
    icon: <FaUsers className="text-blue-500 text-4xl mb-4" />,
    title: "Active Users",
    value: "1,247",
    desc: "Citizens turning waste into wealth every day.",
    tag: { icon: <FaUsers className="text-blue-500" />, name: "Community" },
    delay: "animate-fadeIn delay-600"
  },
  {
    icon: <FaMapMarkerAlt className="text-red-500 text-4xl mb-4" />,
    title: "Live Tracking",
    value: "Real-Time",
    desc: "Illegal dumps reported and cleared instantly.",
    tag: { icon: <FaMapMarkerAlt className="text-red-500" />, name: "Tracking" },
    button: true,
    delay: "animate-fadeIn delay-900"
  }
];

const Impact = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 animate-fadeIn">
            EcoCycle Impact
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fadeIn delay-300">
            Real results from real action — transforming waste management in Ogun State.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`${stat.delay} bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700 hover:scale-105 hover-lift`}
            >
              {/* Icon in Gradient Circle */}
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 shadow-lg">
                {stat.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {stat.title}
              </h2>

              {/* Value */}
              <p className="text-3xl font-extrabold text-primary mb-3">
                {stat.value}
              </p>

              {/* Description */}
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6 flex-grow">
                {stat.desc}
              </p>

              {/* Tag Badge */}
              <div className="flex gap-3 justify-center mb-4">
                <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-lg">{stat.tag.icon}</span>
                  <span>{stat.tag.name}</span>
                </div>
              </div>

              {/* Optional Button */}
              {stat.button && (
                <button
                  onClick={() => navigate("/")}
                  className="mt-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition font-medium text-sm"
                >
                  View Live Map
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <BackToHome />
      </div>
    </section>
  );
};

export default Impact;
