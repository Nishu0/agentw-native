// app/(tabs)/chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Animated,
  SafeAreaView
} from 'react-native';
import { Send, ArrowLeft, Mic, Camera, Maximize } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Dark theme colors
const darkTheme = {
  background: "#000000",
  surface: "#121212",
  cardBackground: "#1E1E1E",
  inputBackground: "#222222",
  primary: "#00BFFF", // Blue color from your tab bar
  text: "#FFFFFF",
  secondaryText: "#9CA3AF",
  border: "#333333",
  divider: "#2A2A2A",
  botMessage: "#2A2A2A",
  userMessage: "#00BFFF"
};

// Message type
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Mock responses - in a real app these would come from an API
const getBotResponse = (userMessage: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Static responses based on certain keywords
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        resolve("Hello! I'm your Move assistant. How can I help you today?");
      } else if (userMessage.toLowerCase().includes('help')) {
        resolve("I can help you with Move language queries, blockchain concepts, and development questions. What would you like to know?");
      } else if (userMessage.toLowerCase().includes('move')) {
        resolve("Move is a programming language designed for safe resource management on blockchains. It powers chains like Aptos and Sui. What would you like to learn about Move?");
      } else {
        resolve("I'm here to assist with your Move language and blockchain questions. Could you provide more details so I can help you better?");
      }
    }, 1000);
  });
};

const ChatScreen = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // If this is the first message, hide the welcome screen
    if (showWelcome) {
      fadeOutWelcome();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    // Update messages with user's message
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Set typing indicator
    setIsTyping(true);

    try {
      // Get bot response
      const botResponseText = await getBotResponse(userMessage.text);
      
      // Create bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isUser: false,
        timestamp: new Date()
      };
      
      // Update messages with bot's response
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Fade out welcome screen
  const fadeOutWelcome = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowWelcome(false);
    });
  };
  
  // Handle input focus
  const handleInputFocus = () => {
    if (showWelcome) {
      fadeOutWelcome();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Render an individual message
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.botMessageText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  // Render the typing indicator
  const renderTypingIndicator = () => (
    <View style={[styles.messageBubble, styles.botMessage, styles.typingIndicator]}>
      <ActivityIndicator size="small" color={darkTheme.primary} />
      <Text style={styles.typingText}>Agent is typing...</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={darkTheme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agent</Text>
        <TouchableOpacity style={styles.expandButton}>
          <Maximize size={20} color={darkTheme.text} />
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Welcome or Messages */}
        {showWelcome ? (
          <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
            <Text style={styles.welcomeTitle}>Hello,</Text>
            <Text style={styles.welcomeText}>
              How can I help you to make your Move?
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        {/* Typing indicator */}
        {isTyping && !showWelcome && renderTypingIndicator()}
      </View>
      
      {/* Fixed Input Area - Explicitly positioned above the tab bar */}
      <View style={styles.fixedInputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color={darkTheme.secondaryText} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Ask anything..."
            placeholderTextColor={darkTheme.secondaryText}
            value={inputText}
            onChangeText={setInputText}
            onFocus={handleInputFocus}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
          />
          
          <TouchableOpacity style={styles.micButton}>
            <Mic size={20} color={darkTheme.secondaryText} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Stack options to hide the header
export const unstable_settings = {
  headerShown: false,
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: darkTheme.background,
    position: 'relative', // Important for absolute positioning of input
  },
  contentContainer: {
    flex: 1,
    backgroundColor: darkTheme.background,
    // Add padding at bottom to make space for input
    paddingBottom: 70, // Adjust this value based on your input height
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.divider,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.text,
  },
  expandButton: {
    padding: 8,
  },
  // Fixed input container positioned at the bottom
  fixedInputContainer: {
    position: 'absolute',
    bottom: 0, // Position at the bottom of the screen
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: darkTheme.background,
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
    // This z-index ensures it's above other content
    zIndex: 1000,
    // This ensures it appears above the tab bar
    marginBottom: 60, // Adjust based on your tab bar height
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.inputBackground,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cameraButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    color: darkTheme.text,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  botMessage: {
    backgroundColor: darkTheme.botMessage,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: darkTheme.userMessage,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  botMessageText: {
    color: darkTheme.text,
  },
  userMessageText: {
    color: darkTheme.text,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  typingText: {
    color: darkTheme.secondaryText,
    marginLeft: 8,
    fontSize: 14,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: darkTheme.secondaryText,
    textAlign: 'center',
    lineHeight: 34,
  },
});

export default ChatScreen;