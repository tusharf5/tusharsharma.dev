import React from 'react';

import useDarkMode from 'use-dark-mode';
import { classList } from 'dynamic-class-list';

export default function DarkModeToggle() {
  const darkMode = useDarkMode(false);

  return (
    <div
      className={classList('toggle-track', {
        toggled: darkMode.value
      })}
      onClick={darkMode.toggle}>
      <div className='toggle-moon'>
        <span role='img' aria-label='Enable Dark Mode'>
          🌛
        </span>
      </div>
      <div className='toggle-sun'>
        <span role='img' aria-label='Enable Light Mode'>
          ☀️
        </span>
      </div>
      <div className='toggle-thumb'></div>
    </div>
  );
}
