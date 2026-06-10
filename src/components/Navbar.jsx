import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-zinc-950' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 py-3">
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/">
            <h1 className="text-netflix-red text-2xl md:text-3xl font-bold tracking-wider uppercase">
              NetYaFelix
            </h1>
          </Link>
          <ul className="hidden md:flex gap-5 text-sm">
            <li><Link to="/" className="hover:text-gray-300 transition">Home</Link></li>
            <li><Link to="/" className="hover:text-gray-300 transition">TV Shows</Link></li>
            <li><Link to="/" className="hover:text-gray-300 transition">Movies</Link></li>
            <li><Link to="/" className="hover:text-gray-300 transition">New & Popular</Link></li>
            <li><Link to="/" className="hover:text-gray-300 transition">My List</Link></li>
          </ul>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <div className={`flex items-center transition-all duration-300 ${
              searchOpen
                ? 'bg-black/90 border border-white/50 w-56 md:w-72'
                : 'w-6 h-6'
            }`}>
              {searchOpen ? (
                <>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Titles, people, genres"
                    className="bg-transparent text-white px-3 py-1.5 text-sm flex-1 focus:outline-none placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1.5 text-white hover:text-gray-300 transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="px-2 py-1.5 text-white hover:text-gray-300 transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="text-white hover:text-gray-300 transition p-1"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1 group"
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:ring-1 group-hover:ring-white/50 transition">
                U
              </div>
              <svg
                className={`w-4 h-4 text-white transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900/95 border border-zinc-700 rounded shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-700">
                  <p className="text-sm font-medium">User</p>
                  <p className="text-xs text-gray-400">user@example.com</p>
                </div>
                <ul className="py-1">
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      Manage Profiles
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      Account
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      Help Center
                    </button>
                  </li>
                </ul>
                <div className="border-t border-zinc-700 py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 transition text-center"
                    onClick={() => setProfileOpen(false)}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
