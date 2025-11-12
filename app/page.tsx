'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import QuizScreen from './components/QuizScreen';
import HRAssistantScreen from './components/HRAssistantScreen';

// Dynamically import other screens to reduce initial bundle size
const StudentHelperScreen = dynamic(() => import('./components/StudentHelperScreen'), { ssr: false });
const CreativeWriterScreen = dynamic(() => import('./components/CreativeWriterScreen'), { ssr: false });
const CodeAgentScreen = dynamic(() => import('./components/CodeAgentScreen'), { ssr: false });
const TravelPlannerScreen = dynamic(() => import('./components/TravelPlannerScreen'), { ssr: false });

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize feather icons
    if (typeof window !== 'undefined') {
      const initializeFeather = async () => {
        const feather = await import('feather-icons');
        feather.replace();
      };
      initializeFeather();
    }
  }, []);

  const handleLogin = () => {
    setCurrentScreen('dashboard');
  };

  const handleOpenAgent = (agent: string) => {
    setCurrentScreen(agent);
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  if (!isClient) {
    return (
      <div className="screen active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <main>
      {/* Show Navbar for all screens except login */}
      {currentScreen !== 'login' && <Navbar />}
      
      {/* Login Screen */}
      <div className={`screen ${currentScreen === 'login' ? 'active' : ''}`}>
        <LoginScreen onLogin={handleLogin} />
      </div>

      {/* Dashboard Screen */}
      <div className={`screen ${currentScreen === 'dashboard' ? 'active' : ''}`}>
        <DashboardScreen onOpenAgent={handleOpenAgent} />
      </div>

      {/* Agent Screens */}
      <div className={`screen ${currentScreen === 'quiz' ? 'active' : ''}`}>
        <QuizScreen onBack={handleBackToDashboard} />
      </div>

      <div className={`screen ${currentScreen === 'hr' ? 'active' : ''}`}>
        <HRAssistantScreen onBack={handleBackToDashboard} />
      </div>

      <div className={`screen ${currentScreen === 'student' ? 'active' : ''}`}>
        <StudentHelperScreen onBack={handleBackToDashboard} />
      </div>

      <div className={`screen ${currentScreen === 'creative' ? 'active' : ''}`}>
        <CreativeWriterScreen onBack={handleBackToDashboard} />
      </div>

      <div className={`screen ${currentScreen === 'code' ? 'active' : ''}`}>
        <CodeAgentScreen onBack={handleBackToDashboard} />
      </div>

      <div className={`screen ${currentScreen === 'travel' ? 'active' : ''}`}>
        <TravelPlannerScreen onBack={handleBackToDashboard} />
      </div>
    </main>
  );
}