import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { Comanda } from './features/Comanda/Comanda';
import { Mainpage } from './features/Mainpage/mainpage';
import { Login } from './features/Auth/Login';
import { Register } from './features/Auth/Register';
import { Nav } from './components/Nav/Nav';
import { AuthContextProvider } from './features/Auth/AuthContext';

// import { BoardgameList } from './features/Boardgames/BoardgameList';
// import { BoardgameDetails } from './features/Boardgames/BoardgameDetails';
// import { BoardgameAdd } from './features/Boardgames/BoardgameAdd';
// import { BoardgameEdit } from './features/Boardgames/BoardgameEdit';

import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';


import './App.css';
//*element={<h1>Homepage</h1>} */
export function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Nav />
        <Routes>
          <Route path="/"
            element={
              <ProtectedRoute>
                <Mainpage />
              </ProtectedRoute>
            }
          />
          <Route
            path="comanda"
            element={
              <ProtectedRoute>
                <Comanda />
              </ProtectedRoute>
            }
          />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        <AuthContextProvider></AuthContextProvider>

        <ToastContainer />
      </AuthContextProvider>
    </BrowserRouter>
  );
}
