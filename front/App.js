import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; // Import Safe Area Context
import { store, persistor } from './store'; // Adjust the path as necessary
import { AppContext, socket } from './context/appContext'; // Adjust the path as necessary

// Import your pages as components
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Signup from './pages/Signup';

const Stack = createStackNavigator();

function AppNavigator() {
  // Select user from Redux store
  const user = useSelector((state) => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // User is logged in, show Home and Chat
          <>
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        ) : (
          // User is not logged in, show Login and Signup
          <>
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Login" component={Login} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  // State management
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppContext.Provider
            value={{
              socket,
              currentRoom,
              setCurrentRoom,
              members,
              setMembers,
              messages,
              setMessages,
              privateMemberMsg,
              setPrivateMsg,
              rooms,
              setRooms,
              newMessages,
              setNewMessages,
            }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <AppNavigator />
            </SafeAreaView>
          </AppContext.Provider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
