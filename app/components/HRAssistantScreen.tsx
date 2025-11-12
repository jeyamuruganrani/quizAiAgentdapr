'use client';

import { useState, useEffect } from 'react';

interface HRAssistantScreenProps {
  onBack: () => void;
}

interface HROption {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function HRAssistantScreen({ onBack }: HRAssistantScreenProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const hrOptions: HROption[] = [
    {
      id: 1,
      title: "Request Time Off",
      description: "Submit vacation or sick leave",
      icon: "calendar"
    },
    {
      id: 2,
      title: "View Payslips",
      description: "Access your pay stubs",
      icon: "file-text"
    },
    {
      id: 3,
      title: "Company Policy",
      description: "Find company documents",
      icon: "folder"
    },
    {
      id: 4,
      title: "Onboarding Help",
      description: "Guides for new hires",
      icon: "user-plus"
    },
    {
      id: 5,
      title: "Benefits Information",
      description: "Details on health plans",
      icon: "heart"
    }
  ];

  useEffect(() => {
    // Initialize feather icons
    const initializeFeather = async () => {
      const feather = await import('feather-icons');
      feather.replace();
    };
    initializeFeather();
  }, []);

  const handleOptionClick = (optionId: number) => {
    setSelectedOption(optionId);
  };

  return (
    <div className="screen active">
      <div className="hr-container">
        <div className="hr-content-wrapper">
          <div className="hr-sidebar">
            <div>
              <div className="hr-header">
                <div className="icon">
                  <i data-feather="users"></i>
                </div>
                <div className="info">
                  <strong>HR Assistant</strong>
                  <p>Employee Support</p>
                </div>
              </div>

              <div className="menu">
                <button onClick={onBack}>
                  <i data-feather="arrow-left"></i>
                  <span>Back to Dashboard</span>
                </button>
                <button>
                  <i data-feather="file-text"></i>
                  <span>My Documents</span>
                </button>
                <button>
                  <i data-feather="calendar"></i>
                  <span>Time Off Calendar</span>
                </button>
              </div>
            </div>
            <div className="help-text">
              <i data-feather="help-circle"></i>
              <span>HR Help</span>
            </div>
          </div>

          <div className="hr-content">
            <div className="hr-title">
              <div className="icon">
                <i data-feather="users"></i>
              </div>
              <h1>HR Assistant</h1>
            </div>

            <div className="hr-card">
              <div className="welcome-message">
                <h2>How can I help you today?</h2>
                <p>
                  <span className="checkbox-placeholder"></span>
                  Ask me anything about HR...
                </p>
              </div>

              <div className="divider-line"></div>

              <div className="hr-options-horizontal">
                {hrOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`hr-option-horizontal ${selectedOption === option.id ? 'active' : ''}`}
                    onClick={() => handleOptionClick(option.id)}
                  >
                    <div className="hr-option-icon">
                      <i data-feather={option.icon}></i>
                    </div>
                    <div className="hr-option-content">
                      <h3>{option.title}</h3>
                      <p>{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}