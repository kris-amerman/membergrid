import React, { useContext } from 'react';
import axios from 'axios';

import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MembersPage from './pages/MembersPage';
import PrivateRoutes from './utils/PrivateRoutes';
import { UserContext } from './contexts/UserContext';

function App() {

  // On logout, should refresh the page or send back to sign in page 
  const logout = () => {
    axios.get('http://localhost:4000/logout', { withCredentials: true })
      .then(res => {
        console.log(res)
        if (res.data) {
          window.location.href = '/';
        }
      });
  };

  return (
    <div className='p-10'>
      {/* <h1>{user ? user.displayName : <></>}</h1> */}
      <div><button onClick={logout}>Logout</button></div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          {/* /members is a protected route --> 
          if a user exists render child route's element 
          otherwise navigate to login */}
          <Route element={<PrivateRoutes />}>
            <Route path='/members' element={<MembersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
