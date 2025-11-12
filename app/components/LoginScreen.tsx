'use client';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const handleLogin = () => {
    // Add your login logic here
    onLogin();
  };

  return (
    <div id="loginScreen" className="screen active">
      <div className="login-box">
        <div className="card-icon blue">
          <i data-feather="cpu"></i>
        </div>
        <h2>Welcome to Swarise AI</h2>
        <p>Log in to continue to your AI agents.</p>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-with-icon">
            <i data-feather="mail"></i>
            <input type="email" placeholder="Enter your email" id="email" required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon">
            <i data-feather="lock"></i>
            <input type="password" placeholder="Enter your password" id="password" required />
          </div>
          <div className="forgot"><a href="#">Forgot Password?</a></div>
        </div>

        <button className="btn-login" onClick={handleLogin}>
          <i data-feather="log-in"></i>
          Log In
        </button>

        <div className="divider"><span>OR</span></div>

        <button className="google-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="18" alt="Google logo" />
          Sign in with Google
        </button>

        <div className="signup-text">
          Don't have an account? <a href="#">Sign Up</a>
        </div>
      </div>
    </div>
  );
}