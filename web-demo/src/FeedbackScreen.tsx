import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  content: string;
}

const FeedbackScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:3000/api/feedback', data);
      setSuccess('反馈提交成功！');
      reset();
    } catch (err) {
      setError('提交失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>提交反馈</h1>
          <p style={styles.subtitle}>请填写以下信息，我们会认真考虑您的建议</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>姓名</label>
            <input
              {...register('name', { required: '请输入您的姓名' })}
              type="text"
              style={{
                ...styles.input,
                ...(errors.name ? styles.inputError : {})
              }}
              placeholder="请输入您的姓名"
            />
            {errors.name && (
              <span style={styles.errorText}>{errors.name.message}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>邮箱</label>
            <input
              {...register('email', {
                required: '请输入您的邮箱',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '请输入有效的邮箱地址',
                },
              })}
              type="email"
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {})
              }}
              placeholder="请输入您的邮箱"
            />
            {errors.email && (
              <span style={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>反馈内容</label>
            <textarea
              {...register('content', { required: '请输入反馈内容' })}
              style={{
                ...styles.input,
                ...styles.textarea,
                ...(errors.content ? styles.inputError : {})
              }}
              placeholder="请输入您的反馈内容"
              rows={5}
            />
            {errors.content && (
              <span style={styles.errorText}>{errors.content.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
          >
            {loading ? '提交中...' : '提交反馈'}
          </button>
        </form>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.successAlert}>
            <span>{success}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    animation: 'fadeInUp 0.6s ease-out',
  },
  formCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#f8fafc',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    color: '#f8fafc',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  textarea: {
    minHeight: '120px',
    resize: 'vertical' as const,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '4px',
  },
  submitButton: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
    marginTop: '8px',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  errorAlert: {
    marginTop: '24px',
    padding: '16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    color: '#ef4444',
    textAlign: 'center',
  },
  successAlert: {
    marginTop: '24px',
    padding: '16px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    color: '#10b981',
    textAlign: 'center',
  },
};

export default FeedbackScreen;