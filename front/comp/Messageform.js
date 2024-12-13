import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function MessagePanel() {
  const user = useSelector((state) => state.user);
  const scrollViewRef = useRef(null);
  const [message, setMessage] = useState("");
  const { socket, currentRoom, messages, setMessages, privateMemberMsg } = useContext(AppContext);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  function getFormattedDate() {
    const date = new Date();
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }

  const todayDate = getFormattedDate();

  useEffect(() => {
    socket.off("room-messages").on("room-messages", (roomMessages) => {
      setMessages(roomMessages);
    });
  }, [socket, setMessages]);

  function handleSubmit() {
    if (!message) {
      return;
    }
    const today = new Date();
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const time = `${today.getHours()}:${minutes}`;
    const roomId = currentRoom;
    socket.emit('message-room', roomId, message, user, time, todayDate);
    setMessage("");
  }

  return (
    <ScrollView style={styles.messagesOutput} ref={scrollViewRef} onContentSizeChange={scrollToBottom}>
      {user && !privateMemberMsg?._id && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>You are in {currentRoom}</Text>
        </View>
      )}
      {user && privateMemberMsg?._id && (
        <View style={styles.conversationalInfo}>
          <Text style={styles.alertText}>Your conversation with {privateMemberMsg.name}</Text>
          <Image source={{ uri: privateMemberMsg.picture }} style={styles.converPic} />
        </View>
      )}
      {!user && (
        <View style={styles.alertDanger}>
          <Text style={styles.alertText}>Please login to your account</Text>
        </View>
      )}
      {user && messages.map(({ _id: date, messagesByDate }, idx) => (
        <View key={idx}>
          <Text style={styles.messageDateIndicator}>{date}</Text>
          {messagesByDate?.map(({ content, time, from: sender }, msgidx) => (
            <View
              style={sender && sender.email === user?.email ? styles.message : styles.incomingMessage}
              key={msgidx}
            >
              <View style={styles.messageInner}>
                <View style={styles.messageHeader}>
                  {sender && sender.picture ? (
                    <Image source={{ uri: sender.picture }} style={styles.senderPic} />
                  ) : (
                    <View style={styles.senderPicPlaceholder}></View>
                  )}
                  <Text style={styles.messageSender}>
                    {sender && sender._id === user?._id ? "You" : sender?.name || "Unknown"}
                  </Text>
                </View>
                <Text style={styles.messageContent}>{content}</Text>
                <Text style={styles.messageTimestamp}>{time}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function UserPanel() {
  return (
    <View style={styles.userPanel}>
      <Text style={styles.alertText}>User Panel</Text>
      {/* Add any user-related content here */}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function MessageForm() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chat" component={MessagePanel} />
      <Tab.Screen name="User" component={UserPanel} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  messagesOutput: {
    flex: 1,
    padding: 5,
    backgroundColor: 'black',
    color: 'white',
  },
  alert: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 10,
  },
  conversationalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  converPic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginLeft: 10,
  },
  senderPicPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#ccc',
  },
  alertDanger: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  alertText: {
    fontWeight: '700',
    color: 'black',
  },
  messageDateIndicator: {
    textAlign: 'center',
    backgroundColor: 'orangered',
    color: 'white',
    padding: 5,
    fontWeight: '700',
    borderRadius: 5,
    marginBottom: 10,
  },
  message: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    maxWidth: '80%',
  },
  incomingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    maxWidth: '80%',
  },
  messageInner: {
    flexDirection: 'column',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  senderPic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  messageSender: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  messageContent: {
    color: 'white',
    marginBottom: 5,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    borderColor: 'grey',
    backgroundColor: 'black',
    fontWeight: '500',
  },
  messageTimestamp: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: 'red',
  },
  userPanel: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
});
