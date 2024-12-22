import React, { useEffect, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Loading from '../../component/Loading';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ViewTicket() {
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([]); // All tickets
    const [filteredTickets, setFilteredTickets] = useState([]); // Filtered tickets
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState('Pending'); // Default selected filter
    const location = useLocation()
    const movie_batch = location.state.movie_batch


    // Fetch tickets
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/ticket/getTicket/${movie_batch}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ticket data.');
                }
                console.log(response);
                const data = await response.json();
                setTickets(data);
                setFilteredTickets(data.filter((ticket) => ticket.ticketStatus === selected));
            } catch (error) {
                console.error('Error fetching ticket data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);


    // Filter tickets based on the selected status
    useEffect(() => {
        const filtered = tickets.filter((ticket) => ticket.ticketStatus === selected);
        setFilteredTickets(filtered);
    }, [selected, tickets]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen text-white bg-gray-900 p-5">
            <h1 className="text-2xl font-bold text-white mb-4">Ticket Information</h1>
            <div className="bg-gray-800 p-5 rounded-xl shadow-md">
                {/* Total Ticket Count */}
                <p className="text-lg font-semibold text-white mb-4">
                    Total Tickets: <span className="text-green-500">{tickets.length}</span>
                </p>

                {/* Ticket Status Section */}
                <div className="flex gap-5 justify-center text-white font-medium">
                    <div
                        onClick={() => setSelected('Pending')}
                        className={` ${selected === 'Pending' ? 'bg-gradient-to-r border border-yellow-600 from-yellow-400 to-red-400 ' : ' from-yellow-400 to-red-400 bg-gradient-to-r font-bold bg-clip-text text-transparent'}  text-black px-4 py-2 rounded-lg shadow-md hover:shadow-xl transition`}>

                        Pending Tickets
                    </div>
                    <div
                        onClick={() => setSelected('Approved')}
                        className={` ${selected === 'Approved' ? 'bg-gradient-to-r border border-yellow-600 from-yellow-400 to-red-400 ' : ' from-yellow-400 to-red-400 bg-gradient-to-r font-bold bg-clip-text text-transparent'}  text-black px-4 py-2 rounded-lg shadow-md hover:shadow-xl transition`}>

                        Approved Tickets
                    </div>
                    <div
                        onClick={() => setSelected('Rejected')}
                        className={` ${selected === 'Rejected' ? 'bg-gradient-to-r border border-yellow-600 from-yellow-400 to-red-400 ' : ' from-yellow-400 to-red-400 bg-gradient-to-r font-bold bg-clip-text text-transparent'}  text-black px-4 py-2 rounded-lg shadow-md hover:shadow-xl transition`}>

                        Rejected Tickets
                    </div>
                </div>
            </div>

            {/* Ticket List */}
            {filteredTickets.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 space-y-4 mt-5">
                    {filteredTickets.map((item, index) => {
                        let selectedService = JSON.parse(item.selectedService);
                        return (
                            <li
                                key={index}
                                className="p-4 gap-3 border border-gray-500 rounded-xl shadow-sm bg-gray-800 hover:shadow-lg transition"
                            >
                                <div className="flex gap-3">
                                    {/* Image with Zoom functionality */}
                                    <PhotoProvider>
                                        <PhotoView src={item.receiptImage}>
                                            <img
                                                className="h-44 w-[40%] object-cover rounded-xl"
                                                src={item.receiptImage}
                                                alt="Receipt"
                                            />
                                        </PhotoView>
                                    </PhotoProvider>
                                    <div>
                                        <p>
                                            <span className="font-bold">Telegram Username:</span>{' '}
                                            {item.TelegramUsername}
                                        </p>
                                        <p>
                                            <span className="font-bold">Selected Bank:</span>{' '}
                                            {item.selectedBank}
                                        </p>
                                        <p>
                                            Total Money:{' '}
                                            <span className="text-green-500">{item.total} ETB</span>
                                        </p>
                                        {selectedService.length > 0 &&
                                            selectedService.map((service, index) => (
                                                <div key={index} className="flex text-xs justify-between">
                                                    <p>{service.name}:</p>
                                                    <p>
                                                        {service.amount} X {service.prize} = ETB{' '}
                                                        {service.amount * service.prize}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="flex mt-5 mb-3 justify-end gap-5">
                                    <button onClick={() => navigate('/admin/qrcode', { state: item })} className="text-xl bg-green-400 px-4 py-2 rounded-xl text-black font-bold hover:bg-green-500 transition">
                                        Accept Ticket
                                    </button>
                                    <button className="text-xl bg-red-400 px-4 py-2 rounded-xl text-black font-bold hover:bg-red-500 transition">
                                        Reject Ticket
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="text-center text-gray-500 mt-5">No tickets available for {selected} status.</div>
            )}
        </div>
    );
}
