import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { sampleMovies } from "../data/sampleMovies";

const STORAGE_KEY = "reelmind_user_activity_v4";

// Helper to look up a movie from sampleMovies by id
export function findMovieById(id) {
  return sampleMovies.find((m) => m.id === Number(id)) || null;
}

// Initial seed data configured for Jenil Patel with verified movie IDs & 10 diary entries
const initialSeedData = {
  profile: {
    username: "mr.prince",
    displayName: "JENNIL",
    bio: "I fall in love easily with films, and with endings that ruin me. 🧃 🚶 — mr.prince · Rajkot ↗ instagram.com",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=mrprincesanji&hair=short04&hairColor=ffd700&skinColor=f8d25c&backgroundColor=1f2022",
    backdropUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
    joinedYear: "2024",
    location: "Rajkot",
    instagram: "instagram.com",
    // 4 Favorite Films: Inception (1), The Dark Knight (2), Interstellar (3), The Shawshank Redemption (4)
    favorites: [1, 2, 3, 4],
  },
  // Watchlist: films queued to watch
  watchlist: [24, 22, 17, 15, 27], // Dune: Part Two, Oppenheimer, Blade Runner 2049, Whiplash, LOTR
  diary: [
    {
      id: "entry-1",
      movieId: 3, // Interstellar
      movieTitle: "Interstellar",
      releaseDate: "2014-11-05",
      posterPath: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      watchDate: "2026-09-16",
      rating: 5.0,
      isRewatch: true,
      isLiked: true,
      review: "The docking sequence with Zimmer's 'No Time For Caution' is pure cinematic perfection. Gets me weeping every single time.",
    },
    {
      id: "entry-2",
      movieId: 1, // Inception
      movieTitle: "Inception",
      releaseDate: "2010-07-16",
      posterPath: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      watchDate: "2026-09-12",
      rating: 4.5,
      isRewatch: true,
      isLiked: true,
      review: "A masterpiece of structure and rhythm. The rotating hallway fight scene remains undefeated in practical effects.",
    },
    {
      id: "entry-3",
      movieId: 2, // The Dark Knight
      movieTitle: "The Dark Knight",
      releaseDate: "2008-07-18",
      posterPath: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      watchDate: "2026-09-08",
      rating: 5.0,
      isRewatch: true,
      isLiked: true,
      review: "Heath Ledger gave one of the greatest antagonist performances in film history. Flawless pacing.",
    },
    {
      id: "entry-4",
      movieId: 4, // The Shawshank Redemption
      movieTitle: "The Shawshank Redemption",
      releaseDate: "1994-09-23",
      posterPath: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
      watchDate: "2026-09-02",
      rating: 5.0,
      isRewatch: false,
      isLiked: true,
      review: "Hope is a good thing, maybe the best of things. Timeless storytelling and magnificent performances by Robbins and Freeman.",
    },
    {
      id: "entry-5",
      movieId: 5, // Pulp Fiction
      movieTitle: "Pulp Fiction",
      releaseDate: "1994-09-10",
      posterPath: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      watchDate: "2026-08-28",
      rating: 4.5,
      isRewatch: false,
      isLiked: true,
      review: "Sharp, humorous, endlessly quotable dialogue that redefined modern independent cinema.",
    },
    {
      id: "entry-6",
      movieId: 10, // Fight Club
      movieTitle: "Fight Club",
      releaseDate: "1999-10-15",
      posterPath: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      watchDate: "2026-08-21",
      rating: 4.5,
      isRewatch: false,
      isLiked: true,
      review: "Fincher's kinetic direction, razor-sharp satire, and Norton's exhausted narration make this a legendary experience.",
    },
    {
      id: "entry-7",
      movieId: 8, // The Godfather
      movieTitle: "The Godfather",
      releaseDate: "1972-03-14",
      posterPath: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      watchDate: "2026-08-14",
      rating: 5.0,
      isRewatch: true,
      isLiked: true,
      review: "The gold standard of cinema drama. Brando and Pacino command every single frame with unforgettable gravity.",
    },
    {
      id: "entry-8",
      movieId: 6, // Parasite
      movieTitle: "Parasite",
      releaseDate: "2019-05-30",
      posterPath: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      watchDate: "2026-08-06",
      rating: 5.0,
      isRewatch: false,
      isLiked: true,
      review: "Bong Joon-ho constructed a pitch-perfect social thriller with unforgettable shifts in tone.",
    },
    {
      id: "entry-9",
      movieId: 12, // The Matrix
      movieTitle: "The Matrix",
      releaseDate: "1999-03-30",
      posterPath: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      watchDate: "2026-07-28",
      rating: 4.5,
      isRewatch: true,
      isLiked: true,
      review: "A revolutionary blend of philosophical cyberpunk, Hong Kong martial arts choreography, and bullet time.",
    },
    {
      id: "entry-10",
      movieId: 27, // The Lord of the Rings: The Return of the King
      movieTitle: "The Lord of the Rings: The Return of the King",
      releaseDate: "2003-12-01",
      posterPath: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
      watchDate: "2026-07-15",
      rating: 5.0,
      isRewatch: true,
      isLiked: true,
      review: "The charge of the Rohirrim brings goosebumps every time. The greatest fantasy achievement in cinematic history.",
    },
  ],
  lists: [
    {
      id: "list-1",
      title: "All-Time Nolan Mindbenders",
      description: "Ranked journey through Christopher Nolan's most conceptually daring and visually astonishing films.",
      isOrdered: true,
      movieIds: [1, 3, 2, 36], // Inception, Interstellar, The Dark Knight, Memento
      createdAt: "2026-08-01",
    },
    {
      id: "list-2",
      title: "Essential Sci-Fi & Existential Dread",
      description: "Films exploring space, consciousness, and what it means to be human.",
      isOrdered: false,
      movieIds: [3, 1, 12, 34, 17], // Interstellar, Inception, Matrix, Arrival, Blade Runner 2049
      createdAt: "2026-08-15",
    },
  ],
};

const FilmTrackerContext = createContext(null);

export function FilmTrackerProvider({ children }) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initialSeedData;
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          profile: { ...initialSeedData.profile, ...parsed.profile },
          diary: parsed.diary || initialSeedData.diary,
          lists: parsed.lists || initialSeedData.lists,
          watchlist: parsed.watchlist || initialSeedData.watchlist,
        };
      }
    } catch (e) {
      console.error("Failed to load user activity from localStorage", e);
    }
    return initialSeedData;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist user activity to localStorage", e);
    }
  }, [state]);

  // Derived lookup maps
  const watchedMovieIds = useMemo(() => {
    return new Set(state.diary.map((entry) => Number(entry.movieId)));
  }, [state.diary]);

  const watchlistSet = useMemo(() => {
    return new Set((state.watchlist || []).map(Number));
  }, [state.watchlist]);

  const movieRatingsMap = useMemo(() => {
    const map = {};
    // Latest rating takes precedence
    state.diary.forEach((entry) => {
      if (entry.rating) {
        map[entry.movieId] = entry.rating;
      }
    });
    return map;
  }, [state.diary]);

  const movieReviewsMap = useMemo(() => {
    const map = {};
    state.diary.forEach((entry) => {
      if (entry.review) {
        if (!map[entry.movieId]) map[entry.movieId] = [];
        map[entry.movieId].push(entry);
      }
    });
    return map;
  }, [state.diary]);

  // Rating breakdown for histogram / tiles (0.5 to 5.0)
  const ratingDistribution = useMemo(() => {
    const counts = {
      "5.0": 0,
      "4.5": 0,
      "4.0": 0,
      "3.5": 0,
      "3.0": 0,
      "2.5": 0,
      "2.0": 0,
      "1.5": 0,
      "1.0": 0,
      "0.5": 0,
    };

    state.diary.forEach((entry) => {
      if (entry.rating && entry.rating > 0) {
        const key = Number(entry.rating).toFixed(1);
        if (counts[key] !== undefined) counts[key]++;
      }
    });

    return counts;
  }, [state.diary]);

  // Actions
  function logFilm({ movieId, rating = null, review = "", watchDate, isRewatch = false, isLiked = false }) {
    const movie = findMovieById(movieId);
    if (!movie) return;

    const newEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      movieId: Number(movieId),
      movieTitle: movie.title,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path,
      watchDate: watchDate || new Date().toISOString().split("T")[0],
      rating: rating !== null ? Number(rating) : null,
      isRewatch: Boolean(isRewatch),
      isLiked: Boolean(isLiked),
      review: review.trim(),
    };

    // If movie was in watchlist, remove it upon logging
    setState((prev) => ({
      ...prev,
      diary: [newEntry, ...prev.diary],
      watchlist: (prev.watchlist || []).filter((id) => id !== Number(movieId)),
    }));

    return newEntry;
  }

  function deleteDiaryEntry(entryId) {
    setState((prev) => ({
      ...prev,
      diary: prev.diary.filter((entry) => entry.id !== entryId),
    }));
  }

  function updateDiaryEntry(entryId, updates) {
    setState((prev) => ({
      ...prev,
      diary: prev.diary.map((entry) => (entry.id === entryId ? { ...entry, ...updates } : entry)),
    }));
  }

  function updateFavorites(newFavorites) {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        favorites: newFavorites.slice(0, 4),
      },
    }));
  }

  function setFavoriteSlot(index, movieId) {
    setState((prev) => {
      const current = [...(prev.profile.favorites || [])];
      while (current.length < 4) current.push(null);
      current[index] = movieId ? Number(movieId) : null;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          favorites: current,
        },
      };
    });
  }

  function updateProfile(updates) {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updates,
      },
    }));
  }

  function createList({ title, description = "", isOrdered = false, movieIds = [] }) {
    const newList = {
      id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      description: description.trim(),
      isOrdered: Boolean(isOrdered),
      movieIds: movieIds.map(Number),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setState((prev) => ({
      ...prev,
      lists: [newList, ...prev.lists],
    }));

    return newList;
  }

  function deleteList(listId) {
    setState((prev) => ({
      ...prev,
      lists: prev.lists.filter((l) => l.id !== listId),
    }));
  }

  function updateList(listId, updates) {
    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => (l.id === listId ? { ...l, ...updates } : l)),
    }));
  }

  function toggleMovieInList(listId, movieId) {
    const targetId = Number(movieId);
    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => {
        if (l.id !== listId) return l;
        const exists = l.movieIds.includes(targetId);
        return {
          ...l,
          movieIds: exists ? l.movieIds.filter((id) => id !== targetId) : [...l.movieIds, targetId],
        };
      }),
    }));
  }

  // Watchlist functions
  function toggleWatchlist(movieId) {
    const targetId = Number(movieId);
    setState((prev) => {
      const current = prev.watchlist || [];
      const exists = current.includes(targetId);
      return {
        ...prev,
        watchlist: exists ? current.filter((id) => id !== targetId) : [targetId, ...current],
      };
    });
  }

  function isInWatchlist(movieId) {
    return watchlistSet.has(Number(movieId));
  }

  // Quick helper to check movie status
  function getMovieStatus(movieId) {
    const id = Number(movieId);
    const isWatched = watchedMovieIds.has(id);
    const inWatchlist = watchlistSet.has(id);
    const rating = movieRatingsMap[id] || null;
    const entries = state.diary.filter((e) => Number(e.movieId) === id);
    const isFavorite = state.profile.favorites?.includes(id);
    return {
      isWatched,
      inWatchlist,
      rating,
      entries,
      isFavorite,
    };
  }

  const value = {
    profile: state.profile,
    diary: state.diary,
    lists: state.lists,
    watchlist: state.watchlist || [],
    watchedMovieIds,
    watchlistSet,
    movieRatingsMap,
    movieReviewsMap,
    ratingDistribution,
    logFilm,
    deleteDiaryEntry,
    updateDiaryEntry,
    updateFavorites,
    setFavoriteSlot,
    updateProfile,
    createList,
    deleteList,
    updateList,
    toggleMovieInList,
    toggleWatchlist,
    isInWatchlist,
    getMovieStatus,
  };

  return <FilmTrackerContext.Provider value={value}>{children}</FilmTrackerContext.Provider>;
}

export function useFilmTracker() {
  const context = useContext(FilmTrackerContext);
  if (!context) {
    throw new Error("useFilmTracker must be used within a FilmTrackerProvider");
  }
  return context;
}
