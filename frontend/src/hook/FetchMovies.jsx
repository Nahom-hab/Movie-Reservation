import { useEffect } from 'react';
import useZustand from '../zustand/useZustand';

export default function FetchMovies() {
    const { setMovie, setError, setLoading, setSetting } = useZustand();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true); // Set loading to true when fetching starts

                // Fetch settings
                const settingsResponse = await fetch('api/setting/6745808197b958d5b1c26aac');
                if (!settingsResponse.ok) {
                    throw new Error('Failed to fetch settings.');
                }
                const settingsData = await settingsResponse.json();
                setSetting(settingsData);

                // Fetch movies using the settings
                const moviesResponse = await fetch(`api/movies/batch/${settingsData.movie_batch}`);
                if (!moviesResponse.ok) {
                    throw new Error('Failed to fetch movies.');
                }
                const moviesData = await moviesResponse.json();
                setMovie(moviesData);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false); // Ensure loading is turned off in all cases
            }
        };

        fetchMovies();
    }, [setMovie, setError, setLoading, setSetting]); // Add dependencies for safety
}
