import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

import HomePage from './pages/HomePage';
import MembersPage from './pages/MembersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivateRoutes from './utils/PrivateRoutes';

function App() {

  return (
    <div className=''>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/contact' element={<ContactPage />} />

          {/* Protected routes -- user must exist (TODO CSRF and JWT) */}
          <Route element={<PrivateRoutes />}>
            <Route path='/members' element={<MembersPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
