import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

const AdminFeedbackScreen = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('获取反馈失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return '刚刚';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}分钟前`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}小时前`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>反馈管理</h1>
        <p style={styles.subtitle}>共收到 {feedbacks.length} 条反馈</p>
      </div>

      <div style={styles.grid}>
        {feedbacks.map((feedback, index) => (
          <div
            key={feedback._id}
            style={{
              ...styles.card,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{feedback.name}</h3>
              <span style={styles.timeText}>
                {formatRelativeTime(feedback.createdAt)}
              </span>
            </div>
            <p style={styles.emailText}>{feedback.email}</p>
            <p style={styles.contentText}>{feedback.content}</p>
          </div>
        ))}
      </div>

      {feedbacks.length === 0 && (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>暂无反馈数据</p>
          <p style={styles.emptySubtext}>等待用户提交反馈</p>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    padding: '32px',
    animation: 'fadeInUp 0.6s ease-out',
  },
  loadingContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(99, 102, 241, 0.2)',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: '#cbd5e1',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: '8px',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    color: '#cbd5e1',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '24px',
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 0.6s ease-out both',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#f8fafc',
    margin: 0,
  },
  timeText: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  emailText: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '12px',
    margin: 0,
  },
  contentText: {
    fontSize: '16px',
    color: '#cbd5e1',
    lineHeight: '1.6',
    margin: 0,
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '48px',
  },
  emptyText: {
    fontSize: '20px',
    color: '#cbd5e1',
    marginBottom: '8px',
    margin: 0,
  },
  emptySubtext: {
    fontSize: '16px',
    color: '#94a3b8',
    margin: 0,
  },
};

export default AdminFeedbackScreen;