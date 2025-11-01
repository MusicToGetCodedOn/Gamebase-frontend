import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';


function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3 className="footer-title">Gamebase</h3>
          <p className="footer-slogan">Discover, Rate and Share your favorite games</p>
        </div>

        <nav className="footer-nav" aria-label="Footer Navigation">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/discover">Discover</Link></li>
            <li><Link to="/trending">Trending</Link></li>
            <li><Link to="/top-rated">Top Rated</Link></li>
            <li><Link to="/upcoming">Upcoming</Link></li>
          </ul>
        </nav>

        <div className="footer-contact">
          <h4>Contact</h4>
          <ul>
            <li><a href="/contact">Kontaktformular</a></li>
            <li><Link to="/impressum">Impressum</Link></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Follow us</h4>
          <ul>
            <li><a href="https://github.com/YourRepo" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="https://instagram.com/YourProfile" target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© {new Date().getFullYear()} Gamebase — All rights reserved.</small>
      </div>
    </footer>
  );
}

export default Footer;