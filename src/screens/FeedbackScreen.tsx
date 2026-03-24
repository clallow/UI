import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import {
  TextInput,
  Button,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
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
  const fadeAnim = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:3000/api/feedback', data);
      setSuccess('反馈提交成功！');
      // 重置表单
      // @ts-ignore
      handleSubmit.reset();
    } catch (err) {
      setError('提交失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>提交反馈</Text>
            <Text style={styles.subtitle}>请填写以下信息，我们会认真考虑您的建议</Text>

            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="name"
                rules={{ required: '请输入您的姓名' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="姓名"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={styles.input}
                    mode="outlined"
                    error={!!errors.name}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
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
                  <TextInput
                    label="邮箱"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="email-address"
                    error={!!errors.email}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="content"
                rules={{ required: '请输入反馈内容' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="反馈内容"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={[styles.input, styles.textArea]}
                    mode="outlined"
                    multiline
                    numberOfLines={5}
                    error={!!errors.content}
                  />
                )}
              />
              {errors.content && (
                <Text style={styles.errorText}>{errors.content.message}</Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButtonContainer}
            >
              <Button
                mode="contained"
                style={styles.submitButton}
                labelStyle={styles.submitButtonLabel}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  '提交反馈'
                )}
              </Button>
            </TouchableOpacity>

            <Snackbar
              visible={!!error}
              onDismiss={() => setError('')}
              duration={3000}
              style={styles.snackbarError}
            >
              {error}
            </Snackbar>

            <Snackbar
              visible={!!success}
              onDismiss={() => setSuccess('')}
              duration={3000}
              style={styles.snackbarSuccess}
            >
              {success}
            </Snackbar>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  textArea: {
    height: 150,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  submitButtonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 6,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  snackbarError: {
    backgroundColor: '#ef4444',
  },
  snackbarSuccess: {
    backgroundColor: '#10b981',
  },
});

export default FeedbackScreen;