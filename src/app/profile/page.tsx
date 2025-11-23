'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit2, 
  Save,
  X,
  ArrowLeft,
  Award,
  Activity
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: ''
  });
  const [stats, setStats] = useState({
    totalChats: 0,
    joinDate: '',
    lastActive: ''
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
    
    if (parsedUser.role === 'ADMIN') {
      router.push('/admin');
      return;
    }

    setUser(parsedUser);
    setEditForm({
      username: parsedUser.username,
      email: parsedUser.email
    });
    
    loadUserStats(parsedUser.id);
  }, [router]);

  const loadUserStats = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalChats: data.length,
          joinDate: new Date().toLocaleDateString(), // Would come from user data
          lastActive: data.length > 0 ? new Date(data[0].timestamp).toLocaleDateString() : 'Never'
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      username: user.username,
      email: user.email
    });
  };

  const handleSave = async () => {
    // Here you would implement the update API call
    // For now, just update the local state
    setUser({
      ...user,
      username: editForm.username,
      email: editForm.email
    });
    localStorage.setItem('user', JSON.stringify({
      ...user,
      username: editForm.username,
      email: editForm.email
    }));
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
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
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-gray-400">
                  Manage your account information
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    {!isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEdit}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isEditing ? (
                    // View Mode
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{user.username}</h3>
                          <p className="text-gray-400">{user.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              user.role === 'ADMIN' 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Email Address</span>
                          </div>
                          <p className="text-white font-medium">{user.email}</p>
                        </div>
                        
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Account Type</span>
                          </div>
                          <p className="text-white font-medium">{user.role}</p>
                        </div>
                        
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Member Since</span>
                          </div>
                          <p className="text-white font-medium">{stats.joinDate}</p>
                        </div>
                        
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Last Active</span>
                          </div>
                          <p className="text-white font-medium">{stats.lastActive}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <Input
                            name="username"
                            value={editForm.username}
                            onChange={handleInputChange}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                          <Input
                            name="email"
                            type="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-white/5 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {stats.totalChats}
                    </div>
                    <p className="text-gray-400 text-sm">Total Chats</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-sm">Join Date</span>
                      <span className="text-white text-sm font-medium">{stats.joinDate}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-sm">Account Status</span>
                      <span className="text-green-400 text-sm font-medium">Active</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-sm">Plan</span>
                      <span className="text-blue-400 text-sm font-medium">Free</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => router.push('/chat')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start New Chat
                  </Button>
                  
                  <Button
                    onClick={() => router.push('/history')}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    View Chat History
                  </Button>
                  
                  <Button
                    onClick={() => router.push('/ai-profile')}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    About Xyonz-AI
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}