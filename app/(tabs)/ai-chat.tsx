import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Send, Bot, User, Lightbulb, AlertCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useChat } from '@/hooks/useChat';

const ChatMessage = ({ message, isUser }) => (
  <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.botMessage]}>
    <View style={styles.messageIcon}>
      {isUser ? (
        <User size={20} color="#ffffff" />
      ) : (
        <Bot size={20} color="#6c5ce7" />
      )}
    </View>
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
      <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
        {message}
      </Text>
    </View>
  </View>
);

const SuggestionCard = ({ title, description, icon: Icon, onPress }) => (
  <Pressable style={styles.suggestionCard} onPress={onPress}>
    <Icon size={24} color="#6c5ce7" />
    <View style={styles.suggestionContent}>
      <Text style={styles.suggestionTitle}>{title}</Text>
      <Text style={styles.suggestionDescription}>{description}</Text>
    </View>
  </Pressable>
);

export default function AIChat() {
  const { messages, isTyping, sendMessage } = useChat();
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Financial Assistant</Text>
        <Text style={styles.headerSubtitle}>Smart insights for your money</Text>
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
          <SuggestionCard
            title="Budget Analysis"
            description="Analyze my spending patterns"
            icon={Lightbulb}
            onPress={() => handleSuggestionPress("Analyze my spending patterns and give me insights")}
          />
          <SuggestionCard
            title="Savings Plan"
            description="Create a personalized savings goal"
            icon={AlertCircle}
            onPress={() => handleSuggestionPress("Help me create a personalized savings plan")}
          />
        </ScrollView>
      </View>

      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={styles.messageIcon}>
              <Bot size={20} color="#6c5ce7" />
            </View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#6c5ce7" />
              <Text style={styles.typingText}>AI is thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Ask about your finances..."
          placeholderTextColor="#74b9ff"
          multiline
        />
        <Pressable style={styles.sendButton} onPress={handleSendMessage}>
          <Send size={20} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1421',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#74b9ff',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  suggestionsScroll: {
    flexDirection: 'row',
  },
  suggestionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
    borderWidth: 1,
    borderColor: '#16213e',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  suggestionContent: {
    marginTop: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 12,
    color: '#74b9ff',
    lineHeight: 16,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#6c5ce7',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#16213e',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-end',
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#16213e',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0d1421',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    color: '#ffffff',
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  sendButton: {
    backgroundColor: '#6c5ce7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  typingBubble: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#16213e',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    color: '#74b9ff',
    fontSize: 14,
    fontStyle: 'italic',
  },
});