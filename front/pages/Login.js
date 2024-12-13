import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLoginUserMutation } from '../services/appApi';
import { AppContext } from '../context/appContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const { socket } = useContext(AppContext);
  const navigation = useNavigation();

  async function handleLogin() {
    try {
      const { data } = await loginUser({ email, password });
      if (data) {
        socket.emit('new-user');
        navigation.navigate('Chat');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.header}>Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="white"
        />
        <Text style={styles.text}>We'll never share your email with anyone else.</Text>

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="white"
        />

        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
          <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.text}>Don't have an Account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  form: {
    marginHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    height: 60,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 18,
    marginBottom: 20,
    backgroundColor: 'grey',
    fontSize: 20,
    color: 'white',
  },
  text: {
    fontSize: 14,
    color: 'white',
    marginBottom: 16,
  },
  buttonContainer: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  link: {
    color: 'red',
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 18,
  },
});

export default Login;
