'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, MessageCircle, User, Zap, Brain, ArrowRight, Star, Shield, Cpu } from 'lucide-react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950 to-purple-950" />
        <div 
          className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            right: `${mousePosition.x * -0.05}px`,
            bottom: `${mousePosition.y * -0.05}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className={`relative z-10 px-6 py-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-10 h-10 text-blue-400" />
              <div className="absolute inset-0 w-10 h-10 bg-blue-400/20 rounded-full blur-lg animate-pulse" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">Xyonz-AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => window.location.href = '/login'}
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              onClick={() => window.location.href = '/login'}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chat
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '200ms' }}>
            <Star className="w-4 h-4" />
            Powered by Advanced AI Technology
          </div>

          {/* Main Headline */}
          <h1 className={`text-6xl md:text-8xl font-bold text-white mb-6 leading-tight transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '400ms' }}>
            <span className="bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
              Xyonz-AI
            </span>
            <br />
            <span className="text-4xl md:text-6xl mt-4 block font-light text-gray-300">
              Your Intelligent Assistant
            </span>
          </h1>
          
          {/* Subtext */}
          <p className={`text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: '600ms' }}>
            Experience the future of AI conversation. Built with cutting-edge technology to provide intelligent, natural, and helpful responses.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
               style={{ transitionDelay: '800ms' }}>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group"
              onClick={() => window.location.href = '/login'}
            >
              <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Try Xyonz-AI Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/30 px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/ai-profile'}
            >
              <Cpu className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Lightning Fast",
              description: "Get instant responses with our optimized AI engine",
              gradient: "from-yellow-400 to-orange-500"
            },
            {
              icon: <Brain className="w-8 h-8" />,
              title: "Smart Intelligence",
              description: "Advanced AI that understands context and nuance",
              gradient: "from-blue-400 to-purple-500"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Privacy First",
              description: "Your conversations are secure and confidential",
              gradient: "from-green-400 to-blue-500"
            }
          ].map((feature, index) => (
            <Card key={index} className={`bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-1000 hover:bg-white/10 hover:scale-105 hover:border-white/20 group ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${1000 + index * 200}ms` }}>
              <CardContent className="p-8 text-center">
                <div className={`mb-6 flex justify-center bg-gradient-to-r ${feature.gradient} p-4 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Developer Credit */}
        <div className={`text-center mt-32 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '1600ms' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400">Developed by</span>
            <span className="text-white font-medium">Lucky Herlinno Putra</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t border-white/10 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '1800ms' }}>
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Xyonz-AI. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">Powered by Advanced AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}