import { create } from 'zustand'

const useZustand = create((set) => ({
    chatID: null,
    setChatID: (chatID) => {
        set(() => ({ chatID }));
        localStorage.setItem('chatID', JSON.stringify(chatID));
    },
    username: null,
    setUsername: (username) => {
        set(() => ({ username }));
        localStorage.setItem('username', JSON.stringify(username));
    },
    movie: [],
    setMovie: (movie) => {
        set(() => ({ movie }));
        localStorage.setItem('movie', JSON.stringify(movie));
    },
    movieBatch: null,
    setMovieBatch: (movieBatch) => {
        set(() => ({ movieBatch }));
        localStorage.setItem('movie_batch', JSON.stringify(movieBatch));
    },
    error: null,
    setError: (error) => set({ error }),
    loading: false,
    setLoading: (loading) => set({ loading }),
    setting: null,
    setSetting: (setting) => set({ setting }),
    votedMovie: null,
    setVotedMovie: (votedMovie) => {
        set({ votedMovie });
        localStorage.setItem('voted_movie', JSON.stringify(votedMovie));

    },


}))

export default useZustand
