import React from 'react';
import { Link } from 'react-router-dom';
import './landingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1 className="project-title text">PROJECT TITLE</h1>
      <p className='landing-copy sub-text'>
        Immersive Gallery of <span className='blue'>Memories</span>, Curated by <span className='blue'>You</span>
      </p>
      <div>
        <Link to="/login">
          <button className="btn text">login</button>
        </Link>
        <img src="../images/frameyLanding.svg" alt="Mascot image" width="384" height="326"/>
      </div>
    </div>
  );
}

<span className='blue'></span>
export default LandingPage;
