import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Droplet, LogOut, Calendar, TrendingUp, TrendingDown, Sun, Moon } from 'lucide-react';

// Test data generator
const generateTestData = () => {
    const months = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
    const currentMonth = new Date().getMonth();
    const data = [];
    let cumulative = 1250;

    for (let i = 0; i <= currentMonth; i++) {
        const usage = Math.floor(Math.random() * 15) + 8; // 8-23 m³ per month
        cumulative += usage;
        data.push({
            month: months[i],
            reading: cumulative,
            usage: usage,
            cost: (usage * 2.5).toFixed(2),
            date: new Date(2025, i, Math.floor(Math.random() * 28) + 1).toISOString()
        });
    }
    return data;
};

const WaterMeterDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [meterData, setMeterData] = useState([]);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check if user is already logged in
        const savedUser = sessionStorage.getItem('waterMeterUser');
        const savedTheme = sessionStorage.getItem('darkMode');

        if (savedUser) {
            setUsername(savedUser);
            setIsLoggedIn(true);
            loadMeterData();
        }

        if (savedTheme === 'true') {
            setDarkMode(true);
        }
    }, []);

    const loadMeterData = () => {
        // This function will later fetch from backend API
        // For now, using test data
        const testData = generateTestData();
        setMeterData(testData);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple authentication - replace with actual backend API call
        if (username && password) {
            if (username === 'demo' && password === 'demo') {
                sessionStorage.setItem('waterMeterUser', username);
                setIsLoggedIn(true);
                setUsername(username);
                setError('');
                loadMeterData();
            } else {
                setError('Невірні дані. Спробуйте demo/demo');
            }
        } else {
            setError('Будь ласка, введіть логін та пароль');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('waterMeterUser');
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
        setMeterData([]);
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        sessionStorage.setItem('darkMode', newMode.toString());
    };

    const calculateStats = () => {
        if (meterData.length === 0) return { total: 0, avg: 0, current: 0, change: 0 };

        const totalUsage = meterData.reduce((sum, item) => sum + item.usage, 0);
        const avgUsage = (totalUsage / meterData.length).toFixed(1);
        const currentReading = meterData[meterData.length - 1].reading;
        const lastMonth = meterData.length > 1 ? meterData[meterData.length - 2].usage : 0;
        const thisMonth = meterData[meterData.length - 1].usage;
        const change = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1) : 0;

        return { total: totalUsage, avg: avgUsage, current: currentReading, change };
    };

    if (!isLoggedIn) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
                darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-cyan-100'
            }`}>
                <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-md transition-colors duration-300 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center justify-center flex-1">
                            <div className={`p-4 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                                <Droplet className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                    <h1 className={`text-3xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Optimeter
                    </h1>
                    <p className={`text-center mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Відстежуйте споживання води
                    </p>

                    <div>
                        <div className="mb-4">
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Логін
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 placeholder-gray-400'
                                        : 'bg-white border border-gray-300 text-gray-900 focus:ring-blue-500'
                                }`}
                                placeholder="Введіть логін"
                            />
                        </div>

                        <div className="mb-6">
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Пароль
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 placeholder-gray-400'
                                        : 'bg-white border border-gray-300 text-gray-900 focus:ring-blue-500'
                                }`}
                                placeholder="Введіть пароль"
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
                            onClick={handleLogin}
                            className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
                                darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                            Увійти
                        </button>

                        <p className={`text-center text-sm mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Демо дані: demo / demo
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const stats = calculateStats();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`shadow-sm border-b transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                            <Droplet className="w-6 h-6 text-white" />
                        </div>
                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Доброго дня, {username}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2">
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Поточні показання
                            </span>
                            <Calendar className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                        </div>
                        <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {stats.current}
                        </div>
                        <div className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>м³</div>
                    </div>

                    <div className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Цього місяця
                            </span>
                            <Droplet className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
                        </div>
                        <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {meterData.length > 0 ? meterData[meterData.length - 1].usage : 0}
                        </div>
                        <div className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>м³ використано</div>
                    </div>

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
                        <div className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>м³/місяць</div>
                    </div>

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
                                <Line type="monotone" dataKey="reading" stroke={darkMode ? '#60a5fa' : '#3b82f6'} strokeWidth={2} name="Загальні показання (м³)" />
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
                                <Bar dataKey="usage" fill={darkMode ? '#22d3ee' : '#06b6d4'} name="Споживання (м³)" />
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
                                }`}>Показання (м³)</th>
                                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                                    darkMode ? 'text-gray-300' : 'text-gray-500'
                                }`}>Споживання (м³)</th>
                                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                                    darkMode ? 'text-gray-300' : 'text-gray-500'
                                }`}>Орієнт. Вартість (₴)</th>
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
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaterMeterDashboard;