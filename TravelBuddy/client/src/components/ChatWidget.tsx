import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, User, X, Send, Lightbulb } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Itinerary, ChatMessage } from "@shared/schema";
import { localStorage } from "@/lib/localStorage";

interface ChatWidgetProps {
  itinerary: Itinerary | null;
  onClose?: () => void;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === "user";
  
  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className="flex-1">
        <div className={`rounded-lg p-3 max-w-xs ${
          isUser 
            ? 'bg-primary text-white ml-auto' 
            : 'bg-slate-100 text-slate-800'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.context?.itineraryModified && (
            <Badge variant="secondary" className="mt-2 text-xs">
              Itinerary Modified
            </Badge>
          )}
        </div>
        <p className={`text-xs text-slate-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1">
        <div className="bg-slate-100 rounded-lg p-3 max-w-xs">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce-dot"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const suggestedQuestions = [
  "Add nightlife activities",
  "Find cheaper restaurants", 
  "More outdoor activities",
  "Add cultural experiences",
  "Show me local markets",
];

export default function ChatWidget({ itinerary, onClose }: ChatWidgetProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history
  const { data: chatData } = useQuery({
    queryKey: [`/api/chat/history/${itinerary?.id || 'current'}`],
    enabled: true,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (chatData && !hasInitialized) {
      const chatHistory = Array.isArray(chatData) ? chatData : (chatData.messages || []);
      if (chatHistory.length > 0) {
        setMessages(chatHistory);
      } else {
        // Initialize with welcome message if no history
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          type: 'assistant',
          content: "Hello! How can I assist you with your trip? I can help you modify activities, suggest alternatives, or answer any questions about your itinerary.",
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
      setHasInitialized(true);
    }
  }, [chatData, hasInitialized]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat/message", {
        message,
        itineraryId: itinerary?.id || 'current',
      });
      return response.json();
    },
    onMutate: (message) => {
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        type: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setIsTyping(true);
      
      // Log chat action
      localStorage.logUserAction({
        type: 'chat',
        details: { message, timestamp: new Date().toISOString() },
      });
    },
    onSuccess: (data) => {
      setIsTyping(false);
      setMessages(prev => [...prev, data.message]);
      
      // Save updated chat history
      const updatedMessages = [...messages, data.message];
      localStorage.saveChatHistory(updatedMessages);
    },
    onError: (error) => {
      setIsTyping(false);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'assistant',
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (!message) return;
    
    sendMessageMutation.mutate(message);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessageMutation.mutate(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <Card className="shadow-lg h-96 lg:h-[600px] flex flex-col sticky top-6">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800 flex items-center">
          <Bot className="mr-2 text-primary" />
          Trip Advisor
        </h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your trip..."
            className="flex-1 text-sm"
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || sendMessageMutation.isPending}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Suggested Questions */}
        <div className="mt-3">
          <div className="flex items-center text-xs text-slate-500 mb-2">
            <Lightbulb className="w-3 h-3 mr-1" />
            Try asking:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question) => (
              <button
                key={question}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors"
                disabled={sendMessageMutation.isPending}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
