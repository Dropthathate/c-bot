import React from 'react';
import HeroSection from './components/HeroSection';
import './App.css'; // Make sure your styles are linked

function App() {
  return (
    <div className="App">
      {/* This is the main bridge to your new Clinical Tool */}
      <HeroSection />
      
      {/* You can add your Footer or other sections below */}
    </div>
  );
}

export default App;