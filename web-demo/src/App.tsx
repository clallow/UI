import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FeedbackScreen from './FeedbackScreen';
import AdminFeedbackScreen from './AdminFeedbackScreen';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav style={styles.nav}>
      <div style={styles.navContent}>
        <h1 style={styles.logo}>反馈系统</h1>
        <div style={styles.navLinks}>
          <Link 
            to="/" 
            style={{
              ...styles.link,
              ...(location.pathname === '/' ? styles.linkActive : {})
            }}
          >
            提交反馈
          </Link>
          <Link 
            to="/admin" 
            style={{
              ...styles.link,
              ...(location.pathname === '/admin' ? styles.linkActive : {})
            }}
          >
            管理反馈
          </Link>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div style={styles.container}>
        <Navigation />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<FeedbackScreen />} />
            <Route path="/admin" element={<AdminFeedbackScreen />} />
          </Routes>
        </main>
        <footer style={styles.footer}>
          <p style={styles.footerText}>© 2026 反馈系统 - 现代化UI演示版本</p>
        </footer>
      </div>
    </Router>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    animation: 'slideDown 0.5s ease-out',
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
    letterSpacing: '-0.025em',
  },
  navLinks: {
    display: 'flex',
    gap: '16px',
  },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontWeight: 500,
    padding: '12px 24px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  linkActive: {
    color: '#f8fafc',
    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    padding: '24px 0',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(20px)',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '14px',
    margin: 0,
  },
};

export default App;