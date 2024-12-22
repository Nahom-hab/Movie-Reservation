import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function TicketAdmin() {
    const location = useLocation();
    const initialData = location.state;
    const { _id, receiptImage, selectedBank, __v, phone, ticketStatus, selectedService, chatID, createdAt, ...rest } = initialData;
    const selectedServ = JSON.parse(selectedService);
    const formattedSelectedService = selectedServ.map((element) => ({
        name: element.name,
        amount: element.amount,
    }));
    const [data, setData] = useState({ ...rest, selectedService: formattedSelectedService });
    const [qrImageURL, setQrImageURL] = useState('');
    const [jsonData, setJsonData] = useState(JSON.stringify(data, null, 2));
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // To store success or error messages
    const [loading, setLoading] = useState(false);

    // Handle changes to the JSON data
    const handleJsonChange = (e) => {
        setJsonData(e.target.value);
    };

    // Handle save action
    const handleSaveData = () => {
        try {
            const parsedData = JSON.parse(jsonData);
            setData(parsedData);
            setError('');
            setMessage('Data saved successfully!');
            generateQRCode(parsedData);
        } catch (err) {
            setError('Invalid JSON format');
            setMessage('');
        }
    };

    // Generate QR code from the JSON data
    const generateQRCode = (qrdata) => {
        const qrData = encodeURIComponent(JSON.stringify(qrdata));
        const url = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=200x200`;
        setQrImageURL(url);
    };

    const sendMessage = async () => {
        if (!qrImageURL) {
            setError('QR Code is not generated');
            return;
        }
        try {
            const sendData = {
                username: 'nahom_hab',
                total: rest.total,
                totalTicket: rest.totalTicket,
                imageUrl: qrImageURL,
                ticket_id: _id,
            }
            console.log('send data', sendData);


            setLoading(true);
            const response = await fetch('/api/message/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendData),
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                setError(`Failed to send message: ${errorMessage}`);
            }
            const data = await response.json();
            setMessage(data.message);

        } catch (error) {
            console.error(error);
            setError('Error sending message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Ticket Data</h2>

            {/* JSON Editor Section */}
            <div className="mb-4">
                <textarea
                    value={jsonData}
                    onChange={handleJsonChange}
                    rows="10"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Edit JSON data here"
                ></textarea>
                <div className='flex gap-3'>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {message && <p className="text-green-500 whitespace-nowrap text-sm mt-2">{message}</p>}
                    <button
                        onClick={handleSaveData}
                        className="w-full text-sm bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Generate QR Code
                    </button>
                </div>
            </div>

            {/* QR Code Display Section */}
            {qrImageURL && (
                <div className="mt-6 flex flex-col items-center">
                    <img src={qrImageURL} alt="Generated QR Code" className="w-[80%] h-[80%] mt-4" />
                    <div
                        onClick={sendMessage}
                        className={`w-full text-center font-bold m-3 px-4 py-2 rounded-xl text-xl bg-gradient-to-r from-yellow-300 to-red-500 transition duration-200 ${loading ? 'cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Sending...' : 'Send Ticket To User'}
                    </div>
                </div>
            )}
        </div>
    );
}
