import React, { useEffect, useState } from 'react';
import tom from '../../assets/tom.png';
import ibdm from '../../assets/ibdm.png';
import useZustand from '../../zustand/useZustand';
import { Link, useNavigate } from 'react-router-dom';
import NoVoting from '../../component/NoVoting';
import MovieCard from '../../component/MovieCard';
import Loading from '../../component/Loading';
import getTelegramUser from '../../hook/getTelegramUser';

export default function Home() {
    const navigate = useNavigate();
    const { setMovieBatch, setting, setSetting, movie, username, setMovie } = useZustand();
    const [movieData, setMovieData] = useState(movie);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    getTelegramUser()

    useEffect(() => {
        setMovieData(movie);
    }, [movie]);

    useEffect(() => {
        if (username === 'nahom_hab' || username === 'Userisitan' || username === 'efrem_yonass') {
            navigate('/admin');
        }
    }, [])

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const settingsResponse = await fetch('api/setting/6745808197b958d5b1c26aac');
                if (!settingsResponse.ok) {
                    throw new Error('Failed to fetch settings.');
                }
                const settingsData = await settingsResponse.json();
                setMovieBatch(settingsData.movie_batch);
                setSetting(settingsData);
                console.log('setting', settingsData);


                const movieResponse = settingsData.buyingTicket
                    ? await fetch(`/api/movies/batch/${settingsData.movie_batch}`)
                    : await fetch(`/api/movies/getWinner/${settingsData.movie_batch}`);

                if (!movieResponse.ok) {
                    throw new Error('Failed to fetch movie data.');
                }

                const data = await movieResponse.json();
                setMovieData(settingsData.buyingTicket ? data : [data]);
                setMovie(settingsData.buyingTicket ? data : [data]);
                console.log('movies', data);

            } catch (error) {
                console.error('Error fetching movie data:', error);
                setError(error.message); // Set error message for display
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [navigate, setMovieBatch, setSetting]);

    const sortedMovies = movieData?.slice().sort((a, b) => b.votes - a.votes) || [];
    const totalVotes = movieData?.reduce((total, movie) => total + movie.votes, 0) || 0;

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">{error}</div>; // Display error message
    if (!movieData || sortedMovies.length === 0) return <NoVoting />;

    return (
        <div className="bg-gray-900 pt-3 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between mb-1 pb-3 items-center pt-2 px-5">
                <div>
                    <div className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent font-bold leading-[23px] text-[28px]"><span className='text-[30px]'>ፍካት</span> 's Cinema</div>
                    <div className="text-white">Open Air</div>
                </div>
                <div className="text-black flex justify-center font-semibold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent py-1 px-3 text-xl whitespace-nowrap rounded-full shadow-[0_0_5px_5px_rgba(234,179,8,0.6)]">
                    <Link to={'/ticket'} className="text-center flex gap-3">Buy Ticket</Link>
                </div>
            </div>

            {/* Movie Section */}
            <div className="relative">
                <div className="relative w-full h-[56vh] rounded-t-xl overflow-hidden">
                    <img className="w-full h-full object-cover" src={sortedMovies[0].img} alt="Movie Poster" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900 pointer-events-none"></div>
                </div>

                <div className="absolute bottom-24 font-semibold left-4 text-white text-4xl">
                    <div className="text-[11px] p-0 leading-none py-1 px-2 border border-white rounded-full text-white w-fit">
                        Majority Chosen Movie
                    </div>
                    {sortedMovies[0].name}
                </div>
                <div className="absolute bottom-12 items-center left-4 text-white text-[14px] flex gap-1">
                    <div className="border font-semibold border-white p-2 py-1 bg-transparent rounded-xl">PG-13</div>
                    <div>{sortedMovies[0].releaseYear},</div>
                    <div>{sortedMovies[0].genre},</div>
                    <div>{sortedMovies[0].duration}</div>
                </div>
                <div className="absolute left-4 bottom-4 flex text-white gap-5">
                    <div className="flex items-center">
                        <img className="w-6 h-6" src={tom} alt="Tomatometer" />
                        <div>{sortedMovies[0].rating.tom}%</div>
                    </div>
                    <div className="flex items-center">
                        <img className="h-6" src={ibdm} alt="IMDb" />
                        <div>{sortedMovies[0].rating.imdb}</div>
                    </div>
                    <div className="flex gap-1 bg-slate-700 rounded-xl bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent px-2 font-bold items-center">
                        {sortedMovies[0].votes}
                        <div>Vote</div>
                    </div>
                </div>
            </div>

            {/* Display all movies */}
            {
                setting.buyingTicket ? (
                    <div className="flex pt-2 justify-evenly">
                        {sortedMovies.map((data, index) => (
                            <MovieCard key={data._id} totalvotes={totalVotes} data={data} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className=''>
                        <div className='flex justify-center gap-4 w-full'>
                            <img src={movieData[0].img} className='w-[40%] h-36 object-cover rounded-2xl' alt="Winner Movie" />
                            <div className="w-[40%] font-bold text-2xl pb-3 bg-gradient-to-r from-yellow-300 to-red-500 bg-clip-text text-transparent">
                                <div>{setting.Movie_Day}</div>
                                <div>Night</div>
                                <div>at</div>
                                <div>12:00 PM</div>
                            </div>
                        </div>
                        <div className='px-10 text-gray-400 text-xl mt-2'>
                            <span className='text-white'>Movie: </span>{movieData[0].name}
                        </div>
                        <div className="text-black mt-5 mx-10 flex justify-center gap-8 font-semibold w-[80%] bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent py-1 text-[23px] whitespace-nowrap rounded-full shadow-[0_0_5px_5px_rgba(234,179,8,0.6)]">
                            <Link to={'/ticket'} className="text-center flex gap-3">Buy Ticket Now</Link>
                        </div>
                    </div>
                )
            }
        </div>
    );
}