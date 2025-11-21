<div align="center">
<img width="1200" height="475" alt="Digital Pharmacy Platform Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Digital Pharmacy Platform

A comprehensive web-based digital pharmacy solution designed to modernize the pharmacy experience. This platform integrates e-commerce functionality with healthcare services, featuring prescription management, an AI-powered health assistant, and direct communication with pharmacists.

## 🚀 Key Features

*   **Product Browsing & E-commerce**: Browse a catalog of medicines and health products, view details, manage a shopping cart, and proceed to checkout.
*   **Prescription Management**: Upload prescriptions, view status updates (simulated verification process), and manage prescription history.
*   **AI Health Assistant**: Interactive chat powered by **Google Gemini** to answer general health and medication questions.
*   **Pharmacist Messaging**: Secure channel for users to ask non-emergency questions to licensed pharmacists.
*   **Order Tracking**: Real-time updates on order status (Processing, Paid, Shipped, Delivered).
*   **User Accounts**: Registration and login functionality with persistent user profiles (stored locally).
*   **Admin Dashboard**: Dedicated interface for administrators to manage the platform.
*   **Inventory Management**: Tools for adding, removing, and updating product stock.
*   **Responsive Design**: Modern UI built with Tailwind CSS for a seamless experience across devices.

## 🛠️ Tech Stack

*   **Frontend Framework**: React 19
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (via CDN)
*   **AI Integration**: Google Generative AI SDK (Gemini)
*   **State Management**: React Context / Local State
*   **Persistence**: Browser LocalStorage

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **npm** (comes with Node.js)
*   A **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd digital-pharmacy-platform
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```
    Open your browser and visit `http://localhost:3000` (or the port shown in the terminal).

## 📖 Usage Guide

### User Registration & Login
*   **New Users**: Click "Login" -> "Register" to create an account. Data is stored in your browser's local storage.
*   **Admin Access**: The first user registered is assigned the 'Admin' role automatically. Subsequent users are standard 'Users'.

### Main Flows
*   **Shopping**: Navigate to "Products", add items to cart, and checkout. You can view your order history in "My Account" > "Order History".
*   **Prescriptions**: Go to "Prescriptions" to upload a file. The system simulates an OCR and verification process (approx. 5-8 seconds).
*   **AI Assistant**: Click "AI Assistant" to chat with the Gemini-powered bot about health topics.

### Admin Dashboard
If logged in as an admin, you can access the Admin Dashboard to:
*   View platform statistics.
*   Manage inventory (Add/Remove products).
*   (Future features) Manage users and orders.

## 📂 Project Structure

```
/
├── components/         # React components (UI, Features, Layouts)
├── services/           # API services (Gemini AI)
├── App.tsx             # Main application component & Routing logic
├── types.ts            # TypeScript interfaces and types
├── index.html          # Entry HTML (Tailwind config here)
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies and scripts
```

## ⚠️ Note

This project is a demonstration platform. 
*   **Data Persistence**: All data (users, orders, products) is stored in `localStorage`. Clearing your browser cache will reset the app.
*   **Medical Advice**: The AI Assistant is for informational purposes only and does not replace professional medical advice.

