import { create } from 'zustand';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    profilePic: string;
  };
  createdAt: string;
  read: boolean;
}

interface ChatState {
  activeConversation: string | null;
  messages: Message[];
  onlineUsers: string[];
  typingUsers: Record<string, string>;
  setActiveConversation: (conversationId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setOnlineUsers: (users: string[]) => void;
  setTypingUser: (conversationId: string, username: string) => void;
  removeTypingUser: (conversationId: string) => void;
  clearChat: () => void;
}

const useChatStore = create<ChatState>((set) => ({
  activeConversation: null,
  messages: [],
  onlineUsers: [],
  typingUsers: {},
  setActiveConversation: (conversationId) => 
    set({ activeConversation: conversationId }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setTypingUser: (conversationId, username) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: username },
    })),
  removeTypingUser: (conversationId) =>
    set((state) => {
      const { [conversationId]: _, ...rest } = state.typingUsers;
      return { typingUsers: rest };
    }),
  clearChat: () => set({ messages: [], activeConversation: null }),
}));

export default useChatStore;