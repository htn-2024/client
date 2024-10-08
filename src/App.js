import React from 'react';
import './App.css';
import MyForm from './pages/createForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Gallery from './pages/gallery';
import LandingPage from './pages/landingPage';

function App() {
  return (
    <Router className='App'>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-memory" element={<MyForm />} />
        <Route path='/gallery' element={<Gallery />} />
      </Routes>
    </Router>
  );
}
export default App;
