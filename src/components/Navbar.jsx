import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useFilmTracker } from "../context/FilmTrackerContext";
import LogMovieModal from "./LogMovieModal";
import { Film, BookOpen, Layers, Bookmark, User, Plus, Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { profile, diary, watchlist } = useFilmTracker();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/movies", label: "Films" },
    { to: "/diary", label: "Diary", badge: diary.length },
    { to: "/watchlist", label: "Watchlist", badge: watchlist.length },
    { to: "/lists", label: "Lists" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="ReelMind home">
          <span className="brand-icon" aria-hidden="true">▰</span>
          <span>
            <strong>ReelMind</strong>
            <small>Cinema diary & clustering intelligence.</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {navLinks.map((item) => {
            const isActive =
              item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="nav-count-dot">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="quick-log-nav-btn"
            onClick={() => setIsLogModalOpen(true)}
            title="Log a film"
          >
            <Plus size={15} />
            <span>Log</span>
          </button>

          <Link to="/profile" className="nav-profile-chip" title="View Jenil Patel's profile">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="nav-avatar-img"
            />
            <span className="nav-username">{profile.displayName || profile.username}</span>
          </Link>

          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" role="navigation">
          <div className="mobile-nav-links">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`mobile-nav-item ${
                  item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to)
                    ? "active"
                    : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="mobile-count-pill">{item.badge}</span>
                )}
              </Link>
            ))}

            <button
              type="button"
              className="mobile-log-action-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLogModalOpen(true);
              }}
            >
              <Plus size={16} /> Log a Film Now
            </button>
          </div>
        </div>
      )}

      {/* Global Quick Log Modal */}
      <LogMovieModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </>
  );
}
