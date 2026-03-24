import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import {
  TextInput,
  Button,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { theme } from '../styles/theme';

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
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

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
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>提交反馈</Text>
            <Text style={styles.subtitle}>请填写以下信息，我们会认真考虑您的建议</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
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
                    theme={{
                      colors: {
                        primary: theme.colors.primary,
                        placeholder: theme.colors.text.tertiary,
                        text: theme.colors.text.primary,
                        background: theme.colors.glass.background,
                      },
                    }}
                    outlineColor={theme.colors.glass.border}
                    selectionColor={theme.colors.primary}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
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
                    theme={{
                      colors: {
                        primary: theme.colors.primary,
                        placeholder: theme.colors.text.tertiary,
                        text: theme.colors.text.primary,
                        background: theme.colors.glass.background,
                      },
                    }}
                    outlineColor={theme.colors.glass.border}
                    selectionColor={theme.colors.primary}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
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
                    theme={{
                      colors: {
                        primary: theme.colors.primary,
                        placeholder: theme.colors.text.tertiary,
                        text: theme.colors.text.primary,
                        background: theme.colors.glass.background,
                      },
                    }}
                    outlineColor={theme.colors.glass.border}
                    selectionColor={theme.colors.primary}
                  />
                )}
              />
              {errors.content && (
                <Text style={styles.errorText}>{errors.content.message}</Text>
              )}
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
              labelStyle={styles.submitButtonLabel}
              disabled={loading}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                },
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                '提交反馈'
              )}
            </Button>
          </View>

          <Snackbar
            visible={!!error}
            onDismiss={() => setError('')}
            duration={3000}
            style={styles.snackbarError}
            theme={{
              colors: {
                surface: theme.colors.error,
              },
            }}
          >
            {error}
          </Snackbar>

          <Snackbar
            visible={!!success}
            onDismiss={() => setSuccess('')}
            duration={3000}
            style={styles.snackbarSuccess}
            theme={{
              colors: {
                surface: theme.colors.success,
              },
            }}
          >
            {success}
          </Snackbar>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: theme.spacing.xl,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.body.lineHeight,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.glass.background,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  textArea: {
    minHeight: 120,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  submitButtonLabel: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  snackbarError: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
  },
  snackbarSuccess: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.md,
  },
});

export default FeedbackScreen;