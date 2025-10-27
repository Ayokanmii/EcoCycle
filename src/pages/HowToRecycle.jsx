// src/pages/HowToRecycle.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaPlay, 
  FaLeaf, 
  FaRecycle, 
  FaDollarSign, 
  FaArrowLeft,
  FaLightbulb,
  FaUsers,
  FaGlobeAmericas
} from "react-icons/fa";
import BackToHome from "../components/BackToHome";

const HowToRecycle = () => {
  const navigate = useNavigate();

  const videos = [
    {
      title: "Ogun State Recycling Programs",
      id: "jaTWRu4ieso",
      desc: "OGWAMA's Plastic-for-Cash & Blue Box initiatives — earn while cleaning.",
      icon: <FaGlobeAmericas className="text-green-600" />
    },
    {
      title: "How to Recycle Plastics",
      id: "zO3jFKiqmHo",
      desc: "Clean, sort, and sell at ₦30/kg. Turn bottles into income.",
      icon: <FaRecycle className="text-blue-600" />
    },
    {
      title: "Paper Recycling 101",
      id: "K_0TjtK1HBI",
      desc: "Save trees, reduce waste. Paper is reborn in 7 days.",
      icon: <FaLeaf className="text-green-600" />
    },
    {
      title: "Metal & Can Recycling",
      id: "x3-gwTK9lOc",
      desc: "70% less energy to recycle. Sell cans for instant cash.",
      icon: <FaDollarSign className="text-yellow-600" />
    },
    {
      title: "Glass: Infinite Recycling",
      id: "18oxQkP4qQ0",
      desc: "100% recyclable forever. No quality loss. High demand.",
      icon: <FaRecycle className="text-teal-600" />
    },
    {
      title: "Composting at Home",
      id: "wH6IRVKs_pQ",
      desc: "Food scraps → rich soil. Free fertilizer in 30 days.",
      icon: <FaLeaf className="text-emerald-600" />
    },
    {
      title: "Upcycling Plastic Bottles",
      id: "FpsXvO5LsTY",
      desc: "From waste to art: planters, lamps, income streams.",
      icon: <FaLightbulb className="text-orange-600" />
    },
    {
      title: "Join Community Cleanups",
      id: "5sEwbtV4LPQ",
      desc: "Work with PSPs. Earn rewards. Build a cleaner Ogun.",
      icon: <FaUsers className="text-indigo-600" />
    },
  ];

  const wasteToWealth = [
    { item: "Organic Waste → Compost", profit: "₦50,000/ton" },
    { item: "Plastics → Eco-Bricks", profit: "Construction demand" },
    { item: "Glass → Building Blocks", profit: "30% cost savings" },
    { item: "Textiles → Crafts", profit: "Bags, rugs, insulation" },
    { item: "E-Waste → Parts", profit: "High resale value" },
    { item: "Cleanups → CSR", profit: "NGOs & carbon credits" },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 animate-fadeIn">
            Turn Waste into Wealth
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto animate-fadeIn delay-300">
            Master recycling in Ogun State. <strong className="text-accent">Earn ₦30/kg</strong> for plastics. 
            Help us hit <strong className="text-accent">500 tons recycled</strong>.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
              8 Videos
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">
              6 Income Ideas
            </span>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {videos.map((video, i) => (
            <div
              key={i}
              className={`animate-fadeIn bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover-lift`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                  {video.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {video.desc}
                  </p>
                </div>
              </div>

              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Waste-to-Wealth Section */}
        <div className="mt-16 bg-gradient-to-r from-primary to-accent p-8 rounded-2xl shadow-2xl text-white">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <FaLightbulb className="text-yellow-300" /> Waste-to-Wealth Ideas
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {wasteToWealth.map((idea, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition"
              >
                <p className="font-semibold">{idea.item}</p>
                <p className="text-sm opacity-90 mt-1">{idea.profit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Ready to start earning? <strong className="text-primary">Scan your first item today.</strong>
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-accent transition shadow-lg hover:shadow-xl text-lg font-bold flex items-center gap-3 mx-auto hover-lift"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>

        <BackToHome />
      </div>
    </section>
  );
};

export default HowToRecycle;