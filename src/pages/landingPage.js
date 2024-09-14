import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Project Title</h1>
      <p>
        Immersive Gallery of memories, Curated by You
      </p>
      <Link to="/login">
        <button className="btn">login</button>
      </Link>
    </div>
  );
}

export default LandingPage;
