import React, { useEffect, useState } from 'react';
import Navigation from '../../component/navigation';
import Loading from '../../component/Loading';
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
    const [movie, setMovie] = useState([]);
    const [loading, setLoading] = useState(false);
    const [setting, setSetting] = useState(null)
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const settingsResponse = await fetch('api/setting/6745808197b958d5b1c26aac');
                if (!settingsResponse.ok) {
                    throw new Error('Failed to fetch settings.');
                }
                const settingsData = await settingsResponse.json();
                setSetting(settingsData)
                const response = await fetch(`/api/movies/batch/${settingsData.movie_batch}`);
                const data = await response.json();
                setMovie(data);
                console.log(data);  // Log the fetched movie data
            } catch (error) {
                console.error('Error fetching movie data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, []);

    // Calculate total votes only if there are enough movies
    const totalVote = movie.length >= 3 ? movie.reduce((total, m) => total + m.votes, 0) : 1;

    if (error) {
        return <div>{error}</div>;
    }
    if (loading) {
        return <Loading />;
    }

    return (
        <div className="text-white bg-gray-900 min-h-screen">
            <Navigation />
            <div className="md:p-10 p-5 md:w-[43%]">
                <div className="w-full relative">
                    <div className="flex rounded-2xl">
                        {movie.slice(0, 3).map((m, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={m.img}
                                    className={`w-full ${index === 0 ? 'rounded-l-2xl' : index === 2 ? 'rounded-r-2xl' : ''} object-cover h-[300px]`}
                                    alt="Movie"
                                />
                                <div className="absolute bottom-1 bg-gray-800 p-2 rounded-xl left-3 flex items-center gap-2 mb-2">
                                    <span className="text-sm text-yellow-400">
                                        {((m.votes * 100) / totalVote).toFixed(0)}% OF VOTE
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div onClick={() => {
                        navigate('/admin/tickets', { state: setting })
                    }} className="absolute top-2 right-2 bg-gradient-to-r px-4 py-2 m-2 rounded-xl from-yellow-400 to-red-500 font-semibold text-white text-2xl flex justify-center items-center">
                        View Tickets
                    </div>
                </div>
                <div className="flex justify-between">
                    <div>
                        <div className="font-bold md:text-3xl text-xl pb-3 bg-gradient-to-r from-yellow-300 to-red-500 bg-clip-text text-transparent">
                            This Week's Movies
                        </div>
                        <div className="flex text-sm gap-2 text-gray-300">
                            {movie.map((m) => (
                                <div key={m._id} className="px-2 py-1 bg-slate-700 rounded-xl">{m.name}</div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-r md:px-4 px-2 text-center md:py-0 py-3 m-2 rounded-xl from-yellow-400 to-red-500 bg-clip-text text-transparent font-bold border border-yellow-500 md:text-2xl text-xl flex justify-center items-center">
                        View Batch
                    </div>
                </div>
            </div>
        </div>
    );
}
