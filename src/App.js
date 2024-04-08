import React, { createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/navigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const TasksContext = createContext();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
