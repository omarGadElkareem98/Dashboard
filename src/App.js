import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';

const App = () => {
  const [isLoggedIn,setIsLoggedIn ]= useState(localStorage.getItem('token') != undefined);
  useEffect(() => {
    const storedTitle = localStorage.getItem('websiteTitle') ?? 'Zainlak';
    if (storedTitle) {
      document.title = storedTitle;
    }

  
  }, []);

  
  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
  };

  return (
    <Layout>
      <div>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login />
      )}
    </div>
    </Layout>
  );
}

export default App;