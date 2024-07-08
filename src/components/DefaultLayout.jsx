import React, { useState } from 'react';
import SideNav from './SideNav';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const DefaultLayout = ({ children }) => {
  const [isSideNavVisible, setIsSideNavVisible] = useState(true);

  const toggleSideNav = () => {
    setIsSideNavVisible(!isSideNavVisible);
  };

  return (
    <div className="flex w-full h-full relative">
      {isSideNavVisible && <SideNav />}
      <main className={`flex-1 h-full overflow-y-auto bg-white scrollbar-thin ${isSideNavVisible ? 'ml-0' : 'ml-0'}`}>
        <IconButton
          className="absolute  left-2 z-50"
          onClick={toggleSideNav}
        >
          {isSideNavVisible ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        {children}
      </main>
    </div>
  );
};

export default DefaultLayout;
