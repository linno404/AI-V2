'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Cpu, 
  Code, 
  Zap, 
  Shield, 
  Globe,
  Users,
  Star,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  Target,
  Heart
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function AIProfilePage() {
  const [user, setUser] = useState<any>(null);
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
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Get instant responses with our optimized AI engine",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Intelligence",
      description: "Advanced AI that understands context and nuance",
      gradient: "from-blue-400 to-purple-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your conversations are secure and confidential",
      gradient: "from-green-400 to-blue-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multilingual",
      description: "Support for multiple languages and cultures",
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  const technologies = [
    {
      icon: <Cpu className="w-8 h-8" />,
      name: "Cerebras AI",
      description: "Powered by cutting-edge LLaMA 3.1 model"
    },
    {
      icon: <Code className="w-8 h-8" />,
      name: "Modern Web Stack",
      description: "Built with Next.js 15, TypeScript, and Tailwind CSS"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      name: "Advanced NLP",
      description: "Natural Language Processing for human-like conversations"
    }
  ];

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
                <h1 className="text-4xl font-bold text-white mb-2">About Xyonz-AI</h1>
                <p className="text-gray-400 text-lg">
                  Meet your intelligent AI assistant
                </p>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl" />
            <Card className="relative bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
              <CardContent className="p-12">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <Brain className="w-16 h-16 text-blue-400" />
                        <div className="absolute inset-0 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Xyonz-AI</h2>
                        <p className="text-gray-400">Advanced AI Assistant</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      Xyonz-AI is a cutting-edge artificial intelligence assistant designed to help humans 
                      with tasks, answer questions, and provide intelligent conversation. Built with the latest 
                      AI technology, I'm here to make your life easier and more productive.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">1000+ Users</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">4.9 Rating</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Global</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
                      <Brain className="w-32 h-32 text-blue-400" />
                    </div>
                    <div className="absolute inset-0 w-64 h-64 bg-blue-400/10 rounded-3xl blur-2xl animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-16">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  To democratize artificial intelligence and make it accessible to everyone. 
                  We believe AI should be helpful, safe, and enhance human capabilities rather 
                  than replace them. Xyonz-AI is built on these principles to serve as a 
                  trusted companion in your digital journey.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Core Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Innovation and continuous improvement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span>User privacy and data security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Accessibility for all users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Ethical AI development</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`mb-4 flex justify-center bg-gradient-to-r ${feature.gradient} p-3 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center text-blue-400">
                      {tech.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tech.name}</h3>
                    <p className="text-gray-400 text-sm">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Developer Section */}
          <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-white/10">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-400" />
                    Created with Passion
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-4">
                    Xyonz-AI was developed by <span className="text-blue-400 font-semibold">Lucky Herlinno Putra</span> 
                    with a vision to create an AI assistant that truly understands and helps humans. 
                    This project represents the perfect blend of cutting-edge technology and user-centric design.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => router.push('/chat')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Try Xyonz-AI
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                    <Heart className="w-16 h-16 text-red-400" />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 bg-red-400/10 rounded-full blur-xl animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}