import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  RefreshControl,
  Animated,
} from 'react-native';
import { Card, ActivityIndicator, Divider } from 'react-native-paper';
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
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    fetchFeedbacks();
  }, [fadeAnim]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
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

  const renderFeedback = ({ item }: { item: Feedback }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.timestamp}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <FlatList
        data={feedbacks}
        renderItem={renderFeedback}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366f1']}
            tintColor="#6366f1"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无反馈数据</Text>
          </View>
        }
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardHeader: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  email: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  divider: {
    marginVertical: 12,
  },
  content: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 22,
  },
  cardFooter: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
});

export default AdminFeedbackScreen;