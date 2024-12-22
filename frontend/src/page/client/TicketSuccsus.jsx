import React, { useEffect, useState } from 'react';
import useZustand from '../../zustand/useZustand';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function TicketSuccsus() {
    const [WinnerMovie, setWinnerMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { username, setting } = useZustand()
    useEffect(() => {
        const fetchWinner = async () => {
            try {
                setLoading(true);
                const settingsResponse = await fetch('api/setting/6745808197b958d5b1c26aac');
                if (!settingsResponse.ok) {
                    throw new Error('Failed to fetch settings.');
                }
                const settingsData = await settingsResponse.json();
                const response = await fetch(`/api/movies/getWinner/${settingsData.movie_batch}`);
                const data = await response.json();
                setWinnerMovie(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchWinner();
    }, []);

    return (
        <div className="p-4 bg-gray-900 flex flex-col justify-center min-h-screen text-white">
            <div className='text-center text-4xl font-semibold mb-4 bg-gradient-to-r from-yellow-300 to-red-500 bg-clip-text text-transparent'> Congratulations!</div>
            <div className="text-center text-2xl font-semibold mb-4 text-white">
                {username} Your ticket has been successfully purchased.
            </div>
            <div onClick={() => navigate(-1)} className='fixed z-10 gap-2 flex items-center text-white bg-slate-800 font-semibold p-3 py-2 rounded-2xl text-xl  top-3 left-4'>
                <FaArrowLeft />Back
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center gap-4 w-full">
                    {loading ? (
                        <div className="w-[40%] h-40 rounded-2xl shimmer"></div>
                    ) : (
                        <img src={WinnerMovie?.img} className="w-[40%] object-cover h-40 rounded-2xl" alt="Movie" />
                    )}
                    <div className="w-[40%] font-bold text-2xl pb-3 bg-gradient-to-r from-yellow-300 to-red-500 bg-clip-text text-transparent">
                        <div className='text-lg text-red-500'>{WinnerMovie?.name || <div className="w-[90%] h-8 rounded-lg shimmer"></div>
                        }</div>
                        {!loading ? (<div>{setting.Movie_Day}</div>) : (<div className="w-[50%] h-7 my-1 rounded-lg shimmer"></div>)}
                        {!loading ? (<div>Night</div>) : (<div className="w-[70%] h-7 my-1 rounded-lg shimmer"></div>)}
                        {!loading ? (<div>at</div>) : (<div className="w-[70%] h-7 rounded-lg my-1 shimmer"></div>)}
                        {!loading ? (<div>10:30 PM</div>) : (<div className="w-[60%] h-7 rounded-lg my-1 shimmer"></div>)}
                    </div>
                </div>
            </div>

            <div className="text-xl py-3">
                <span className=' text-2xl text-yellow-300 text-bold'>1.</span> We will review your receipt and send your ticket via your Telegram account <span className='text-bold bg-gradient-to-r from-yellow-300 to-red-500 bg-clip-text text-transparent'>@{username}</span> .
            </div>
            <div className=" text-xl py-3">
                <span className=' text-2xl text-yellow-300 text-bold'>2.</span> If your receipt information is <span className='text-bold text-red-400'>invalid</span> , we will not contact you and will not send you any ticket.
            </div>
            <div className="text-xl py-3">
                <span className=' text-2xl text-yellow-300 text-bold'>3.</span> If it has been 2 days and you have not received your ticket, and if your receipt is <span className='text-bold text-green-600'>valid</span>, please contact us <span className='bg-gradient-to-r from-yellow-300 to-red-500 bg-clip-text text-bold text-transparent'>@nahom_hab or 0907702898.</span>
            </div>

        </div>
    );
}