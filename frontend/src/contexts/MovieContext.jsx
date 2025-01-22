import { createContext, useState, useContext, useEffect } from "react";
import { useAuthContext } from "./AuthContext";  // Import AuthContext

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const { user } = useAuthContext();  // Access user from AuthContext
  const [favorites, setFavorites] = useState([]);

  // Fetch favorites from the backend when the user is logged in
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:5000/favorites/${user.uid}`);
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const addToFavorites = async (movie) => {
    try {
      await fetch("http://localhost:5000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,  // Use Firebase user UID for identification
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        }),
      });
      setFavorites((prev) => [...prev, movie]);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      await fetch(`http://localhost:5000/favorites/${user.uid}/${movieId}`, {
        method: "DELETE",
      });
      setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};
