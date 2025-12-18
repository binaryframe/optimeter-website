💧 Optimeter: Smart Utility Monitoring System
Optimeter is a comprehensive dashboard for monitoring household resources - water, gas, and electricity. Designed to work with ESP32-CAM devices, it uses computer vision to digitize traditional analog meter readings and track consumption across multiple properties.

🌟 Key Features
🏢 Multi-Property Management
Add Multiple Locations: Manage your home, office, and country house under one account.

Independent Device Setup: Each apartment can have its own set of ESP32-CAM devices for water, gas, or electricity.

📊 Advanced Analytics
Real-time Consumption: View current readings and monthly usage.

Visual Data: Interactive Line and Bar charts (via Recharts) showing trends over time.

Cost Calculation: Automatic bill estimation based on custom tariffs set in the settings.

📸 ESP32-CAM Integration
Snapshot Frequency: Configure how often the camera takes a photo (12h, 24h, weekly, etc.).

Evidence View: Browse the history of actual photos taken by the camera to verify AI-recognized digits.

⚙️ User Experience
Localization: Seamlessly toggle between Ukrainian 🇺🇦 and English.

Dark Mode: Full support for dark and light themes.

Responsive Design: Optimized for mobile, tablet, and desktop viewing.

🛠 Tech Stack
Frontend: React.js

Styling: Tailwind CSS

Charts: Recharts

Icons: Lucide React

Hardware Compatibility: ESP32 / ESP32-CAM (Firmware not included in this repo)


🖥 How to use
Login: Use the demo credentials (if applicable) or create a new account.

Add properties: Use the building icon in the header to several properties.

Connect Device: Click "+ Add Device" and enter the serial code (e.g., WAT-123 for Water, EL-123 for Electricity).

Configure Tariffs: Go to the Settings tab to enter the price per unit ($/m³ or $/kW) and set how frequent camera will take photos.

📝 Configuration (Serial Codes)
For the demo simulation, the system recognizes the following serial prefixes:

WAT-... for Water Meters

EL-... for Electricity Meters

GAS-... for Gas Meters

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

Optimeter — Take control of your resources, one click at a time.