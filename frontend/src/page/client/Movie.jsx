import React, { useState } from 'react';
import tom from '../../assets/tom.png';
import ibdm from '../../assets/ibdm.png';
import trailer from '../../assets/tri.png';
import share from '../../assets/share.png';
import play from '../../assets/play.png';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import useZustand from '../../zustand/useZustand';

export default function Movie() {
    const location = useLocation()
    const navigate = useNavigate()
    const data = location.state

    const { setMovie, votedMovie, setVotedMovie, username } = useZustand();
    const [loading, setLoading] = useState()

    const handleYoutube = () => {
        navigate('/youtube', { state: data.youtube_url })
        console.log(data);
    }
    const handleVote = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/vote', {
                method: 'PUT',
                body: JSON.stringify({ movie_id: data._id, Telegram_UserName: username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const backendData = await response.json()
            setVotedMovie(data._id)
            setMovie(backendData.data)
            setVotedMovie(data._id)
        } catch (error) {
            console.error('Error updating vote:', error);
        } finally {
            setLoading(false)
        }
    };

    return (
        < div className="relative min-h-screen bg-gray-900" >
            {/* Floating Button with Yellow Shadow */}
            < div className="fixed bottom-5 w-full left-1/2 px-8 transform -translate-x-1/2 z-50" >
                <div onClick={() => handleVote()} className={`text-black flex items-center   bg-gradient-to-r ${votedMovie === data._id ? 'from-blue-500 to-green-500' : 'from-yellow-400 to-red-700 shadow-[0_0_15px_10px_rgba(234,179,8,0.8)]'}   gap-8 font-semibold w-full  px-2 py-1 text-[25px] whitespace-nowrap rounded-full `}>
                    <div>
                        <img className="w-12" src={play} alt="Play Icon" />
                    </div>
                    <div className="text-center">{loading ? 'Voting...' : votedMovie === data._id ? 'Movie Voted' : 'Vote Movie'} </div>
                </div>
            </div>


            {/* Main Content */}
            < div className="bg-gray-900 pb-28" >
                <div className="relative">
                    <div onClick={() => navigate(-1)} className='fixed z-10 gap-2 flex items-center text-white bg-slate-800 font-semibold p-3 py-2 rounded-2xl text-xl  top-3 left-4'>
                        <FaArrowLeft />Back
                    </div>
                    {/* Image with Shadow */}
                    <div className="relative w-full h-[65vh] overflow-hidden">
                        <img
                            className="w-full h-full object-cover"
                            src={data.img}
                            alt="Movie Poster"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900 pointer-events-none"></div>
                    </div>

                    {/* Movie Name */}
                    <div className="absolute bottom-24 font-semibold left-4 text-white text-4xl">
                        {data.name}
                    </div>
                    {/* Movie Details */}
                    <div className="absolute bottom-12 items-center left-4 text-white text-[14px] flex gap-1">
                        <div className="border font-semibold border-white p-2 py-1 bg-transparent rounded-xl">PG-13</div>
                        <div>{data.releaseYear},</div>
                        <div>{data.genre},</div>
                        <div>{data.duration}</div>
                    </div>
                    {/* Ratings */}
                    <div className="absolute left-4 bottom-4 flex text-white gap-5">
                        <div className="flex items-center">
                            <img className="w-6 h-6" src={tom} alt="" />
                            <div>{data.rating.tom}%</div>
                        </div>
                        <div className="flex items-center">
                            <img className="h-6" src={ibdm} alt="" />
                            <div>{data.rating.imdb}</div>
                        </div>
                    </div>
                </div>

                {/* Trailer and Share Options */}
                <div className="flex justify-evenly mt-2 px-3 text-white">
                    <div onClick={() => handleYoutube()} className="flex gap-3 items-center px-2 py-1 rounded-2xl bg-gray-800">
                        <img className="w-5 hover:opacity-80" src={trailer} alt="" />
                        <div className="text-xl">Trailer</div>
                    </div>
                    <div className="flex gap-2 items-center px-2 py-1 rounded-2xl bg-gray-800">
                        <FaHeart className='text-xl text-yellow-500' />
                        <div className="text-xl">Book</div>
                    </div>
                    <div className="flex gap-2 items-center px-2 py-1 rounded-2xl bg-gray-800">
                        <img className="w-8" src={share} alt="" />
                        <div className="text-xl">Share</div>
                    </div>
                </div>

                {/* Movie Description */}
                <div className="text-gray-300 text-sm px-4 pt-3">
                    {data.description}
                </div>
                <div className="text-gray-300 px-4 pt-3">
                    <span className="font-semibold text-white">Director:</span> {data.director}
                </div>

                {/* Cast Section */}
                <div className="pt-3 px-4 text-white">
                    <div className="text-lg">Cast:</div>
                    <div className="flex w-full overflow-x-auto gap-2 pt-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                        {
                            data.cast.map((ca, index) => {
                                return (
                                    <div key={index} className="p-2  rounded-xl bg-gray-800 flex-shrink-0">
                                        <img className="w-20 h-20 rounded-xl" src={ca.img} alt="" />
                                        <div className="text-white text-sm pt-1">{ca.name.slice(0, 12)}</div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </div >
        </div >
    );
}
