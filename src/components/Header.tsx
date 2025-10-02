import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Track scroll position for header appearance change
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <svg className="logo-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="logo-text">Book Explorer</span>
                    </Link>

                    <div className="header-actions">
                        {/* Mobile menu toggle */}
                        <button
                            aria-label="Toggle menu"
                            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
                            onClick={toggleMobileMenu}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>

                    <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
                        <ul className="nav-list">
                            <li className="nav-item">
                                <NavLink
                                    to="/"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    end
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/favorites"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Favorites
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
