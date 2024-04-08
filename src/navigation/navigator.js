import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import UpdateTaskScreen from '../screens/UpdateTaskScreen';
import DateListScreen from '../screens/DateListScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Auth" />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Tasks"
        component={DashboardScreen}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="format-list-bulleted-square"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTaskScreen}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={size}
            />
          ),
        }}
      />
      {/* <Tab.Screen name="Profile" component={HomeScreen} /> */}
    </Tab.Navigator>
  );
}

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeStack} />
      <Stack.Screen name="UpdateTask" component={UpdateTaskScreen} />
      <Stack.Screen name="DateList" component={DateListScreen} />
    </Stack.Navigator>
  );
}
