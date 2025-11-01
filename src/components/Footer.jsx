import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import ImpressumModal from './ImpressumModal.jsx';
import Github from '../assets/icons/github_icon.png';
import Instagram from '../assets/icons/instagram_icon.png';
import Twitch from '../assets/icons/twitch_icon.png';


function Footer() {
    const [showImpressum, setShowImpressum] = React.useState(false);

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
                        <li> <button
                            className="footer-link-button"
                            onClick={() => setShowImpressum(true)}
                        >
                            Impressum
                        </button></li>
                    </ul>
                </div>

                <div className="footer-social">
                    <h4>Follow us</h4>
                    <ul>
                        <li className="footer-social-item"><a href="https://github.com/MusicToGetCodedOn" target="_blank" rel="noreferrer"><img src={Github} alt="GitHub" /></a></li>
                        <li className="footer-social-item"><a href="https://www.instagram.com/perezzo05/" target="_blank" rel="noreferrer"><img src={Instagram} alt="Instagram" /></a></li>
                        <li className="footer-social-item"><a href="https://www.twitch.tv/boostmathers" target="_blank" rel="noreferrer"><img src={Twitch} alt="Twitch" /></a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <small>© {new Date().getFullYear()} Gamebase — All rights reserved.</small>
            </div>
            <ImpressumModal
                open={showImpressum}
                onClose={() => setShowImpressum(false)}
            />
        </footer>
    );
}

export default Footer;