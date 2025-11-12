'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkTheme(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.body.classList.toggle('light-theme', !newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">
          <i data-feather="cpu"></i>
        </div>
        Swarise AI
      </div>
      <div 
        className={`theme-toggle ${isDarkTheme ? '' : 'active'}`} 
        onClick={toggleTheme}
      >
        <div className="theme-toggle-icons">
          <i data-feather="moon"></i>
          <i data-feather="sun"></i>
        </div>
      </div>
    </div>
  );
}