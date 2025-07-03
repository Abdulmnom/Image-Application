import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import HomePage from './pages/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter , Routes , Route} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { AuthContext } from './ContextApi/auth-context';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthContext.Provider value={AuthContext}>
     <Navbar />
    <Routes>
         <Route path="/" element={<App />} />
         <Route path="/home" element={<HomePage />} />
         <Route path="*" element={<h2 >404 Not Found</h2>} />
         <Route path='/register' element={<RegisterPage />} />
         <Route path='/login' element={<LoginPage />} />
    </Routes>
    </AuthContext.Provider>
    </BrowserRouter>
   
  </React.StrictMode>
);


reportWebVitals();
