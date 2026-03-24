import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Feedback {
  id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

const AdminFeedbackScreen = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:3000/api/feedback');
      setFeedbacks(response.data);
    } catch (err) {
      setError('获取反馈数据失败');
      console.error('Failed to fetch feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}分钟前`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}小时前`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}天前`;
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button onClick={fetchFeedbacks} style={styles.retryButton}>
          重试
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>反馈管理</h1>
        <button onClick={fetchFeedbacks} style={styles.refreshButton}>
          刷新
        </button>
      </div>

      {feedbacks.length === 0 ? (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>暂无反馈数据</p>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {feedbacks.map((feedback) => (
            <div key={feedback.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.name}>{feedback.name}</h3>
                <span style={styles.email}>{feedback.email}</span>
              </div>
              <div style={styles.divider}></div>
              <p style={styles.content}>{feedback.content}</p>
              <div style={styles.cardFooter}>
                <span style={styles.timestamp}>
                  {formatRelativeTime(feedback.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0,
  },
  refreshButton: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    marginBottom: '12px',
  },
  name: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  email: {
    fontSize: '14px',
    color: '#64748b',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '16px 0',
  },
  content: {
    fontSize: '16px',
    color: '#334155',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    color: '#64748b',
    fontSize: '16px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '16px',
    marginBottom: '16px',
  },
  retryButton: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    color: '#64748b',
    fontSize: '16px',
  },
};

export default AdminFeedbackScreen;