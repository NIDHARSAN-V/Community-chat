import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useLogoutUserMutation } from '../services/appApi'; // Assuming you have this setup in React Native
import * as Animatable from 'react-native-animatable'; // Import Animatable for animations

function HomePage() {
  const user = useSelector((state) => state.user); // Get the user from Redux store
  const [auth, setAuth] = useState(true);
  const navigation = useNavigation();
  const [logoutUser] = useLogoutUserMutation(); // Using the logout mutation

  useEffect(() => {
    if (!user) {
      setAuth(false);
      navigation.navigate('Login'); 
    }
  }, [user, navigation]);

  const handleLogout = async () => {
    try {
      console.log("logout HERE INSIDE " );
      await logoutUser(user);
      console.log("After the function");
    } catch (error) {
      console.error('Logout failed: ', error);
    }
  };

  return (
    <Animatable.View
      style={[styles.container, { backgroundColor: auth ? '#f0f0f0' : '#e3e3e3' }]} // Animate background color change
      animation="fadeIn"
      duration={1000}
    >
      {auth ? (
        <Animatable.View style={styles.homeContainer} animation="zoomIn" duration={1500}>
          <Text style={styles.title}>Welcome to Community Chat</Text>

          <Animatable.View animation="fadeInUp" duration={1000}>
            <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* Logout Button with slide-in effect */}
          <Animatable.View animation="fadeIn" duration={1200}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      ) : (
        <Animatable.View style={styles.notAuthorizedContainer} animation="bounceIn" duration={1200}>
          <Text style={styles.notAuthorizedText}>You Are Not Authorized to the Home Page</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    transition: 'background-color 1s ease', // Smooth background color transition
  },
  homeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  getStartedText: {
    color: 'white',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
  notAuthorizedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  notAuthorizedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomePage;
