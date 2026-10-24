import React from 'react';
import { UrbanTopBar } from './urban/UrbanTopBar';
import { UrbanHeaderMegaMenu } from './urban/UrbanHeaderMegaMenu';

export const Navbar = () => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 990,
        width: '100%',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}
    >
      <UrbanTopBar />
      <UrbanHeaderMegaMenu />
    </header>
  );
};
