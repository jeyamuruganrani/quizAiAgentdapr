'use client';

interface DashboardScreenProps {
  onOpenAgent: (agent: string) => void;
}

export default function DashboardScreen({ onOpenAgent }: DashboardScreenProps) {
  const agents = [
    {
      id: 'quiz',
      title: 'Quiz Master',
      icon: 'help-circle',
      color: 'purple',
      description: 'Generates quizzes and tests your knowledge on any topic.'
    },
    {
      id: 'hr',
      title: 'HR Assistant',
      icon: 'users',
      color: 'blue',
      description: 'Helps with company policies, onboarding, and leave requests.'
    },
    {
      id: 'student',
      title: 'Student Helper',
      icon: 'book-open',
      color: 'green',
      description: 'Assists with research, summarization, and study planning.'
    },
    {
      id: 'creative',
      title: 'Creative Writer',
      icon: 'edit-3',
      color: 'yellow',
      description: 'Your partner for brainstorming, writing, and creative content.'
    },
    {
      id: 'code',
      title: 'Code Assistant',
      icon: 'code',
      color: 'red',
      description: 'Helps you debug code, write functions, and learn new languages.'
    },
    {
      id: 'travel',
      title: 'Travel Planner',
      icon: 'map',
      color: 'teal',
      description: 'Finds flights, hotels, and plans your next adventure.'
    }
  ];

  return (
    <div className="screen active">
      <div className="dashboard">
        <div className="dashboard-content">
          <div className="sidebar">
            <div>
              <div className="profile">
                <img src="https://i.pravatar.cc/150?img=3" alt="User avatar" />
                <div className="info">
                  <strong>JACK_SPARROW</strong>
                  <p>rocky.doe@email.com</p>
                </div>
              </div>

              <div className="menu">
                <button className="active">
                  <i data-feather="home"></i>
                  <span>Home</span>
                </button>
                <button>
                  <i data-feather="message-square"></i>
                  <span>Chat History</span>
                </button>
                <button>
                  <i data-feather="settings"></i>
                  <span>Settings</span>
                </button>
              </div>
            </div>
            <div className="help-text">
              <i data-feather="help-circle"></i>
              <span>Help</span>
            </div>
          </div>

          <div className="main-content">
            <h1>Choose Your AI Agent</h1>
            <div className="search-container">
              <i data-feather="search" className="search-icon"></i>
              <input className="search" placeholder="Find an agent..." />
            </div>

            <div className="cards">
              {agents.map((agent) => (
                <div 
                  key={agent.id}
                  className="card" 
                  onClick={() => onOpenAgent(agent.id)}
                >
                  <div className={`card-icon ${agent.color}`}>
                    <i data-feather={agent.icon}></i>
                  </div>
                  <h3>{agent.title}</h3>
                  <p>{agent.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}