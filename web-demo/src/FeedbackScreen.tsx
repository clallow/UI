import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  content: string;
}

const FeedbackScreen = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage(null);
    try {
      await axios.post('http://localhost:3000/api/feedback', data);
      setMessage({ type: 'success', text: '反馈提交成功！' });
      reset();
    } catch (err) {
      setMessage({ type: 'error', text: '提交失败，请稍后重试' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>提交反馈</h1>
        <p style={styles.subtitle}>请填写以下信息，我们会认真考虑您的建议</p>

        {message && (
          <div style={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>姓名</label>
            <Controller
              control={control}
              name="name"
              rules={{ required: '请输入您的姓名' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <input
                  type="text"
                  value={value || ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  placeholder="请输入您的姓名"
                />
              )}
            />
            {errors.name && <span style={styles.errorText}>{errors.name.message}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>邮箱</label>
            <Controller
              control={control}
              name="email"
              rules={{
                required: '请输入您的邮箱',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '请输入有效的邮箱地址',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <input
                  type="email"
                  value={value || ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  style={styles.input}
                  placeholder="请输入您的邮箱"
                />
              )}
            />
            {errors.email && <span style={styles.errorText}>{errors.email.message}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>反馈内容</label>
            <Controller
              control={control}
              name="content"
              rules={{ required: '请输入反馈内容' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <textarea
                  value={value || ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  style={styles.textarea}
                  placeholder="请输入您的反馈内容"
                  rows={5}
                />
              )}
            />
            {errors.content && <span style={styles.errorText}>{errors.content.message}</span>}
          </div>

          <button
            type="submit"
            style={loading ? { ...styles.submitButton, ...styles.submitButtonDisabled } : styles.submitButton}
            disabled={loading}
          >
            {loading ? '提交中...' : '提交反馈'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  textarea: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '120px',
    fontFamily: 'inherit',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    marginTop: '8px',
  },
  submitButtonDisabled: {
    backgroundColor: '#a5b4fc',
    cursor: 'not-allowed',
  },
  successMessage: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
};

export default FeedbackScreen;