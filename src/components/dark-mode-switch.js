/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';

import useDarkMode from 'use-dark-mode';
import { cl } from 'dynamic-class-list';

export default function DarkModeToggle() {
  const darkMode = useDarkMode(false);

  return (
    <div
      className={cl('toggle-track', {
        toggled: darkMode.value,
      })}
      onClick={darkMode.toggle}
    >
      <div className="toggle-moon">
        <span role="img" aria-label="Enable Dark Mode">
          🌛
        </span>
      </div>
      <div className="toggle-sun">
        <span role="img" aria-label="Enable Light Mode">
          ☀️
        </span>
      </div>
      <div className="toggle-thumb"></div>
    </div>
  );
}
