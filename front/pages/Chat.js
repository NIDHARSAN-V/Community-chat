import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons (or any other icon set)
import MessageForm from '../comp/Messageform';
import PanelSide from '../comp/PanelSide';

function Chat() {
  const [isPanelVisible, setIsPanelVisible] = useState(false); 

  // Function to toggle PanelSide visibility 
  const togglePanel = () => { 
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <View style={styles.container}>
      {/* Icon button at top-right corner */}
      <TouchableOpacity style={styles.avatarButton} onPress={togglePanel}>
        <Icon 
          name={isPanelVisible ? 'user-times' : 'user-circle'}  // Use appropriate icons
          size={40}  // Adjust the icon size
          color="white"  // Set the icon color
        />
      </TouchableOpacity>

      {/* Conditionally render PanelSide */}
      {isPanelVisible && (
        <View style={styles.panelSide}>
          <PanelSide />
        </View>
      )}

      <View style={[styles.messageForm, { flex: isPanelVisible ? 2 : 1 }]}>
        <MessageForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  avatarButton: {
    position: 'absolute',
    top: 10,
    right: 8,
    zIndex: 1, // Ensures the avatar stays on top of other elements
  },
  panelSide: {
    flex: 2,
  },
  messageForm: {
    flex: 5,
    top: 4,
  },
});

export default Chat;
