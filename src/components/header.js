import React from 'react';
import { Link } from 'gatsby';

import favicon from '../images/favicon.png';
import DarkModeToggle from './dark-mode-switch';

export default function Header() {
  return (
    <header className='header'>
      <nav>
        <Link className='logo' to='/'>
          <img alt='Tushar Sharma' src={favicon} />
          <span>tusharsharma</span>
        </Link>
        <span></span>
        <ul>
          {/**<li>
            <Link to='/'>blog</Link>
          </li>
          <li>
            <Link to='/about'>about</Link>
          </li>**/}
          <li>
            <DarkModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
