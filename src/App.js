import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Droplet, LogOut, Calendar, TrendingUp, TrendingDown, Sun, Moon,
    Zap, Flame, Image as ImageIcon, X, Plus, QrCode, Smartphone,
    Settings, Building, Globe, Camera, DollarSign, Check
} from 'lucide-react';

// --- Translations / Переклади ---
const TRANSLATIONS = {
    ua: {
        welcome: "Привіт",
        welcomeBack: "З поверненням!",
        createAccount: "Створіть свій аккаунт",
        name: "Ім'я",
        email: "Email",
        password: "Пароль",
        login: "Увійти",
        register: "Зареєструватися",
        or: "або",
        noAccount: "Немає аккаунту? Зареєструватися",
        hasAccount: "Вже є аккаунт? Увійти",
        addDevice: "Додати пристрій",
        logout: "Вийти",
        water: "Вода",
        electricity: "Електроенергія",
        gas: "Газ",
        settings: "Налаштування",
        notConnected: "Optimeter не підключений",
        connectPrompt: "Для початку відстеження споживання, введіть серійний код вашого пристрою.",
        connectBtn: "Підключити",
        currentReading: "Поточні показання",
        thisMonth: "Цього місяця",
        avgUsage: "Середнє споживання",
        monthChange: "Зміна за місяць",
        used: "використано",
        perMonth: "/місяць",
        fromLast: "від минулого",
        chartTitle: "Графік показань",
        barTitle: "Споживання по місяцях",
        totalReading: "Загальні показання",
        consumption: "Споживання",
        tableTitle: "Статистика по місяцях",
        month: "Місяць",
        date: "Дата",
        cost: "Вартість",
        photo: "Фото",
        viewPhoto: "Переглянути фото",
        photoModalTitle: "Фото лічильника",
        digits: "Розпізнані цифри",
        captured: "Дата фіксації",
        addDeviceTitle: "Додати пристрій",
        serialLabel: "Серійний номер (S/N)",
        cancel: "Скасувати",
        connect: "Підключити",
        apartments: "Мої об'єкти",
        addApartment: "Додати квартиру/дім",
        aptName: "Назва об'єкту",
        aptAddress: "Адреса (необов'язково)",
        create: "Створити",
        language: "Мова інтерфейсу",
        rates: "Тарифи та Вартість",
        rateWater: "Тариф на воду (грн/м³)",
        rateElec: "Тариф на світло (грн/кВт)",
        rateGas: "Тариф на газ (грн/м³)",
        cameraSettings: "Налаштування камери",
        frequency: "Частота знімків",
        freq12: "Кожні 12 годин",
        freq24: "Раз на добу",
        freqWeek: "Раз на тиждень",
        freqMonth: "Раз на місяць",
        save: "Зберегти налаштування",
        saved: "Збережено!",
        deviceSuccess: "Пристрій успішно підключено!",
        deviceError: "Невірний формат коду (Спробуйте WAT-..., EL-..., GAS-...)",
        enterSerial: "Введіть серійний код"
    },
    en: {
        welcome: "Hello",
        welcomeBack: "Welcome Back!",
        createAccount: "Create your account",
        name: "Name",
        email: "Email",
        password: "Password",
        login: "Log In",
        register: "Sign Up",
        or: "or",
        noAccount: "No account? Sign up",
        hasAccount: "Already have an account? Log in",
        addDevice: "Add Device",
        logout: "Log Out",
        water: "Water",
        electricity: "Electricity",
        gas: "Gas",
        settings: "Settings",
        notConnected: "Optimeter not connected",
        connectPrompt: "To start tracking consumption, enter your device serial code.",
        connectBtn: "Connect",
        currentReading: "Current Reading",
        thisMonth: "This Month",
        avgUsage: "Average Usage",
        monthChange: "Monthly Change",
        used: "used",
        perMonth: "/mo",
        fromLast: "vs last month",
        chartTitle: "Reading Chart",
        barTitle: "Monthly Consumption",
        totalReading: "Total Readings",
        consumption: "Consumption",
        tableTitle: "Monthly Statistics",
        month: "Month",
        date: "Date",
        cost: "Cost",
        photo: "Photo",
        viewPhoto: "View Photo",
        photoModalTitle: "Meter Photo",
        digits: "Recognized Digits",
        captured: "Captured At",
        addDeviceTitle: "Add Device",
        serialLabel: "Serial Number (S/N)",
        cancel: "Cancel",
        connect: "Connect",
        apartments: "My Properties",
        addApartment: "Add Property",
        aptName: "Property Name",
        aptAddress: "Address (Optional)",
        create: "Create",
        language: "Interface Language",
        rates: "Rates & Pricing",
        rateWater: "Water Rate ($/m³)",
        rateElec: "Electricity Rate ($/kW)",
        rateGas: "Gas Rate ($/m³)",
        cameraSettings: "Camera Settings",
        frequency: "Snapshot Frequency",
        freq12: "Every 12 hours",
        freq24: "Once a day",
        freqWeek: "Once a week",
        freqMonth: "Once a month",
        save: "Save Settings",
        saved: "Saved!",
        deviceSuccess: "Device connected successfully!",
        deviceError: "Invalid code format (Try WAT-..., EL-..., GAS-...)",
        enterSerial: "Enter serial code"
    }
};

// --- Test Data Generator ---
const generateTestData = (utilityType, customRate = null) => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const currentMonth = new Date().getMonth();
    const data = [];

    let cumulative, usageRange, defaultCost;

    switch(utilityType) {
        case 'water':
            cumulative = 1250;
            usageRange = [8, 23];
            defaultCost = 2.5;
            break;
        case 'electricity':
            cumulative = 5420;
            usageRange = [150, 350];
            defaultCost = 1.68;
            break;
        case 'gas':
            cumulative = 890;
            usageRange = [20, 80];
            defaultCost = 7.96;
            break;
        default:
            cumulative = 0;
            usageRange = [0, 0];
            defaultCost = 0;
    }

    const costPerUnit = customRate !== null ? parseFloat(customRate) : defaultCost;

    for (let i = 0; i <= currentMonth; i++) {
        const usage = Math.floor(Math.random() * (usageRange[1] - usageRange[0])) + usageRange[0];
        cumulative += usage;
        const photoUrl = `https://placehold.co/600x400/2563eb/FFF?text=${utilityType.toUpperCase()}+${cumulative}`;

        data.push({
            month: months[i],
            reading: cumulative,
            usage: usage,
            cost: (usage * costPerUnit).toFixed(2),
            date: new Date(2025, i, Math.floor(Math.random() * 28) + 1).toISOString(),
            photoUrl: photoUrl
        });
    }
    return data;
};

const WaterMeterDashboard = () => {
    // --- Global Config State ---
    const [language, setLanguage] = useState('ua'); // 'ua' | 'en'
    const t = TRANSLATIONS[language]; // Shortcut for current translation

    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    // Apartment & Device State (Multi-tenant structure)
    // Structure: [{ id: 1, name: 'Home', devices: {water: true...} }]
    const [apartments, setApartments] = useState([]);
    const [activeApartmentId, setActiveApartmentId] = useState(null);
    const [showAptModal, setShowAptModal] = useState(false);
    const [newAptData, setNewAptData] = useState({ name: '', address: '' });

    // Global Settings State
    const [globalSettings, setGlobalSettings] = useState({
        rates: { water: 2.5, electricity: 1.68, gas: 7.96 },
        cameraFrequency: '24h'
    });
    const [saveMessage, setSaveMessage] = useState('');

    // Data State (Calculated on fly usually, but stored for demo)
    const [waterData, setWaterData] = useState([]);
    const [electricityData, setElectricityData] = useState([]);
    const [gasData, setGasData] = useState([]);

    // Modals & UI
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [serialCode, setSerialCode] = useState('');
    const [deviceMessage, setDeviceMessage] = useState('');
    const [activeUtility, setActiveUtility] = useState('water'); // 'water' | 'electricity' | 'gas' | 'settings'
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    // --- Initialization ---
    useEffect(() => {
        const savedUser = sessionStorage.getItem('waterMeterUser');
        const savedTheme = sessionStorage.getItem('darkMode');
        const savedLang = sessionStorage.getItem('language');
        const savedApts = sessionStorage.getItem('apartments');
        const savedSettings = sessionStorage.getItem('globalSettings');

        if (savedUser) {
            setFormData(prev => ({ ...prev, name: savedUser }));
            setIsLoggedIn(true);
        }
        if (savedTheme === 'true') setDarkMode(true);
        if (savedLang) setLanguage(savedLang);
        if (savedSettings) setGlobalSettings(JSON.parse(savedSettings));

        if (savedApts) {
            const parsedApts = JSON.parse(savedApts);
            setApartments(parsedApts);
            if (parsedApts.length > 0) setActiveApartmentId(parsedApts[0].id);
        } else {
            // Default empty state handles in finishAuth
        }
    }, []);

    // Load data whenever settings (rates) or active apartment changes
    useEffect(() => {
        if (isLoggedIn && activeApartmentId) {
            setWaterData(generateTestData('water', globalSettings.rates.water));
            setElectricityData(generateTestData('electricity', globalSettings.rates.electricity));
            setGasData(generateTestData('gas', globalSettings.rates.gas));
        }
    }, [isLoggedIn, activeApartmentId, globalSettings.rates]);

    const activeApartment = apartments.find(a => a.id === activeApartmentId) || {};
    const connectedDevices = activeApartment.devices || { water: false, electricity: false, gas: false };

    // --- Handlers ---

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        sessionStorage.setItem('language', lang);
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!formData.email || !formData.password || (authMode === 'register' && !formData.name)) {
            setError(language === 'ua' ? 'Будь ласка, заповніть всі поля' : 'Please fill all fields');
            return;
        }
        if (authMode === 'login') {
            if ((formData.email === 'demo' && formData.password === 'demo') || formData.email.includes('@')) {
                const userName = formData.name || formData.email.split('@')[0] || 'User';
                finishAuth(userName);
            } else {
                setError(language === 'ua' ? 'Невірний логін або пароль' : 'Invalid login or password');
            }
        } else {
            if (formData.email.includes('@') && formData.password.length >= 4) {
                finishAuth(formData.name);
            } else {
                setError(language === 'ua' ? 'Введіть коректний email та пароль' : 'Invalid email or password');
            }
        }
    };

    const finishAuth = (userName) => {
        sessionStorage.setItem('waterMeterUser', userName);
        setFormData(prev => ({ ...prev, name: userName }));
        setIsLoggedIn(true);

        // Init default apartment if none
        if (apartments.length === 0) {
            const defaultApt = {
                id: Date.now(),
                name: language === 'ua' ? 'Мій Дім' : 'My Home',
                address: '',
                devices: { water: false, electricity: false, gas: false }
            };
            
            // Demo user gets devices
            if (formData.email === 'demo') {
                defaultApt.devices = { water: true, electricity: true, gas: false };
            }

            const newApts = [defaultApt];
            setApartments(newApts);
            setActiveApartmentId(defaultApt.id);
            sessionStorage.setItem('apartments', JSON.stringify(newApts));
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('waterMeterUser');
        setIsLoggedIn(false);
        setFormData({ name: '', email: '', password: '' });
    };

    const handleConnectDevice = (e) => {
        e.preventDefault();
        setDeviceMessage('');
        if (!serialCode) {
            setDeviceMessage({ type: 'error', text: t.enterSerial });
            return;
        }

        const code = serialCode.toUpperCase();
        let newDeviceType = null;

        if (code.startsWith('WAT')) newDeviceType = 'water';
        else if (code.startsWith('EL')) newDeviceType = 'electricity';
        else if (code.startsWith('GAS')) newDeviceType = 'gas';

        if (newDeviceType && activeApartmentId) {
            const updatedApartments = apartments.map(apt => {
                if (apt.id === activeApartmentId) {
                    return { ...apt, devices: { ...apt.devices, [newDeviceType]: true } };
                }
                return apt;
            });
            
            setApartments(updatedApartments);
            sessionStorage.setItem('apartments', JSON.stringify(updatedApartments));
            setActiveUtility(newDeviceType);
            
            setDeviceMessage({ type: 'success', text: t.deviceSuccess });
            setTimeout(() => {
                setShowDeviceModal(false);
                setSerialCode('');
                setDeviceMessage('');
            }, 1500);
        } else {
            setDeviceMessage({ type: 'error', text: t.deviceError });
        }
    };

    const handleCreateApartment = (e) => {
        e.preventDefault();
        if (!newAptData.name) return;

        const newApt = {
            id: Date.now(),
            name: newAptData.name,
            address: newAptData.address,
            devices: { water: false, electricity: false, gas: false }
        };

        const updatedList = [...apartments, newApt];
        setApartments(updatedList);
        sessionStorage.setItem('apartments', JSON.stringify(updatedList));
        setActiveApartmentId(newApt.id);
        setShowAptModal(false);
        setNewAptData({ name: '', address: '' });
        setActiveUtility('water');
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        sessionStorage.setItem('globalSettings', JSON.stringify(globalSettings));
        setSaveMessage(t.saved);
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        sessionStorage.setItem('darkMode', newMode.toString());
    };

    const getUtilityConfig = (utility) => {
        const configs = {
            water: {
                name: t.water,
                icon: Droplet,
                unit: 'м³',
                color: darkMode ? 'text-blue-400' : 'text-blue-500',
                bgColor: darkMode ? 'bg-blue-600' : 'bg-blue-500',
                chartColor: darkMode ? '#60a5fa' : '#3b82f6',
                barColor: darkMode ? '#22d3ee' : '#06b6d4'
            },
            electricity: {
                name: t.electricity,
                icon: Zap,
                unit: 'кВт·год',
                color: darkMode ? 'text-yellow-400' : 'text-yellow-500',
                bgColor: darkMode ? 'bg-yellow-600' : 'bg-yellow-500',
                chartColor: darkMode ? '#fbbf24' : '#f59e0b',
                barColor: darkMode ? '#fde047' : '#eab308'
            },
            gas: {
                name: t.gas,
                icon: Flame,
                unit: 'м³',
                color: darkMode ? 'text-orange-400' : 'text-orange-500',
                bgColor: darkMode ? 'bg-orange-600' : 'bg-orange-500',
                chartColor: darkMode ? '#fb923c' : '#f97316',
                barColor: darkMode ? '#fdba74' : '#fb923c'
            },
            settings: {
                name: t.settings,
                icon: Settings,
                unit: '',
                color: 'text-gray-500',
                bgColor: 'bg-gray-500',
                chartColor: '#888',
                barColor: '#888'
            }
        };
        return configs[utility];
    };

    const getCurrentData = () => {
        switch(activeUtility) {
            case 'water': return waterData;
            case 'electricity': return electricityData;
            case 'gas': return gasData;
            default: return [];
        }
    };

    const calculateStats = () => {
        const meterData = getCurrentData();
        if (meterData.length === 0) return { total: 0, avg: 0, current: 0, change: 0 };

        const totalUsage = meterData.reduce((sum, item) => sum + item.usage, 0);
        const avgUsage = (totalUsage / meterData.length).toFixed(1);
        const currentReading = meterData[meterData.length - 1].reading;
        const lastMonth = meterData.length > 1 ? meterData[meterData.length - 2].usage : 0;
        const thisMonth = meterData[meterData.length - 1].usage;
        const change = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1) : 0;

        return { total: totalUsage, avg: avgUsage, current: currentReading, change };
    };

    // --- RENDER: LOGIN ---
    if (!isLoggedIn) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
                darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-cyan-100'
            }`}>
                <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-md transition-colors duration-300 relative ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                     {/* Theme & Language Toggles on Login */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                         <button onClick={() => handleLanguageChange(language === 'ua' ? 'en' : 'ua')} className={`px-2 py-1 rounded text-xs font-bold ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                             {language.toUpperCase()}
                         </button>
                        <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}>
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                        <div className={`p-4 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                            <Droplet className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className={`text-3xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Optimeter
                    </h1>
                    <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {authMode === 'login' ? t.welcomeBack : t.createAccount}
                    </p>

                    <form onSubmit={handleAuthSubmit}>
                        {authMode === 'register' && (
                            <div className="mb-4">
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t.name}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t.email}</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                        </div>
                        <div className="mb-6">
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t.password}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                        </div>
                        {error && <div className="mb-4 p-3 rounded-lg text-sm bg-red-100 text-red-600">{error}</div>}
                        <button type="submit" className={`w-full font-semibold py-3 rounded-lg mb-3 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                            {authMode === 'login' ? t.login : t.register}
                        </button>
                    </form>
                    <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className={`w-full text-sm font-semibold text-center hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {authMode === 'login' ? t.noAccount : t.hasAccount}
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER: DASHBOARD ---
    const stats = calculateStats();
    const config = getUtilityConfig(activeUtility);
    const Icon = config.icon;
    const meterData = getCurrentData();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`shadow-sm border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                            <Droplet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {t.welcome}, {formData.name}
                            </h1>
                            {/* Apartment Selector */}
                            <div className="flex items-center space-x-2 mt-1 cursor-pointer group relative" >
                                <Building className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <select 
                                    value={activeApartmentId || ''}
                                    onChange={(e) => {
                                        if(e.target.value === 'add') setShowAptModal(true);
                                        else setActiveApartmentId(Number(e.target.value));
                                    }}
                                    className={`bg-transparent text-sm font-medium focus:outline-none cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                                >
                                    {apartments.map(apt => (
                                        <option key={apt.id} value={apt.id} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                                            {apt.name}
                                        </option>
                                    ))}
                                    <option value="add" className="text-blue-500 font-bold">+ {t.addApartment}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {activeUtility !== 'settings' && (
                            <button onClick={() => setShowDeviceModal(true)} className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">{t.addDevice}</span>
                            </button>
                        )}
                        <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}>
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={handleLogout} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Utility Tabs */}
            <div className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 flex space-x-1 overflow-x-auto">
                    {['water', 'electricity', 'gas', 'settings'].map((utility) => {
                        const utilConfig = getUtilityConfig(utility);
                        const UtilIcon = utilConfig.icon;
                        const isActive = activeUtility === utility;
                        const isConnected = utility === 'settings' ? true : connectedDevices[utility];

                        return (
                            <button
                                key={utility}
                                onClick={() => setActiveUtility(utility)}
                                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                                    isActive
                                        ? `${utilConfig.color} border-current font-semibold`
                                        : `${darkMode ? 'text-gray-400' : 'text-gray-600'} border-transparent`
                                }`}
                            >
                                <UtilIcon className="w-5 h-5" />
                                <span>{utilConfig.name}</span>
                                {utility !== 'settings' && !isConnected && (
                                    <span className="text-xs bg-gray-500 text-white px-2 rounded-full opacity-60 ml-2">-</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeUtility === 'settings' ? (
                    // --- SETTINGS TAB ---
                    <div className={`max-w-2xl mx-auto rounded-xl shadow-md p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            <Settings className="w-6 h-6" /> {t.settings}
                        </h2>
                        
                        <form onSubmit={handleSaveSettings} className="space-y-8">
                            {/* Language */}
                            <div>
                                <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <Globe className="w-5 h-5" /> {t.language}
                                </h3>
                                <div className="flex space-x-4">
                                    <button type="button" onClick={() => handleLanguageChange('ua')} className={`px-4 py-2 rounded-lg border-2 ${language === 'ua' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>
                                        Українська 🇺🇦
                                    </button>
                                    <button type="button" onClick={() => handleLanguageChange('en')} className={`px-4 py-2 rounded-lg border-2 ${language === 'en' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>
                                        English 🇬🇧
                                    </button>
                                </div>
                            </div>

                            <hr className={darkMode ? 'border-gray-700' : 'border-gray-200'} />

                            {/* Rates */}
                            <div>
                                <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <DollarSign className="w-5 h-5" /> {t.rates}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.rateWater}</label>
                                        <input type="number" step="0.01" value={globalSettings.rates.water}
                                            onChange={(e) => setGlobalSettings({...globalSettings, rates: {...globalSettings.rates, water: e.target.value}})}
                                            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`} />
                                    </div>
                                    <div>
                                        <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.rateElec}</label>
                                        <input type="number" step="0.01" value={globalSettings.rates.electricity}
                                            onChange={(e) => setGlobalSettings({...globalSettings, rates: {...globalSettings.rates, electricity: e.target.value}})}
                                            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`} />
                                    </div>
                                    <div>
                                        <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.rateGas}</label>
                                        <input type="number" step="0.01" value={globalSettings.rates.gas}
                                            onChange={(e) => setGlobalSettings({...globalSettings, rates: {...globalSettings.rates, gas: e.target.value}})}
                                            className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`} />
                                    </div>
                                </div>
                            </div>

                            <hr className={darkMode ? 'border-gray-700' : 'border-gray-200'} />

                            {/* Camera */}
                            <div>
                                <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <Camera className="w-5 h-5" /> {t.cameraSettings}
                                </h3>
                                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.frequency}</label>
                                <select 
                                    value={globalSettings.cameraFrequency}
                                    onChange={(e) => setGlobalSettings({...globalSettings, cameraFrequency: e.target.value})}
                                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                                >
                                    <option value="12h">{t.freq12}</option>
                                    <option value="24h">{t.freq24}</option>
                                    <option value="week">{t.freqWeek}</option>
                                    <option value="month">{t.freqMonth}</option>
                                </select>
                            </div>

                            <button type="submit" className={`w-full py-3 rounded-lg font-bold text-white transition ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
                                {t.save}
                            </button>
                            {saveMessage && (
                                <div className="p-3 rounded bg-green-100 text-green-700 flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" /> {saveMessage}
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    // --- UTILITY DASHBOARD ---
                    !connectedDevices[activeUtility] ? (
                        <div className={`rounded-xl shadow-md p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className={`inline-flex p-4 rounded-full mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <Icon className={`w-12 h-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.notConnected}</h3>
                            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.connectPrompt}</p>
                            <button onClick={() => setShowDeviceModal(true)} className={`px-6 py-3 rounded-lg font-semibold text-white shadow-lg ${config.bgColor}`}>
                                {t.connectBtn} {config.name}
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500">{t.currentReading}</span>
                                        <Calendar className={`w-5 h-5 ${config.color}`} />
                                    </div>
                                    <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.current}</div>
                                    <div className="text-sm mt-1 text-gray-500">{config.unit}</div>
                                </div>
                                <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500">{t.thisMonth}</span>
                                        <Icon className={`w-5 h-5 ${config.color}`} />
                                    </div>
                                    <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {meterData.length > 0 ? meterData[meterData.length - 1].usage : 0}
                                    </div>
                                    <div className="text-sm mt-1 text-gray-500">{config.unit} {t.used}</div>
                                </div>
                                <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500">{t.avgUsage}</span>
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.avg}</div>
                                    <div className="text-sm mt-1 text-gray-500">{config.unit}{t.perMonth}</div>
                                </div>
                                <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500">{t.monthChange}</span>
                                        {parseFloat(stats.change) >= 0 ? <TrendingUp className="w-5 h-5 text-red-500" /> : <TrendingDown className="w-5 h-5 text-green-500" />}
                                    </div>
                                    <div className={`text-3xl font-bold ${parseFloat(stats.change) >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {stats.change > 0 ? '+' : ''}{stats.change}%
                                    </div>
                                    <div className="text-sm mt-1 text-gray-500">{t.fromLast}</div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.chartTitle}</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={meterData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                                            <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                                            <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                                            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', borderColor: darkMode ? '#374151' : '#e5e7eb', color: darkMode ? '#fff' : '#000' }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="reading" stroke={config.chartColor} strokeWidth={2} name={`${t.totalReading} (${config.unit})`} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.barTitle}</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={meterData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                                            <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                                            <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                                            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', borderColor: darkMode ? '#374151' : '#e5e7eb', color: darkMode ? '#fff' : '#000' }} />
                                            <Legend />
                                            <Bar dataKey="usage" fill={config.barColor} name={`${t.consumption} (${config.unit})`} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Table */}
                            <div className={`rounded-xl shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.tableTitle}</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t.month}</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t.date}</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t.totalReading}</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t.consumption}</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t.cost}</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">{t.photo}</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                            {meterData.map((record, index) => (
                                                <tr key={index} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.month} 2025</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.reading}</td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.usage}</td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.cost} ₴</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <button onClick={() => setSelectedPhoto(record)} className="text-blue-500 hover:text-blue-700">
                                                            <ImageIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>

            {/* Photo Modal */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" onClick={() => setSelectedPhoto(null)}>
                    <div className={`relative max-w-2xl w-full rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                         <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.photoModalTitle}</h3>
                            <button onClick={() => setSelectedPhoto(null)}><X className="w-6 h-6 text-gray-500" /></button>
                        </div>
                        <div className="p-4">
                            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden"><img src={selectedPhoto.photoUrl} alt="Meter" className="w-full h-full object-cover" /></div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div><span className="block font-medium mb-1 text-gray-500">{t.digits}:</span> <span className={`text-xl font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPhoto.reading}</span></div>
                                <div className="text-right"><span className="block font-medium mb-1 text-gray-500">{t.captured}:</span> <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>{new Date(selectedPhoto.date).toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Device Modal */}
            {showDeviceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowDeviceModal(false)}>
                    <div className={`relative max-w-md w-full rounded-xl shadow-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between mb-6">
                            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.addDeviceTitle}</h3>
                            <button onClick={() => setShowDeviceModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.connectPrompt}</p>
                        <form onSubmit={handleConnectDevice}>
                            <div className="mb-6">
                                <label className="block text-xs uppercase font-bold mb-2 text-gray-500">{t.serialLabel}</label>
                                <div className="relative">
                                    <Smartphone className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                                    <input type="text" value={serialCode} onChange={(e) => setSerialCode(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-lg border font-mono uppercase ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`} placeholder="XXX-000000" />
                                </div>
                            </div>
                            {deviceMessage && <div className={`mb-4 p-3 rounded-lg text-sm ${deviceMessage.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{deviceMessage.text}</div>}
                            <div className="flex space-x-3">
                                <button type="button" onClick={() => setShowDeviceModal(false)} className={`flex-1 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{t.cancel}</button>
                                <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold">{t.connect}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Apartment Modal */}
            {showAptModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowAptModal(false)}>
                    <div className={`relative max-w-md w-full rounded-xl shadow-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.addApartment}</h3>
                        <form onSubmit={handleCreateApartment}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2 text-gray-500">{t.aptName}</label>
                                <input type="text" value={newAptData.name} onChange={(e) => setNewAptData({...newAptData, name: e.target.value})} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`} placeholder="Напр. Квартира Львів" required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-2 text-gray-500">{t.aptAddress}</label>
                                <input type="text" value={newAptData.address} onChange={(e) => setNewAptData({...newAptData, address: e.target.value})} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`} placeholder="Вул. Шевченка 1" />
                            </div>
                            <div className="flex space-x-3">
                                <button type="button" onClick={() => setShowAptModal(false)} className={`flex-1 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{t.cancel}</button>
                                <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold">{t.create}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WaterMeterDashboard;