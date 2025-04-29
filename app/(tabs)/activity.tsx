import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, StatusBar } from "react-native";
import Container from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { getDummyChatActivity, ChatActivity } from "@/utils/getChatActivity";
import { Ionicons } from "@expo/vector-icons";

// Interface for chat history items
export interface ChatHistoryItem {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  isLocked: boolean;
}

// Get dummy chat history data
const getDummyChatHistory = (): ChatHistoryItem[] => {
  return [
    {
      id: "1",
      query: "write a message \"Hey everyone we are live on the Aptos Chain as Well Try out the Q...\"",
      response: "\"Hey squad! 🚀 We're now live on the Aptos Chain too! Try out Qiro Finance on ...\"",
      timestamp: "2023-10-01T10:00:00Z",
      isLocked: true,
    },
    {
      id: "2",
      query: "I wanted to buy macbook m4 pro 16inch base model from usa. From which I can g...",
      response: "Here are some current prices and links for the base model M4 MacBook Pro 16-inc...",
      timestamp: "2023-09-25T14:30:00Z",
      isLocked: true,
    },
    {
      id: "3",
      query: "Can decentralized exchanges Lending...",
      response: "Yes, Decentralized Exchanges (DEXs), Lending, Derivatives, Yield Farming, Insur...",
      timestamp: "2023-09-23T09:15:00Z",
      isLocked: true,
    },
    {
      id: "4",
      query: "Answer this question in most satisfied way \"Why do you want to apply to Summ...",
      response: "",
      timestamp: "2023-09-20T16:45:00Z",
      isLocked: false,
    },
    {
      id: "5",
      query: "I wanted to buy macbook m4 pro 16inch base model from usa. From which I can g...",
      response: "Here are some current prices and links for the base model M4 MacBook Pro 16-inc...",
      timestamp: "2023-09-25T14:30:00Z",
      isLocked: true,
    },
    {
      id: "6",
      query: "Can decentralized exchanges Lending...",
      response: "Yes, Decentralized Exchanges (DEXs), Lending, Derivatives, Yield Farming, Insur...",
      timestamp: "2023-09-23T09:15:00Z",
      isLocked: true,
    },
    {
      id: "7",
      query: "Answer this question in most satisfied way \"Why do you want to apply to Summ...",
      response: "",
      timestamp: "2023-09-20T16:45:00Z",
      isLocked: false,
    },
  ];
};

// Calculate time difference from now
const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInWeeks = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24 * 7));
  
  if (diffInWeeks < 1) {
    return "This week";
  } else {
    return `${diffInWeeks}w`;
  }
};

// Chat history item component
const ChatHistoryListItem = ({ item }: { item: ChatHistoryItem }) => {
  return (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.queryText} numberOfLines={2}>
          {item.query}
        </Text>
        <Text style={styles.responseText} numberOfLines={2}>
          {item.response || "No response yet"}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        {item.isLocked && (
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={14} color="#9CA3AF" />
          </View>
        )}
        <Text style={styles.timestampText}>{getTimeAgo(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Separator component
const Separator = () => <View style={styles.separator} />;

export default function Library() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

  useEffect(() => {
    const history = getDummyChatHistory();
    setChatHistory(history);
  }, []);

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading style={styles.heading}>History</Heading>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={chatHistory}
          renderItem={({ item }) => <ChatHistoryListItem item={item} />}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.listContent}
        />
        
        <TouchableOpacity style={styles.floatingButton}>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  searchButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentContainer: {
    marginBottom: 8,
  },
  queryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  timestampText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  separator: {
    height: 1,
    backgroundColor: "#333333",
    marginHorizontal: 16,
  },
  bottomNavBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#111111",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  navButton: {
    padding: 8,
  },
  floatingButton: {
    position: "absolute",
    right: 24,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  plusIcon: {
    fontSize: 32,
    color: "#00BFFF",
    marginTop: -4,
  },
});