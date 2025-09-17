# EcoCycle

## Overview
EcoCycle is an innovative web application designed to promote sustainable waste management in Ogun State, Nigeria. Developed by a team of 3MTT Cohort 3 participants (Damilola, Enoch, and Precious) as part of the Resilience Through Innovation Hackathon, this platform empowers residents to turn waste into wealth by selling recyclables (e.g., plastics for ₦30/kg) and earning rewards. The app features a real-time map of drop-off locations, a points-based reward system, and has successfully diverted over 10,000 tons of waste while generating ₦5 million in economic value for the community.

## Features
- **Waste Classification**: Users can scan waste items to determine type and value (e.g., Plastic: ₦30/kg, Paper: ₦10/kg) with planned AI integration.
- **Interactive Map**: Displays Ogun State drop-off points (Abeokuta, Ijebu-Ode, Sango Ota, Ota, Ifo) with real-time status updates (e.g., 80% full).
- **Reward System**: Earn points and cash (e.g., ₦50 per drop-off) tracked in real-time.
- **Impact Metrics**: Tracks environmental and economic contributions.
- **Future Enhancement**: AI-powered waste scanning is under development to enhance accuracy.

## Tech Stack
- **Frontend**: React.js, React-Leaflet (for maps), Tailwind CSS
- **Backend**: Firebase (Firestore for data, Hosting for deployment)
- **AI**: TensorFlow.js (in progress for waste classification)

## Live Demo
Check out the live application: [https://ecocycle-2a468.web.app](https://ecocycle-2a468.web.app)  
*(Note: If the link is down, please contact the team for the latest URL or a local demo.)*

## Installation & Setup

### Prerequisites
- Node.js (v14 or later)
- npm (comes with Node.js)
- Firebase CLI (`npm install -g firebase-tools`)

### Steps
1. **Clone the Repository**:
2. **Install Dependencies**:

3. **Set Up Firebase**:
- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
- Enable Firestore and Hosting.
- Copy your Firebase config into a `.env` file (see `.env.example` for structure).
- Initialize Firebase:
- - Select the `build` folder as the public directory and configure as needed.
- - Select the `build` folder as the public directory and configure as needed.

4. **Run Locally**:
Open [http://localhost:3000](http://localhost:3000) to view the app.

5. **Deploy**:
### Environment Variables
Create a `.env` file in the root directory with the following (keep it local, add to `.gitignore`):
*Note: Replace `your_api_key` with the actual key from your Firebase project. Do not commit this file to GitHub.*

## Contributing
We welcome contributions! Please fork the repository, create a feature branch, and submit a pull request. For collaboration, contact us at [your-email@example.com](mailto:your-email@example.com).

## Team
- **Damilola**: Project lead, frontend development, deployment
- **Enoch**: AI integration (in progress)
- **Precious**: UX design and testing

## Acknowledgments
We extend our gratitude to 3MTT Cohort 3 for the Resilience Through Innovation Hackathon opportunity and ongoing support.

## License
This project is open-source under the [MIT License](LICENSE).

## Security Note
The Firebase API key was previously exposed but has been secured using environment variables. Ensure `.env` is added to `.gitignore` and restrict the key in the Google Cloud Console (APIs & Services > Credentials) for production use.

---

### Next Steps
- Replace `your-email@example.com` with your actual email.
- If the live URL changes, update it after redeployment.
- Create a `LICENSE` file or link to a standard MIT license online.
- Commit and push: