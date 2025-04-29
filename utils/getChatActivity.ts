export interface ChatActivity {
    id: string;
    message: string;
    timestamp: string;
    sender: string;
  }
  
export function getDummyChatActivity(): ChatActivity[] {
    return [
      {
        id: "1",
        message: "Hello, how are you?",
        timestamp: "2023-10-01T10:00:00Z",
        sender: "Agent A",
      },
      {
        id: "2",
        message: "I'm fine, thank you!",
        timestamp: "2023-10-01T10:01:00Z",
        sender: "Agent B",
      },
      {
        id: "3",
        message: "Let's discuss the project.",
        timestamp: "2023-10-01T10:02:00Z",
        sender: "Agent A",
      },
    ];
  }