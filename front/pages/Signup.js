// import React, { useState } from 'react';
// import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import * as ImagePicker from 'expo-image-picker'; // For selecting images
// import axios from 'axios'; // For handling image upload to Cloudinary 
// import { useSignupUserMutation } from '../services/appApi'; // Assuming you're using RTK Query 

// function Signup() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [signupUser] = useSignupUserMutation();
//   const navigation = useNavigation();

//   // Image Picker Handler
//   const handleImagePick = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     console.log(result); // Log the result to see its structure

//     if (!result.canceled) {
//       if (result.assets[0].fileSize > 1048576) {
//         Alert.alert('Max File Size Exceeded', 'Max file size is 1MB');
//         return;
//       }
//       setImage(result.assets[0].uri);
//     }
//   };

//   // Cloudinary Image Upload
//   const uploadImage = async (uri) => {
//     const data = new FormData();
//     data.append('file', {
//       uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri, // Handle URI for iOS
//       name: 'profile.jpg',
//       type: 'image/jpeg',
//     });
//     data.append('upload_preset', 'zpjervt2'); // Your Cloudinary preset

//     try {
//       setUploading(true);
//       const res = await axios.post("https://api.cloudinary.com/v1_1/dwqjl4gti/image/upload", data);
//       setUploading(false);
//       return res.data.secure_url; // Return the URL of the uploaded image
//     } catch (error) {
//       console.error('Cloudinary upload error:', error);
//       setUploading(false);
//       Alert.alert('Upload Error', 'Error uploading image to Cloudinary');
//       return null;
//     }
//   };

//   // Submit Handler
//   const handleSubmit = async () => {
//     if (!image) {
//       Alert.alert('Image Required', 'Please upload your profile image');
//       return;
//     }

//     const imageUrl = await uploadImage(image);
//     if (!imageUrl) {
//       Alert.alert('Image Upload Failed', 'Please try again');
//       return;
//     }

//     const { data } = await signupUser({ name, email, password, picture: imageUrl });
//     if (data) {
//       navigation.navigate('Login');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Create Account</Text>
//       <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
//         <Image source={image ? { uri: image } : require('./favicon.png')} style={styles.profileImage} />
//         <Text style={styles.imageText}>Upload Image</Text>
//       </TouchableOpacity>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Enter email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         {uploading ? (
//           <ActivityIndicator size="small" color="#FFF" />
//         ) : (
//           <Text style={styles.buttonText}>Signup</Text>
//         )}
//       </TouchableOpacity>
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Already have an Account</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//           <Text style={styles.link}> Log in</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     minWidth: '80%',
//     flex: 1,
//     padding: 16,
//     justifyContent: 'center',
//     backgroundColor: 'black',
//     alignContent: 'center',
//   },
//   header: {
//     display: 'flex',
//     maxWidth: '100%',
//     fontWeight: '700',
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//     backgroundColor: 'red',
//     borderRadius: 40,
//     padding: 10,
//   },
//   imageContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//     borderWidth: 10,
//     borderRadius: 40,
//     borderColor: 'red',
//     backgroundColor: 'black',
//   },
//   profileImage: {
//     borderWidth: 5,
//     borderColor: 'orangered',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   imageText: {
//     marginTop: 10,
//     color: 'white',
//     fontWeight: '500',
//     fontSize: 18,
//   },
//   input: {
//     maxWidth: '100%',
//     height: 60,
//     borderColor: 'white',
//     borderWidth: 3,
//     borderRadius: 10,
//     paddingHorizontal: 18,
//     marginBottom: 20,
//     backgroundColor: 'grey',
//     fontSize: 20,
//     fontWeight: '500',
//     color: 'white',
//   },
//   button: {
//     backgroundColor: 'red',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   footer: {
//     marginTop: 30,
//     alignItems: 'center',
//   },
//   footerText: {
//     color: 'white',
//     fontSize: 18,
//   },
//   link: {
//     color: 'red',
//     fontSize: 19,
//     fontWeight: '500',
//     marginLeft: 4,
//   },
// });

// export default Signup;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSignupUserMutation } from '../services/appApi'; // Assuming you're using RTK Query 

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [signupUser] = useSignupUserMutation();
  const navigation = useNavigation();

  // Submit Handler
  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert('All fields are required', 'Please fill in all fields');
      return;
    }

    setUploading(true);
    try {
      const { data } = await signupUser({ name, email, password });
      if (data) {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Signup Failed', 'Please try again');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {uploading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Signup</Text>
        )}
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an Account</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}> Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: '80%',
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'black',
    alignContent: 'center',
  },
  header: {
    display: 'flex',
    maxWidth: '100%',
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'red',
    borderRadius: 40,
    padding: 10,
  },
  input: {
    maxWidth: '100%',
    height: 60,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 18,
    marginBottom: 20,
    backgroundColor: 'grey',
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 18,
  },
  link: {
    color: 'red',
    fontSize: 19,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default Signup;
