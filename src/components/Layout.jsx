import React, { useEffect } from 'react';

const Favicon = () => {
  useEffect(() => {
    const storedLogoBase64 = localStorage.getItem('logoBase64');
    if (storedLogoBase64) {
      const favicon = document.querySelector('link[rel="icon"]');
      favicon.href = `${storedLogoBase64}`;
    }
  }, []);

  return null; // Favicon component doesn't render any content
};

const Layout = ({ children }) => {
  return (
    <>
      <Favicon />
      {/* Add any other layout components or elements here */}
      {children}
    </>
  );
};

export default Layout;
