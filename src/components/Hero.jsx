export default function Hero({ searchText, setSearchText, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <p className="eyebrow"><span aria-hidden="true">✦</span> A tiny cinema for curious minds</p>
        <h1>Find Your Next <em>Movie Obsession.</em></h1>
        <p className="hero-copy">Let the algorithm do the digging. You just bring the popcorn.</p>
        <form className="search-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="movie-search">Search for a movie</label>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            id="movie-search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search for a movie..."
          />
          <button type="submit">Find Movies <span aria-hidden="true">→</span></button>
        </form>
        <p className="search-hint">Try “Inception”, “mystery”, or just trust the algorithm.</p>
      </div>
    </section>
  );
}
