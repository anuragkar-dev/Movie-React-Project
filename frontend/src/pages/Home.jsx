import MovieCard from "../components/MovieCard"
import { useState, useEffect } from "react"
import { searchMovies, getPopularMovies } from "../services/api"
import '../css/Home.css'

function Home () {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false); // State to track search

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            }
            catch (err) {
                console.log(err)
                setError("Failed to load movies.")
            }
            finally {
                setLoading(false)
            }
        }

        loadPopularMovies()
    }, [])

    const HandleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setLoading(true)
        if (loading) return

        try {
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
            setSearching(true) // Indicate that search results are shown
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleBackToPopular = () => {
        setSearching(false)
        setSearchQuery("")
        setLoading(true)
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch (err) {
                console.log(err)
                setError("Failed to load movies.")
            } finally {
                setLoading(false)
            }
        }
        loadPopularMovies()
    }

    return (
        <div className="home">
            <form onSubmit={HandleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search for movies..." 
                    className="search-input"    
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}>
                </input>
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div>
                    {searching && (
                        <button onClick={handleBackToPopular} className="back-to-popular-button">
                            Back to Popular Movies
                        </button>
                    )}
                    <div className="movies-grid">
                        {movies.map((movie) => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
