'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Send, 
  Plus, 
  Trash2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Bot,
  User,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.role === 'ADMIN') {
      router.push('/admin');
      return;
    }

    setUser(parsedUser);
    
    // Focus input on mount
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: userData.id
        })
      });

      const data = await response.json();

      // Remove typing message
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      setIsTyping(false);

      if (response.ok) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      // Remove typing message
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Network error. Please check your connection.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleNewChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar user={user} />
      
      {/* Main Chat Area */}
      <div className={`${user ? 'ml-0 lg:ml-64' : 'ml-0'} transition-all duration-300 flex flex-col h-screen`}>
        {/* Chat Header */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="relative">
                  <Bot className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                  <div className="absolute inset-0 w-5 h-5 lg:w-6 lg:h-6 bg-blue-400/20 rounded-full blur-lg animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg lg:text-xl font-semibold text-white">Xyonz-AI</h1>
                  <p className="text-xs lg:text-sm text-gray-400 hidden sm:block">Advanced AI Assistant</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-gray-400 hover:text-white"
                disabled={messages.length === 0}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="text-gray-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 lg:px-8 py-8">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative inline-block mb-8">
                  <Bot className="w-16 h-16 text-blue-400" />
                  <div className="absolute inset-0 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  How can I help you today?
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  I'm here to assist you with questions, creative tasks, analysis, and more. 
                  Just type your message below and press Enter.
                </p>
                
                {/* Suggested prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mt-6 lg:mt-8 max-w-2xl lg:max-w-4xl mx-auto">
                  {[
                    "Explain quantum computing in simple terms",
                    "Write a poem about artificial intelligence",
                    "Help me brainstorm ideas for a project",
                    "What are the benefits of meditation?"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(prompt)}
                      className="p-3 lg:p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-left transition-all duration-200 group text-sm"
                    >
                      <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
                        {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 lg:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-2xl lg:max-w-3xl ${
                      message.role === 'user' ? 'order-first' : ''
                    }`}>
                      {message.isTyping ? (
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      ) : (
                        <div className={`p-4 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white ml-auto'
                            : 'bg-white/5 text-white border border-white/10'
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          
                          {/* Message actions */}
                          <div className={`flex items-center gap-2 mt-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}>
                            {message.role === 'assistant' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyMessage(message.content)}
                                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-green-400 h-8 w-8 p-0"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <span className="text-xs text-gray-500">
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 lg:px-8 py-4">
            <div className="flex gap-2 lg:gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Send a message..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-12 focus:border-blue-400 focus:ring-blue-400/20 text-sm lg:text-base"
                  disabled={isLoading}
                />
                {inputMessage.length > 0 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    {inputMessage.length}
                  </div>
                )}
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 lg:px-4 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
              <Sparkles className="w-3 h-3 mr-1" />
              Xyonz-AI can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}