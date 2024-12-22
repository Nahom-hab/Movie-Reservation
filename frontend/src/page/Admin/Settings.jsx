import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/navigation';
import Loading from '../../component/Loading';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        movie_batch: 0,
        buyingTicket: false,
        Movie_Day: 'Friday'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch settings from the backend
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/setting/6745808197b958d5b1c26aac');
                if (!response.ok) {
                    throw new Error('Failed to fetch settings');
                }
                const data = await response.json();
                setSettings(data);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle form submission to update settings
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/setting/6745808197b958d5b1c26aac', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) {
                throw new Error('Failed to update settings');
            }

            const updatedSettings = await response.json();
            setSettings(updatedSettings);
            alert('Settings updated successfully');
        } catch (error) {
            setError(error.message);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center w-full items-center min-h-screen"><Loading /></div>;
    }

    if (error) {
        return <div className="text-center  text-red-500">{error}</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <Sidebar />
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 mx-6 w-full sm:w-96">
                <h1 className="text-3xl font-semibold text-center mb-6 text-white">Settings</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col">
                        <label htmlFor="movie_batch" className="text-sm font-medium text-white">Movie Batch</label>
                        <input
                            type="number"
                            id="movie_batch"
                            name="movie_batch"
                            value={settings.movie_batch}
                            onChange={handleInputChange}
                            className="mt-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter movie batch number"
                        />
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="buyingTicket"
                            name="buyingTicket"
                            checked={settings.buyingTicket}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-white border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="buyingTicket" className="text-sm text-white">Allow Buying Tickets</label>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="Movie_Day" className="text-sm font-medium text-white">Movie Day</label>
                        <input
                            type="text"
                            id="Movie_Day"
                            name="Movie_Day"
                            value={settings.Movie_Day}
                            onChange={handleInputChange}
                            className="mt-1 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter Movie day"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
                    >
                        Update Settings
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
