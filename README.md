<h1 align="center"> OceanPals </h1> <br>
<p align="center">
  <a href="">
    <img alt="OceanPals" title="OceanPals" src="https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/kjjc9yuvhhmybsamc0rp" width="200">
  </a>
</p>

<p align="center">
  Beachcombing with CRUD Dashboard and Google Maps Integrated Live Map
</p>

## Table of Contents
1. [Project Overview](#project-overview)
2. [Mockup Screenshot](#mockup-screenshot)
3. [Technology and Infrastructure](#technology-and-infrastructure)
4. [Prerequisite](#prerequisite)
5. [How to Run Project Locally](#how-to-run-project-locally)
6. [Owner](#owner)

## Project Overview

### Project Name
OceanPals

### Explanation
OceanPals is an interactive web platform designed to raise awareness about environmental cleanliness, with a special focus on keeping beaches clean. Through OceanPals, users are encouraged to participate in beachcombing—the activity of collecting litter and debris from beaches to help protect marine life and maintain a clean coastal environment. As users log their beachcombing efforts, they earn points that can be accumulated and later redeemed for exclusive rewards. By combining environmental action with a gamified experience, OceanPals motivates individuals to take meaningful steps toward sustainability while making beach cleaning an engaging and rewarding activity. Join OceanPals and be part of the movement for cleaner, healthier oceans! 🌊♻️

## Mockup Screenshot

### User Side Interface

* User Page - Login and Register

<p align="center">
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/m0ogzim7dokkf1wdiqs1" width=700>
</p>

* Home Page - Dashboard of OceanPals

<p align="center">
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/pjxdtwstel8awavpxjqn" width=700>
</p>

* Event Page - Live Maps of Active Events

<p align="center">
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/smoedo3mtknuy33jkqjq" width=700>
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/vmpgvlz9548zdlkaerb7" width=700>
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/aq7g7w1ey0frjuum7hcr" width=700>
</p>

* Recruitment Page - Volunteer of Becoming OceanPals Fellow

<p align="center">
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/femlhxbpnwow7zoqu64k" width=700>
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/bhyggo4fa1fs6hgzhttg" width=700>
</p>

* Training Page - Learning New Things about Environmental Cleaning

<p align="center">
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/ueq2gvvzqrf8duurfuir" width=700>
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/oizkg81lf4rpl0y9xoj3" width=700>
</p>

* Store Page - Redeem your Beachcombing Points with Merchandise

<p align="center">
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/r9vgekb0z32ru9ntuhll" width=700>
</p>

### Admin Side Interface

* Admin Dashboard Page - Overview the Current State Data of OceanPals

<p align="center">
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/kjtvcszz2vi5lovabg95" width=700>
</p>

* Forum Page - Brief Activity with Fellow Beachcombers

<p align="center">
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/yjo9ppolxff4h8pllqn1" width=700>
</p>

* CRUD Page - Sample CRUD for Managing Data

<p align="center">
  <img src = "https://res.cloudinary.com/dxcn5osfu/image/upload/f_auto,q_auto/v1/OceanPals/cgugnbytsynj4ja5grhh" width=700>
</p>

## Technology and Infrastructure

This project is built using modern web development tools and frameworks:

- **Frontend Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/) (Fast and modern frontend tooling)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) (Utility-first CSS framework for efficient UI development)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Serverless backend, authentication, and real-time database)
- **Programming Language**: TypeScript (Frontend)
- **Package Manager**: npm
- **Deployment**: [Vercel](https://vercel.com/) for frontend hosting

## Prerequisite

Before running this project, ensure the following tools are installed on your system:

1. **Node.js and npm:**
   - Install Node.js (version **16.x** or newer) which includes npm.  
     Download Node.js from [here](https://nodejs.org/).
   - Verify installation by running:

     ```bash
     node -v
     npm -v
     ```

2. **Git:**
   - Install Git to clone the repository from GitHub.  
     Download Git from [here](https://git-scm.com/).  
     Verify installation using:

     ```bash
     git --version
     ```

3. **Firebase CLI:**
   - Install Firebase CLI for managing Firebase services:

     ```bash
     npm install -g firebase-tools
     ```

   - Verify installation by running:

     ```bash
     firebase --version
     ```

4. **Code Editor:**
   - Install [Visual Studio Code (VS Code)](https://code.visualstudio.com/) or any editor of your choice.  
     Recommended VS Code extensions:
     - **ESLint**
     - **Prettier - Code formatter**
     - **TailwindCSS IntelliSense**
     - **Firebase Explorer**
     - **React Developer Tools**

5. **Browser:**
   - Use a modern browser like [Google Chrome](https://www.google.com/chrome/) or [Firefox](https://www.mozilla.org/).

6. **Environment Variables:**
   - Set up your Firebase project and obtain the necessary configuration.  
     Create a `.env` file in the root directory and add:

     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

     Replace `your_api_key`, `your_auth_domain`, etc., with your Firebase project details.

Once these prerequisites are installed and configured, you can proceed with setting up the project.

## How to Run Project Locally

Follow these steps to set up and run the project locally on your machine:

### Frontend (React + Vite)

#### 1. Clone the Repository
   - Clone the project from GitHub:

     ```bash
     git clone https://github.com/your-repo-name.git
     ```

   - Navigate to the project directory:

     ```bash
     cd your-project-name
     ```

#### 2. Install Dependencies
   - Install the required Node.js packages:

     ```bash
     npm install
     ```

#### 3. Set Up Environment Variables
   - Create a `.env` file in the root directory and add your Firebase configuration:

     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

   - Replace `your_api_key`, `your_auth_domain`, etc., with your Firebase project details.

#### 4. Start the Development Server
   - Run the following command to start the development server:

     ```bash
     npm run dev
     ```

   - By default, the application will run on `http://localhost:5173`.

---

### Firebase Setup (Backend & Database)

#### 1. Login to Firebase CLI
   - Ensure you are logged into Firebase:

     ```bash
     firebase login
     ```

#### 2. Initialize Firebase (If Not Already Set Up)
   - If this is your first time setting up Firebase for the project:

     ```bash
     firebase init
     ```

   - Follow the setup process:
     - Choose **Firestore** for the database.
     - Enable **Authentication** if required.
     - Select the appropriate Firebase project.

#### 3. Start Firebase Emulators (Optional for Local Testing)
   - If you want to test Firebase locally, run:

     ```bash
     firebase emulators:start
     ```

Once everything is set up, your project should be running locally. 🚀

---

### Deployment (Optional)
#### Frontend:
   - Deploy the frontend to [Vercel](https://vercel.com/).  
     Follow [these steps](https://vercel.com/docs).
     
---

## Owner

This Repository is created by:
- 2702211185 - Christopher Hardy Gunawan
- 2702265534 - Aurelia Tera Puspita
- 2702210680 - Stanic Dylan

<code> Let's Make Our World a Better Place ❤️‍🔥❤️‍🔥 </code>
