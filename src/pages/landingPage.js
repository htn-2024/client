import React from 'react';
import { Link } from 'react-router-dom';
import './landingPage.css';
import { ReactComponent as FrameyLaunch } from '../images/frameyLanding.svg';


const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1 className="project-title text">FLASHBACK</h1>
      <p className='landing-copy sub-text'>
        Immersive Gallery of <span className='blue'>Memories</span>, Curated by <span className='blue'>You</span>
      </p>
      <Link to="/gallery">
        <button className="btn text">start</button>
      </Link>
      <FrameyLaunch className='framey'/>
    </div>
  );
}

<span className='blue'></span>
export default LandingPage;
