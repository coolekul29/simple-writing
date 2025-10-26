// Import React
import React from 'react'
import "../styles/footer.css";

// Footer component that shows info at the bottom of the page
const Footer = ({ theme, setTheme }) => {

  // This lets us switch between light and dark mode
  const toggle_mode = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }

  return (
    // The footer section of the website
    <footer className='footer'>
      
      {/* Second column - links to pages */}
      <div className='col'>
        <span>© 2025 Copyright</span>
        <span>•</span>
        <span>Privacy</span>
        <span>•</span>
        <span>Terms</span>
        <span>•</span>
        <span>Contact</span>
      </div>
    </footer>
  )
}

// Let other files use the Footer component
export default Footer
