'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MessageSquare, 
  Calendar, 
  User, 
  Bot,
  Clock,
  Filter,
  ArrowLeft,
  Trash2,
  Eye
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface ChatHistory {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
}

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ChatHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    loadChatHistory();
  }, [router]);

  useEffect(() => {
    // Filter chat history based on search term
    if (searchTerm.trim() === '') {
      setFilteredHistory(chatHistory);
    } else {
      const filtered = chatHistory.filter(chat => 
        chat.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.response.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchTerm, chatHistory]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data.reverse()); // Show newest first
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const chatDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - chatDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return chatDate.toLocaleDateString();
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
      
      {/* Main Content */}
      <div className={`${user ? 'ml-0 lg:ml-64' : 'ml-0'} transition-all duration-300`}>
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Chat History</h1>
                <p className="text-gray-400">
                  Browse and manage your conversation history
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 text-sm"
                />
              </div>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-sm lg:text-base px-3 lg:px-4"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{chatHistory.length}</p>
                    <p className="text-gray-400 text-sm">Total Conversations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {chatHistory.length > 0 ? formatDate(chatHistory[0].timestamp).split(' at')[0] : 'N/A'}
                    </p>
                    <p className="text-gray-400 text-sm">Last Activity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {filteredHistory.length}
                    </p>
                    <p className="text-gray-400 text-sm">Filtered Results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat List */}
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {searchTerm ? 'No conversations found' : 'No conversations yet'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Start your first conversation to see it here'
                    }
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => router.push('/chat')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Start New Chat
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">You</p>
                            <p className="text-gray-400 text-xs">{formatDate(chat.timestamp)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedChat(chat);
                            }}
                            className="text-gray-400 hover:text-white h-8 w-8 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              {truncateText(chat.message, 150)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm">
                              {truncateText(chat.response, 150)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Detail Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">
                    {formatDate(selectedChat.timestamp)}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedChat(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                      <p className="text-white whitespace-pre-wrap">{selectedChat.message}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white whitespace-pre-wrap">{selectedChat.response}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}