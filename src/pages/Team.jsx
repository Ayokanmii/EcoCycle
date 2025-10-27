// src/pages/Team.jsx
import React from "react";
import { FaCode, FaUser, FaClipboardList, FaReact, FaPython, FaServer } from "react-icons/fa";
import BackToHome from "../components/BackToHome";

const teamMembers = [
  {
    name: "Damilola",
    role: "Full-Stack Web Developer",
    icon: <FaCode className="text-primary text-4xl mb-4" />,
    bio: "Architected and developed the entire EcoCycle platform. Built a responsive React frontend with real-time AI object detection, speech synthesis, and interactive mapping. Designed a scalable FastAPI backend powered by Groq Llama 3 for intelligent waste classification. Integrated Firebase for authentication, real-time wallet tracking, and live dump reporting. Deployed on Vercel and Render with CI/CD.",
    tech: [
      { icon: <FaReact className="text-cyan-500" />, name: "React" },
      { icon: <FaPython className="text-yellow-500" />, name: "FastAPI" },
      { icon: <FaServer className="text-green-600" />, name: "Firebase" },
    ],
    delay: "animate-fadeIn"
  },
  {
    name: "Enoch",
    role: "Team Lead & AI Specialist",
    icon: <FaUser className="text-primary text-4xl mb-4" />,
    bio: "Leads the team with strategic vision and technical oversight. Designed AI-powered waste scanning using TensorFlow.js and Groq Llama 3. Ensures system accuracy, performance, and scalability. Reviews code, enhances features, and drives innovation in machine learning for environmental impact.",
    tech: [
      { icon: <FaCode className="text-blue-600" />, name: "ML/AI" },
      { icon: <FaServer className="text-purple-600" />, name: "Groq" },
    ],
    delay: "animate-fadeIn delay-300"
  },
  {
    name: "Precious",
    role: "Proposal & Documentation Lead",
    icon: <FaClipboardList className="text-primary text-4xl mb-4" />,
    bio: "Authors compelling project proposals, technical documentation, and pitch materials. Crafts investor-ready presentations and ensures all deliverables meet competition standards. Manages timelines, stakeholder communication, and project narrative.",
    tech: [
      { icon: <FaClipboardList className="text-orange-600" />, name: "Docs" },
    ],
    delay: "animate-fadeIn delay-600"
  },
];

const Team = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 animate-fadeIn">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fadeIn delay-300">
            A dedicated team combining technical excellence, AI innovation, and strategic vision to solve waste management in Ogun State.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className={`${member.delay} bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700 hover:scale-105 hover-lift`}
            >
              {/* Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 shadow-lg">
                {member.icon}
              </div>

              {/* Name & Role */}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {member.name}
              </h2>
              <h3 className="text-lg font-semibold text-accent mb-6">
                {member.role}
              </h3>

              {/* Bio */}
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6 flex-grow">
                {member.bio}
              </p>

              {/* Tech Stack */}
              <div className="flex gap-3 justify-center">
                {member.tech.map((t, j) => (
                  <div
                    key={j}
                    className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <BackToHome />
      </div>
    </section>
  );
};

export default Team;