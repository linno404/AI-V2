'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare, Users, TrendingUp, Clock, Star } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface ChatHistory {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    avgResponseTime: '2.3s',
    satisfactionRate: '98%'
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Redirect admin to admin dashboard
    if (parsedUser.role === 'ADMIN') {
      router.push('/admin');
      return;
    }

    setUser(parsedUser);
    loadChatHistory();
  }, [router]);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data);
        setStats(prev => ({
          ...prev,
          totalChats: data.length,
          totalMessages: data.length * 2 // user + ai messages
        }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const recentChats = chatHistory.slice(0, 5);

  return (
    <div className="min-h-screen bg-black">
      <Sidebar user={user} />
      
      {/* Main Content */}
      <div className={`${user ? 'ml-0 lg:ml-64' : 'ml-0'} transition-all duration-300`}>
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.username}!
            </h1>
            <p className="text-gray-400">
              Here's what's happening with your AI conversations today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Chats</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalChats}</div>
                <p className="text-xs text-gray-500">+2 from last week</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Messages</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
                <p className="text-xs text-gray-500">User + AI responses</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Avg Response</CardTitle>
                <Clock className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.avgResponseTime}</div>
                <p className="text-xs text-gray-500">Lightning fast</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Satisfaction</CardTitle>
                <Star className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.satisfactionRate}</div>
                <p className="text-xs text-gray-500">User happiness</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            {/* Recent Chats */}
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recent Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentChats.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No conversations yet</p>
                    <p className="text-gray-500 text-sm mt-2">Start your first AI chat!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentChats.map((chat) => (
                      <div key={chat.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-400">
                            {new Date(chat.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white text-sm line-clamp-2 mb-2">
                          {chat.message}
                        </p>
                        <p className="text-gray-400 text-xs line-clamp-2">
                          {chat.response}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <button 
                    onClick={() => router.push('/chat')}
                    className="w-full p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-white font-medium">Start New Chat</p>
                        <p className="text-gray-400 text-sm">Begin a new conversation</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/history')}
                    className="w-full p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-white font-medium">View History</p>
                        <p className="text-gray-400 text-sm">Browse past conversations</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/ai-profile')}
                    className="w-full p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-white font-medium">About AI</p>
                        <p className="text-gray-400 text-sm">Learn about Xyonz-AI</p>
                      </div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}