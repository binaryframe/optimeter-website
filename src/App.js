import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Droplet, LogOut, Calendar, TrendingUp, TrendingDown, Sun, Moon,
    Zap, Flame, Image as ImageIcon, X, Plus, QrCode, Smartphone
} from 'lucide-react';

// --- Test Data Generator (Unchanged) ---
const generateTestData = (utilityType) => {
    const months = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
    const currentMonth = new Date().getMonth();
    const data = [];

    let cumulative, usageRange, costPerUnit;

    switch(utilityType) {
        case 'water':
            cumulative = 1250;
            usageRange = [8, 23];
            costPerUnit = 2.5;
            break;
        case 'electricity':
            cumulative = 5420;
            usageRange = [150, 350];
            costPerUnit = 1.68;
            break;
        case 'gas':
            cumulative = 890;
            usageRange = [20, 80];
            costPerUnit = 7.96;
            break;
        default:
            cumulative = 0;
            usageRange = [0, 0];
            costPerUnit = 0;
    }

    for (let i = 0; i <= currentMonth; i++) {
        const usage = Math.floor(Math.random() * (usageRange[1] - usageRange[0])) + usageRange[0];
        cumulative += usage;
        const photoUrl = `https://placehold.co/600x400/2563eb/FFF?text=${utilityType.toUpperCase()}+Reading:+${cumulative}`;

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
    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    // Data State
    const [waterData, setWaterData] = useState([]);
    const [electricityData, setElectricityData] = useState([]);
    const [gasData, setGasData] = useState([]);

    // Device State
    const [connectedDevices, setConnectedDevices] = useState({ water: false, electricity: false, gas: false });
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [serialCode, setSerialCode] = useState('');
    const [deviceMessage, setDeviceMessage] = useState('');

    // UI State
    const [activeUtility, setActiveUtility] = useState('water');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedUser = sessionStorage.getItem('waterMeterUser');
        const savedTheme = sessionStorage.getItem('darkMode');
        const savedDevices = sessionStorage.getItem('connectedDevices');

        if (savedUser) {
            setFormData(prev => ({ ...prev, name: savedUser }));
            setIsLoggedIn(true);
            loadMeterData();
        }

        if (savedDevices) {
            setConnectedDevices(JSON.parse(savedDevices));
        }

        if (savedTheme === 'true') {
            setDarkMode(true);
        }
    }, []);

    const loadMeterData = () => {
        setWaterData(generateTestData('water'));
        setElectricityData(generateTestData('electricity'));
        setGasData(generateTestData('gas'));
    };

    // --- Authentication Handlers ---

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password || (authMode === 'register' && !formData.name)) {
            setError('Будь ласка, заповніть всі поля');
            return;
        }

        // Mock Login Logic
        if (authMode === 'login') {
            if ((formData.email === 'demo' && formData.password === 'demo') || formData.email.includes('@')) {
                // Determine name based on input or default
                const userName = formData.name || formData.email.split('@')[0] || 'Користувач';
                finishAuth(userName);
            } else {
                setError('Невірний логін або пароль');
            }
        }
        // Mock Register Logic
        else {
            if (formData.email.includes('@') && formData.password.length >= 4) {
                finishAuth(formData.name);
            } else {
                setError('Введіть коректний email та пароль (мінімум 4 символи)');
            }
        }
    };

    const finishAuth = (userName) => {
        sessionStorage.setItem('waterMeterUser', userName);
        setFormData(prev => ({ ...prev, name: userName }));
        setIsLoggedIn(true);
        loadMeterData();
        // If it's the demo user, give them some devices by default
        if (formData.email === 'demo') {
            const demoDevices = { water: true, electricity: true, gas: false };
            setConnectedDevices(demoDevices);
            sessionStorage.setItem('connectedDevices', JSON.stringify(demoDevices));
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('waterMeterUser');
        setIsLoggedIn(false);
        setFormData({ name: '', email: '', password: '' });
        setConnectedDevices({ water: false, electricity: false, gas: false });
    };

    // --- Device Connection Handlers ---

    const handleConnectDevice = (e) => {
        e.preventDefault();
        setDeviceMessage('');

        if (!serialCode) {
            setDeviceMessage({ type: 'error', text: 'Введіть серійний код' });
            return;
        }

        // Mock Validation of ESP32 Serial Codes
        // WAT-xxx -> Water, EL-xxx -> Electricity, GAS-xxx -> Gas
        const code = serialCode.toUpperCase();
        let newDevice = null;

        if (code.startsWith('WAT')) newDevice = 'water';
        else if (code.startsWith('EL')) newDevice = 'electricity';
        else if (code.startsWith('GAS')) newDevice = 'gas';

        if (newDevice) {
            const updatedDevices = { ...connectedDevices, [newDevice]: true };
            setConnectedDevices(updatedDevices);
            sessionStorage.setItem('connectedDevices', JSON.stringify(updatedDevices));
            setActiveUtility(newDevice);
            setDeviceMessage({ type: 'success', text: `Пристрій успішно підключено!` });
            setTimeout(() => {
                setShowDeviceModal(false);
                setSerialCode('');
                setDeviceMessage('');
            }, 1500);
        } else {
            setDeviceMessage({ type: 'error', text: 'Невірний формат коду (Спробуйте WAT-001, EL-001, або GAS-001)' });
        }
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        sessionStorage.setItem('darkMode', newMode.toString());
    };

    const getUtilityConfig = (utility) => {
        const configs = {
            water: {
                name: 'Вода',
                icon: Droplet,
                unit: 'м³',
                color: darkMode ? 'text-blue-400' : 'text-blue-500',
                bgColor: darkMode ? 'bg-blue-600' : 'bg-blue-500',
                chartColor: darkMode ? '#60a5fa' : '#3b82f6',
                barColor: darkMode ? '#22d3ee' : '#06b6d4'
            },
            electricity: {
                name: 'Електроенергія',
                icon: Zap,
                unit: 'кВт·год',
                color: darkMode ? 'text-yellow-400' : 'text-yellow-500',
                bgColor: darkMode ? 'bg-yellow-600' : 'bg-yellow-500',
                chartColor: darkMode ? '#fbbf24' : '#f59e0b',
                barColor: darkMode ? '#fde047' : '#eab308'
            },
            gas: {
                name: 'Газ',
                icon: Flame,
                unit: 'м³',
                color: darkMode ? 'text-orange-400' : 'text-orange-500',
                bgColor: darkMode ? 'bg-orange-600' : 'bg-orange-500',
                chartColor: darkMode ? '#fb923c' : '#f97316',
                barColor: darkMode ? '#fdba74' : '#fb923c'
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

    // --- RENDER: LOGIN / REGISTER SCREEN ---
    if (!isLoggedIn) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
                darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-cyan-100'
            }`}>
                <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-md transition-colors duration-300 relative ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <button
                        onClick={toggleDarkMode}
                        className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <div className="flex items-center justify-center mb-6">
                        <div className={`p-4 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                            <Droplet className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className={`text-3xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Optimeter
                    </h1>
                    <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {authMode === 'login' ? 'З поверненням!' : 'Створіть свій аккаунт'}
                    </p>

                    <form onSubmit={handleAuthSubmit}>
                        {authMode === 'register' && (
                            <div className="mb-4">
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Ім'я
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
                                        darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 placeholder-gray-400'
                                            : 'bg-white border border-gray-300 text-gray-900 focus:ring-blue-500'
                                    }`}
                                    placeholder="Ваше ім'я"
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email
                            </label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 placeholder-gray-400'
                                        : 'bg-white border border-gray-300 text-gray-900 focus:ring-blue-500'
                                }`}
                                placeholder="name@email.com"
                            />
                        </div>

                        <div className="mb-6">
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Пароль
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 placeholder-gray-400'
                                        : 'bg-white border border-gray-300 text-gray-900 focus:ring-blue-500'
                                }`}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className={`mb-4 p-3 rounded-lg text-sm ${
                                darkMode ? 'bg-red-900 border border-red-700 text-red-200' : 'bg-red-50 border border-red-200 text-red-600'
                            }`}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full font-semibold py-3 rounded-lg transition duration-200 mb-3 ${
                                darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                            {authMode === 'login' ? 'Увійти' : 'Зареєструватися'}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className={`absolute inset-0 flex items-center`}>
                            <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                                <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                                    або
                                </span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setAuthMode(authMode === 'login' ? 'register' : 'login');
                            setError('');
                        }}
                        className={`w-full text-sm font-semibold text-center hover:underline ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}
                    >
                        {authMode === 'login'
                            ? "Немає аккаунту? Зареєструватися"
                            : "Вже є аккаунт? Увійти"}
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
            <div className={`shadow-sm border-b transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Привіт, {formData.name}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowDeviceModal(true)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                                darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Додати пристрій</span>
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-200 ${
                                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            }`}
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Вийти</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Utility Tabs */}
            <div className={`border-b transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex space-x-1 overflow-x-auto">
                        {['water', 'electricity', 'gas'].map((utility) => {
                            const utilConfig = getUtilityConfig(utility);
                            const UtilIcon = utilConfig.icon;
                            const isConnected = connectedDevices[utility];
                            const isActive = activeUtility === utility;

                            return (
                                <button
                                    key={utility}
                                    onClick={() => setActiveUtility(utility)}
                                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-200 whitespace-nowrap ${
                                        isActive
                                            ? `${utilConfig.color} border-current font-semibold`
                                            : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} border-transparent`
                                    }`}
                                >
                                    <UtilIcon className="w-5 h-5" />
                                    <span>{utilConfig.name}</span>
                                    {!isConnected && (
                                        <span className="text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full opacity-60 ml-2">
                                            -
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {!connectedDevices[activeUtility] ? (
                    <div className={`rounded-xl shadow-md p-12 text-center transition-colors duration-300 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className={`inline-flex p-4 rounded-full mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <Icon className={`w-12 h-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Optimeter не підключений
                        </h3>
                        <p className={`mb-6 max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Для початку відстеження споживання, введіть серійний код вашого пристрою.
                        </p>
                        <button
                            onClick={() => setShowDeviceModal(true)}
                            className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${config.bgColor} text-white hover:opacity-90 shadow-lg`}
                        >
                            Підключити {config.name}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {/* Card 1 */}
                            <div className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
                                darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Поточні показання
                                    </span>
                                    <Calendar className={`w-5 h-5 ${config.color}`} />
                                </div>
                                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {stats.current}
                                </div>
                                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{config.unit}</div>
                            </div>

                            {/* Card 2 */}
                            <div className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
                                darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Цього місяця
                                    </span>
                                    <Icon className={`w-5 h-5 ${config.color}`} />
                                </div>
                                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {meterData.length > 0 ? meterData[meterData.length - 1].usage : 0}
                                </div>
                                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{config.unit} використано</div>
                            </div>

                            {/* Card 3 */}
                            <div className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
                                darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Середнє споживання
                                    </span>
                                    <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                                </div>
                                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {stats.avg}
                                </div>
                                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{config.unit}/місяць</div>
                            </div>

                            {/* Card 4 */}
                            <div className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
                                darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Зміна за місяць
                                    </span>
                                    {parseFloat(stats.change) >= 0 ? (
                                        <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                                    ) : (
                                        <TrendingDown className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                                    )}
                                </div>
                                <div className={`text-3xl font-bold ${parseFloat(stats.change) >= 0 ? (darkMode ? 'text-red-400' : 'text-red-600') : (darkMode ? 'text-green-400' : 'text-green-600')}`}>
                                    {stats.change > 0 ? '+' : ''}{stats.change}%
                                </div>
                                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>від минулого</div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
                                darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Графік показань
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={meterData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                                        <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                                                border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                                                borderRadius: '8px',
                                                color: darkMode ? '#ffffff' : '#000000'
                                            }}
                                        />
                                        <Legend wrapperStyle={{ color: darkMode ? '#ffffff' : '#000000' }} />
                                        <Line type="monotone" dataKey="reading" stroke={config.chartColor} strokeWidth={2} name={`Загальні показання (${config.unit})`} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
                                darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Споживання по місяцях
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={meterData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                                        <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                                                border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                                                borderRadius: '8px',
                                                color: darkMode ? '#ffffff' : '#000000'
                                            }}
                                        />
                                        <Legend wrapperStyle={{ color: darkMode ? '#ffffff' : '#000000' }} />
                                        <Bar dataKey="usage" fill={config.barColor} name={`Споживання (${config.unit})`} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className={`rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
                            darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <div className={`px-6 py-4 border-b transition-colors duration-300 ${
                                darkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Статистика по місяцях
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>Місяць</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>Дата Зчитування</th>
                                        <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>Показання ({config.unit})</th>
                                        <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>Споживання ({config.unit})</th>
                                        <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>Орієнт. Вартість (₴)</th>
                                        <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                                            darkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>Фото</th>
                                    </tr>
                                    </thead>
                                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {meterData.map((record, index) => (
                                        <tr key={index} className={`transition-colors duration-150 ${
                                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                        }`}>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>{record.month} 2025</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                darkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                {new Date(record.date).toLocaleDateString('uk-UA')}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                                                darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>{record.reading}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                                                darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>{record.usage}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                                                darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>{record.cost} ₴</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <button
                                                    onClick={() => setSelectedPhoto(record)}
                                                    className={`p-1.5 rounded-full transition-colors ${
                                                        darkMode
                                                            ? 'text-blue-400 hover:bg-gray-600'
                                                            : 'text-blue-600 hover:bg-blue-50'
                                                    }`}
                                                    title="Переглянути фото лічильника"
                                                >
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
                )}
            </div>

            {/* Photo Modal */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" onClick={() => setSelectedPhoto(null)}>
                    <div className={`relative max-w-2xl w-full rounded-xl overflow-hidden shadow-2xl ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`} onClick={e => e.stopPropagation()}>
                        <div className={`flex items-center justify-between p-4 border-b ${
                            darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Фото лічильника - {selectedPhoto.month} 2025
                            </h3>
                            <button
                                onClick={() => setSelectedPhoto(null)}
                                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative aspect-video w-full bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                    src={selectedPhoto.photoUrl}
                                    alt="Meter Reading Proof"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className={`mt-4 grid grid-cols-2 gap-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <div>
                                    <span className="block font-medium mb-1">Розпізнані цифри:</span>
                                    <span className={`text-xl font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedPhoto.reading}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-medium mb-1">Дата фіксації:</span>
                                    <span>{new Date(selectedPhoto.date).toLocaleString('uk-UA')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Device Modal */}
            {showDeviceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowDeviceModal(false)}>
                    <div className={`relative max-w-md w-full rounded-xl shadow-2xl p-6 transition-all transform scale-100 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`} onClick={e => e.stopPropagation()}>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Додати пристрій
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowDeviceModal(false)}
                                className={`p-2 rounded-full transition-colors ${
                                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Введіть серійний номер, вказаний на корпусі вашого ESP32 модуля (наприклад, WAT-001).
                        </p>

                        <form onSubmit={handleConnectDevice}>
                            <div className="mb-6">
                                <label className={`block text-xs uppercase font-bold mb-2 tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Серійний номер (S/N)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Smartphone className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        value={serialCode}
                                        onChange={(e) => setSerialCode(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 font-mono uppercase ${
                                            darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 placeholder-gray-500'
                                                : 'bg-white border border-gray-300 text-gray-900 focus:ring-blue-500'
                                        }`}
                                        placeholder="XXX-000000"
                                    />
                                </div>
                            </div>

                            {deviceMessage && (
                                <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${
                                    deviceMessage.type === 'error'
                                        ? (darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-600')
                                        : (darkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-50 text-green-600')
                                }`}>
                                    {deviceMessage.text}
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeviceModal(false)}
                                    className={`flex-1 py-3 rounded-lg font-medium transition duration-200 ${
                                        darkMode
                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 py-3 rounded-lg font-semibold text-white transition duration-200 ${
                                        darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                >
                                    Підключити
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WaterMeterDashboard;