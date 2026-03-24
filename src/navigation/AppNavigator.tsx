import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedbackScreen from '../screens/FeedbackScreen';
import AdminFeedbackScreen from '../screens/AdminFeedbackScreen';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Feedback: undefined;
  AdminFeedbacks: undefined;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Feedback"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: '反馈提交' }} />
        <Stack.Screen name="AdminFeedbacks" component={AdminFeedbackScreen} options={{ title: '反馈管理' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;