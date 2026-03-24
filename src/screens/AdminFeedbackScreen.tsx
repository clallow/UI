import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  RefreshControl,
  Animated,
  StatusBar,
} from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, FAB } from 'react-native-paper';
import axios from 'axios';
import { theme } from '../styles/theme';

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
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchFeedbacks();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('获取反馈失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
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

  const renderFeedbackItem = ({ item, index }: { item: Feedback; index: number }) => {
    const itemAnim = new Animated.Value(0);
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: itemAnim,
            transform: [
              {
                translateY: itemAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>{item.name}</Title>
              <Text style={styles.timeText}>{formatRelativeTime(item.createdAt)}</Text>
            </View>
            <Paragraph style={styles.emailText}>{item.email}</Paragraph>
            <Paragraph style={styles.contentText}>{item.content}</Paragraph>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>反馈管理</Text>
        <Text style={styles.subtitle}>共收到 {feedbacks.length} 条反馈</Text>
      </View>

      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item._id}
        renderItem={renderFeedbackItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无反馈数据</Text>
            <Text style={styles.emptySubtext}>下拉刷新以获取最新数据</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="refresh"
        onPress={onRefresh}
        theme={{
          colors: {
            accent: theme.colors.primary,
          },
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  cardContainer: {
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.glass.background,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.glass.border,
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    flex: 1,
  },
  timeText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.tertiary,
  },
  emailText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.sm,
  },
  contentText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.body.lineHeight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.tertiary,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.lg,
  },
});

export default AdminFeedbackScreen;