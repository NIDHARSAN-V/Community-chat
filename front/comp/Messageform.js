import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

function MessageForm() {
  const user = useSelector((state) => state.user);
  const scrollViewRef = useRef(null);
  const [message, setMessage] = useState("");
  const { socket, currentRoom, messages, setMessages, privateMemberMsg } = useContext(AppContext);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'user'

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
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={styles.tabText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'user' && styles.activeTab]}
          onPress={() => setActiveTab('user')}
        >
          <Text style={styles.tabText}>User</Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally render based on the active tab */}
      {activeTab === 'chat' ? (
        <View style={styles.chatPanel}>
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
                    style={
                      sender && sender.email === user?.email ? styles.message : styles.incomingMessage
                    }
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
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Your Message"
              value={message}
              onChangeText={(text) => setMessage(text)}
            />
            <Button title="Send" onPress={handleSubmit} color="#ff9900" disabled={!user} />
          </View>
        </View>
      ) : (
        <View style={styles.userPanel}>
          <Text style={styles.alertText}>User Panel Additionak info</Text>
          {/* Add any user-related content here */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    backgroundColor: '#ff9900',
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatPanel: {
    flex: 1,
  },
  userPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
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
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'grey',
  },
  input: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    color: 'white',
    backgroundColor: 'black',
  },
});

export default MessageForm;
