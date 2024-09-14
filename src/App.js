import React from 'react';
import './App.css';
import MyForm from './pages/createForm';
import LoginPage from './pages/loginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TokenProvider } from './TokenContext'; // Import TokenProvider
import Gallery from './pages/gallery';

function App() {
  return (
    <TokenProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create-memory" element={<MyForm />} />
          <Route path='/gallery' element={<Gallery />} />
        </Routes>
      </Router>
    </TokenProvider>
  );
}

export default App;
