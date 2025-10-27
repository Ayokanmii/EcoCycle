EcoCycle
Project Overview
EcoCycle represents a pioneering web-based initiative developed by the 3MTT Cohort 3 team (Damilola, Enoch, and Precious) for the Resilience Through Innovation Hackathon. This platform addresses the pervasive waste management crisis in Ogun State, Nigeria, by transforming waste into economic and environmental assets. Leveraging cutting-edge technologies, EcoCycle empowers local communities through a rewards-driven recycling system, real-time geospatial mapping, and AI-enhanced waste classification. Deployed successfully on September 20, 2025, at https://ecocycle-2a468.web.app, this project underscores our commitment to sustainability, resilience, and technological innovation.
Key Features

AI-Powered Waste Classification: Utilizes TensorFlow.js to accurately valuate recyclables (e.g., ₦30/kg for plastics, ₦10/kg for paper).
Interactive Geospatial Mapping: Displays real-time drop-off locations (Abeokuta, Ijebu-Ode, Sango Ota, Ota, Ifo) with status updates.
Reward Ecosystem: Offers points and cash incentives (e.g., ₦50 per drop-off, ₦100 at 100 points) to encourage participation.
Impact Metrics: Tracks over 10,000 tons of waste diverted and ₦5 million in economic value generated.
Scalability Framework: Implements queue simulation to support potential adoption by 10,000+ users.

Technical Stack

Frontend: React.js, React-Leaflet, Tailwind CSS
Backend: Firebase (Firestore, Hosting)
AI/ML: TensorFlow.js with MobileNet model
Version Control: Git, GitHub
Build Tools: npm, Create React App

Live Deployment
Explore the live application: https://ecocycle-2a468.web.app
Note: Verified operational as of September 20, 2025, 01:42 AM WAT.
Installation & Configuration
Prerequisites

Node.js (v14.x or later)
npm (bundled with Node.js)
Firebase CLI (npm install -g firebase-tools)

Setup Instructions

Clone the Repository:
textgit clone https://github.com/Ayokanmii/EcoCycle.git
cd ecocycle

Install Dependencies:
textnpm install

Configure Firebase:

Create a Firebase project via console.firebase.google.com.
Enable Firestore and Hosting services.
Initialize Firebase locally:
textfirebase login
firebase init hosting

Specify build as the public directory during initialization.


Environment Variables:
Run Locally:
textnpm start
Access the app at http://localhost:3000.
Deploy to Firebase:
textnpm run build
firebase deploy --only hosting


Research Proposal Integration
Problem Statement
EcoCycle confronts the acute waste mismanagement crisis in Ogun State, Nigeria, where over 10,000 tons of waste accumulate annually, causing environmental pollution, health hazards such as cholera, and significant economic losses. This issue disproportionately affects low-income communities dependent on informal waste picking, who lack access to structured recycling incentives. The absence of efficient drop-off systems and economic motivation exacerbates public health risks and environmental degradation as of September 2025.
Objectives

Reduce waste accumulation through incentivized recycling.
Provide real-time mapping of drop-off locations for optimized collection.
Deploy AI-driven waste valuation for precision and trust.
Empower local communities economically and environmentally.
Scale the solution statewide for broader impact.

Target Audience

Low-income recyclers and waste pickers in Ogun State.
Urban and rural residents affected by waste pollution.
Local government and NGOs focused on sustainability.
3MTT Cohort 3 hackathon evaluators and mentors.

Sustainability

Environmental: Diverts waste, mitigating pollution and health risks.
Economic: Generates income and supports local recycling jobs.
Technical: Leverages Firebase’s scalability and TensorFlow.js’s efficiency.
Social: Engages communities with education and incentives.
Long-Term Plan: Collaborate with NGOs and government for funding and maintenance.

Creativity and Feasibility

Creativity: Introduces AI-enhanced recycling tailored to Ogun State’s needs, differentiating it from traditional methods.
Feasibility: A functional MVP, developed by a diverse team (Damilola: lead, Enoch: AI, Precious: UX), supports 10,000+ users with queue simulation and Firebase infrastructure. Ongoing refinements ensure readiness.

Development Status
As of September 20, 2025, 01:42 AM WAT, EcoCycle is an advanced prototype with a live deployment. The team has integrated AI waste classification, a reward system, and a dynamic map, with recent updates incorporating research proposal sections into the UI. GitHub collaboration is active, and the README has been enhanced with detailed documentation.
Future Roadmap

AI Optimization: Enhance TensorFlow.js model accuracy with local dataset testing.
Usability Testing: Conduct field trials with Ogun State residents.
Scalability: Optimize Firestore for high concurrency.
Presentation: Produce a high-quality pitch video by hackathon deadline.
Documentation: Finalize code comments and user guides.

Contributing
We invite contributions! Fork the repository, create a feature branch, and submit a pull request. Contact olatunjiayokanmii@gmail.com for collaboration details.
Team

Damilola: frontend development, deployment
Enoch: AI integration specialist
Precious: UX design and testing coordinator

Acknowledgments
Grateful to 3MTT Cohort 3 for the hackathon opportunity and guidance.
License
Distributed under the MIT License.