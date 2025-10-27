// src/pages/Resources.jsx
import React from "react";
import { 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaGithub, 
  FaLinkedin, 
  FaDownload, 
  FaLightbulb,
  FaCodeBranch
} from "react-icons/fa";
import BackToHome from "../components/BackToHome";

const Resources = () => {
  const resources = [
    {
      icon: <FaMapMarkerAlt className="text-primary text-3xl" />,
      title: "Drop-off Locations",
      content: "Abeokuta • Ijebu-Ode • Sango Ota • Ota • Ifo",
      delay: "animate-fadeIn"
    },
    {
      icon: <FaEnvelope className="text-primary text-3xl" />,
      title: "Support Contact",
      content: (
        <a 
          href="mailto:Olatunjiayokanmii@gmail.com" 
          className="text-accent hover:underline transition font-medium"
        >
          Olatunjiayokanmii@gmail.com
        </a>
      ),
      delay: "animate-fadeIn delay-200"
    },
    {
      icon: <FaGithub className="text-primary text-3xl" />,
      title: "Source Code",
      content: (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">EcoCycle is 100% Open Source</p>
          <a 
            href="https://github.com/Ayokanmii/EcoCycle" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:underline transition font-medium flex items-center gap-1"
          >
            <FaCodeBranch /> github.com/Ayokanmii/EcoCycle
          </a>
        </div>
      ),
      delay: "animate-fadeIn delay-400"
    },
    {
      icon: <FaLinkedin className="text-primary text-3xl" />,
      title: "Connect with Developer",
      content: (
        <a 
          href="https://www.linkedin.com/in/olatunjiayokanmi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-accent hover:underline transition font-medium"
        >
          linkedin.com/in/olatunjiayokanmi
        </a>
      ),
      delay: "animate-fadeIn delay-600"
    },
    {
      icon: <FaLightbulb className="text-primary text-3xl" />,
      title: "Pro Tip",
      content: (
        <span>
          Sell plastics for <strong className="text-accent">₦30/kg</strong> to registered partners. 
          <span className="block text-sm text-green-600 mt-1">Earn more with consistent recycling!</span>
        </span>
      ),
      delay: "animate-fadeIn delay-800"
    },
    {
      icon: <FaDownload className="text-primary text-3xl" />,
      title: "Install EcoCycle",
      content: (
        <button 
          onClick={() => {
            if (window.deferredPrompt) {
              window.deferredPrompt.prompt();
            } else {
              alert("Use Chrome/Edge → Menu → 'Add to Home Screen'");
            }
          }}
          className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-accent transition shadow-md hover:shadow-lg text-sm font-medium"
        >
          Add to Home Screen (PWA)
        </button>
      ),
      delay: "animate-fadeIn delay-1000"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-primary mb-6 animate-fadeIn">
            Project Resources
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fadeIn delay-300">
            Everything you need to explore, contribute, and join the EcoCycle movement.
          </p>
        </div>

        {/* Resource Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {resources.map((item, i) => (
            <div
              key={i}
              className={`${item.delay} bg-white dark:bg-gray-800 p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-start space-x-5 border border-gray-100 dark:border-gray-700 hover-lift group`}
            >
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {item.title}
                </h3>
                <div className="text-base text-gray-600 dark:text-gray-300">
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Badge */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Built with <span className="text-red-600">♥</span> for a cleaner Ogun State
          </p>
        </div>

        <BackToHome />
      </div>
    </section>
  );
};

export default Resources;