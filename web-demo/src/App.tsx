import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FeedbackScreen from './FeedbackScreen';
import AdminFeedbackScreen from './AdminFeedbackScreen';

const App = () => {
  return (
    <Router>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.navContent}>
            <h1 style={styles.logo}>反馈系统</h1>
            <div style={styles.navLinks}>
              <Link to="/" style={styles.link}>提交反馈</Link>
              <Link to="/admin" style={styles.link}>管理反馈</Link>
            </div>
          </div>
        </nav>
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<FeedbackScreen />} />
            <Route path="/admin" element={<AdminFeedbackScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  nav: {
    backgroundColor: '#6366f1',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
};

export default App;