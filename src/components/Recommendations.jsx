import MovieCard from "./MovieCard";

// ==================================================
// CONNECT YOUR CLUSTERING MODEL HERE
// Replace this sample recommendation data with movies
// returned by your ML backend.
// ==================================================
const sampleRecommendations = [
  {
    id: 101,
    title: "Interstellar",
    original_title: "Interstellar",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34800,
    runtime: 169,
    genres: "Adventure, Drama, Science Fiction",
    original_language: "en",
    popularity: 145.2,
    budget: 165000000,
    revenue: 773867216,
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    similarity: 96,
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    id: 102,
    title: "Blade Runner 2049",
    original_title: "Blade Runner 2049",
    release_date: "2017-10-04",
    vote_average: 8.0,
    vote_count: 13400,
    runtime: 164,
    genres: "Science Fiction, Drama",
    original_language: "en",
    popularity: 79.4,
    budget: 150000000,
    revenue: 267700000,
    overview: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    similarity: 93,
    poster_path: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg"
  },
  {
    id: 103,
    title: "Arrival",
    original_title: "Arrival",
    release_date: "2016-11-10",
    vote_average: 8.0,
    vote_count: 17400,
    runtime: 116,
    genres: "Science Fiction, Mystery, Drama",
    original_language: "en",
    popularity: 67.9,
    budget: 47000000,
    revenue: 203388186,
    overview: "Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace or are a threat.",
    similarity: 90,
    poster_path: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg"
  },
  {
    id: 104,
    title: "Memento",
    original_title: "Memento",
    release_date: "2000-10-11",
    vote_average: 8.2,
    vote_count: 14700,
    runtime: 113,
    genres: "Mystery, Thriller",
    original_language: "en",
    popularity: 51.4,
    budget: 9000000,
    revenue: 40000000,
    overview: "Leonard Shelby is tracking down the man who raped and murdered his wife. The difficulty of locating his wife's killer, however, is compounded by the fact that he suffers from a rare, untreatable form of short-term memory loss.",
    similarity: 88,
    poster_path: "https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg"
  },
  {
    id: 105,
    title: "The Matrix",
    original_title: "The Matrix",
    release_date: "1999-03-30",
    vote_average: 8.2,
    vote_count: 25400,
    runtime: 136,
    genres: "Action, Science Fiction",
    original_language: "en",
    popularity: 78.4,
    budget: 63000000,
    revenue: 463517383,
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    similarity: 85,
    poster_path: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  },
  {
    id: 106,
    title: "Dune: Part Two",
    original_title: "Dune: Part Two",
    release_date: "2024-02-27",
    vote_average: 8.2,
    vote_count: 6100,
    runtime: 166,
    genres: "Science Fiction, Adventure",
    original_language: "en",
    popularity: 180.4,
    budget: 190000000,
    revenue: 714444358,
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    similarity: 82,
    poster_path: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
  },
];

export default function Recommendations({ onViewDetails, onLogMovie, onAddToList }) {
  return (
    <section className="recommendation-section" id="discover">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><span aria-hidden="true">✦</span> The algorithm speaks</p>
          <h2>Movies You Might Actually Like</h2>
          <p>Apparently, the algorithm has opinions.</p>
        </div>
        <span className="reel-mark" aria-hidden="true">◉</span>
      </div>
      <div className="recommendation-grid">
        {sampleRecommendations.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onViewDetails={onViewDetails}
            onLogMovie={onLogMovie}
            onAddToList={onAddToList}
            isRecommendation
          />
        ))}
      </div>
    </section>
  );
}
