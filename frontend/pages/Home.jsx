import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import WhatWeDoPage from './WhatWeDoPage';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import FooterSection from './FooterSection';
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css';
import CollaboratingNGOs from './CollaboratingNGOs';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <HeroSection navigate={navigate} />
      <FeaturesSection />
      <WhatWeDoPage />
      <TestimonialsSection />
      <CTASection navigate={navigate} />
      <CollaboratingNGOs/>
    </div>
  );
};

export default Home;