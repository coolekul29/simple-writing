import React from "react";
import { NavLink } from "react-router-dom";
import logo_light from "../assets/logo_light.png";
import logo_dark from "../assets/logo_dark.png";
import toggle_icon_light from "../assets/night.png";
import toggle_icon_dark from "../assets/day.png";
import "../styles/header.css";

const Header = ({ theme, setTheme, isAuthed, onAuthClick }) => {
  const toggle_mode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="navbar">
      <img
        src={theme === "light" ? logo_dark : logo_light}
        alt="logo"
        className="logo"
      />

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contactUs">Contact Us</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
      </nav>

      <div className="navbar-right">
        <img 
          onClick={() => { toggle_mode() }} 
          src={theme === "light" ? toggle_icon_dark : toggle_icon_light} 
          alt="toggle theme" 
          className='toggle_icon'
        />

        <button
          className="auth-btn"
          onClick={onAuthClick}
          >
            {isAuthed ? "Account": "Sign In"}
        </button>
      </div>
    </div>
  );
};

export default Header;
