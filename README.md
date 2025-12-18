# 💧 Optimeter: Smart Utility Monitoring System

**Optimeter** is a comprehensive dashboard for monitoring household resources—Water, Gas, and Electricity. Designed to integrate with **ESP32-CAM** devices, it uses computer vision to digitize traditional analog meter readings and track consumption across multiple properties.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-F7DF1E?style=for-the-badge&logo=lucide&logoColor=black)

---

## 🌟 Key Features

### 🏢 Multi-Property Management
* **Add Multiple Locations:** Manage your home, office, and country house under one account.
* **Independent Device Setup:** Each apartment can have its own set of ESP32-CAM devices for Water, Gas, or Electricity.
* **Property Switching:** Easily switch between different objects via the building selector in the header.

### 📊 Advanced Analytics
* **Real-time Consumption:** View current readings and monthly usage at a glance.
* **Visual Data:** Interactive Line and Bar charts (via Recharts) showing trends over time.
* **Dynamic Cost Calculation:** Automatic bill estimation based on custom tariffs set in the user settings.

### 📸 ESP32-CAM & Settings
* **Snapshot Frequency:** Configure how often the camera takes a photo (12h, 24h, weekly, etc.).
* **Evidence View:** Browse the history of actual photos taken by the camera to verify AI-recognized digits.
* **Unit Pricing:** Set individual rates for Water ($/m³), Electricity ($/kW), and Gas ($/m³).

### ⚙️ User Experience
* **Localization:** Seamlessly toggle between **Ukrainian 🇺🇦** and **English 🇬🇧**.
* **Dark Mode:** Full support for dark and light themes for comfortable viewing.
* **Responsive Design:** Optimized for mobile, tablet, and desktop viewing.

---

## 🛠 Tech Stack

* **Frontend:** React.js
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **Icons:** Lucide React
* **Hardware Compatibility:** ESP32 / ESP32-CAM (Logic for camera capture triggers included)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/optimeter.git](https://github.com/your-username/optimeter.git)
    cd optimeter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm start
    ```

---

## 🖥 How to Use

1.  **Login:** Use the demo credentials (`demo` / `demo`) or create a new account.
2.  **Create Apartment:** Use the building icon in the header to add your first property (e.g., "Kyiv Apartment").
3.  **Connect Device:** Click **"+ Add Device"** and enter the serial code.
    * `WAT-123` (Water)
    * `EL-123` (Electricity)
    * `GAS-123` (Gas)
4.  **Configure:** Go to the **Settings** tab to change language, adjust your local utility tariffs, and set camera frequency.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

**Optimeter** — *Take control of your resources, one click at a time.*