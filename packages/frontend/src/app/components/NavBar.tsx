import React from 'react';
import './NavBar.css';

export default function NavBar(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo rounded-font">Tao of Programming</div>
      {props.children}
    </nav>
  );
}
