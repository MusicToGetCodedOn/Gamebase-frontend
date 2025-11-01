import { useTheme } from '../context/ThemeContext';
import './Header.css';
import LightIcon from '../assets/icons/lightmode_icon.png';
import DarkIcon from '../assets/icons/darkmode_icon.png';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();


  // Pick the opposite theme icon to indicate the action (light -> show moon, dark -> show sun)
  const iconSrc = theme === 'light' ? DarkIcon : LightIcon;

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* In Light-Mode zeigen wir das Dark-Icon (Mond), in Dark-Mode das Light-Icon (Sonne) */}
      <img
        className="theme-toggle-icon"
        src={iconSrc}
        alt=""
        aria-hidden="true"
      />
    </button>
  );
};

export default ThemeToggle;
