import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useZustand from '../zustand/useZustand';
// import { checkout } from '../../../backend/routes/movie.route';



export default function MovieCard({ data, totalvotes, index }) {
    const navigate = useNavigate();
    const { votedMovie, setMovie, setVotedMovie, username } = useZustand()
    const [loading, setLoading] = useState()
    const handleNavigate = () => {
        navigate(`/movie`, { state: data });
    };

    useEffect(() => {
        const checkVote = async () => {
            try {
                const response = await fetch(`/api/vote/checkVote/${data._id}/${username}`);
                const resdata = await response.json();
                if (resdata.voted) {
                    setVotedMovie(data._id);
                }
            } catch (error) {
                console.error('Error checking vote:', error);
            }
        }
        checkVote()
    }, [])



    const handleVote = async (movieIndex) => {
        try {
            setLoading(true)
            // Simulate backend update
            const response = await fetch('/api/vote', {
                method: 'PUT',
                body: JSON.stringify({ movie_id: data._id, Telegram_UserName: username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const BackData = await response.json()
            if (BackData.data) {
                setMovie(BackData.data)
                setVotedMovie(data._id)
            }
        } catch (error) {
            console.error('Error updating vote:', error);
        } finally {
            setLoading(false)
        }
    }



    return (
        <div
            className={`w-[32%] p-1 ${votedMovie === data._id ? 'bg-gradient-to-r from-blue-500 to-red-700' : 'bg-gray-800'} rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl`}
        >
            {/* Movie Image */}
            <div onClick={handleNavigate} className="relative overflow-hidden">
                <img src={data.img} alt={data.name} className="w-full h-28 rounded-lg object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-80"></div>
            </div>

            {/* Movie Details */}
            <div className="px-1 pt-1 text-white">
                <h2 className="text-sm font-bold whitespace-nowrap text-yellow-400 mb-1">{data.name}</h2>
                <div className="text-sm whitespace-nowrap text-yellow-400">({data.votes} vote{data.votes !== 1 && 's'})</div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className={`${data.position === 1
                                ? 'bg-green-600'
                                : data.position === 2
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                } h-2 rounded-full`}
                            style={{ width: `${(data.votes * 100) / totalvotes}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-yellow-400">{((data.votes * 100) / totalvotes).toFixed(0)}%</span>
                </div>

                {/* Vote Button */}
                <div className="flex w-full justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleVote(index)
                        }}
                        className="bg-red-600 hover:bg-red-700 px-6 py-1 rounded-lg text-sm font-medium"
                    >
                        {loading ? 'Voting...' : votedMovie === data._id ? 'VOTED' : 'VOTE'}
                    </button>
                </div>
            </div>
        </div>
    );
}