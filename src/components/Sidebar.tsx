'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  Cpu, 
  User, 
  LogOut, 
  Menu, 
  X,
  Brain,
  Sparkles
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

interface SidebarProps {
  user?: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // Changed from 768 to 1024 for better tablet support
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/dashboard'
    },
    {
      id: 'chat',
      label: 'Chat AI',
      icon: <MessageSquare className="w-5 h-5" />,
      href: '/chat'
    },
    {
      id: 'history',
      label: 'Riwayat Chat',
      icon: <History className="w-5 h-5" />,
      href: '/history'
    },
    {
      id: 'ai-profile',
      label: 'Profil AI',
      icon: <Cpu className="w-5 h-5" />,
      href: '/ai-profile'
    },
    {
      id: 'profile',
      label: 'Profil Pengguna',
      icon: <User className="w-5 h-5" />,
      href: '/profile'
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  // Mobile overlay
  if (isMobile && isMobileOpen) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
        <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-md border-r border-white/10 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Brain className="w-8 h-8 text-blue-400" />
                  <div className="absolute inset-0 w-8 h-8 bg-blue-400/20 rounded-full blur-lg animate-pulse" />
                </div>
                <span className="text-xl font-bold text-white">Xyonz-AI</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`transition-transform duration-200 ${
                    isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user?.username}</p>
                    <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-30">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <div className={`fixed left-0 top-0 h-full bg-black/95 backdrop-blur-md border-r border-white/10 transition-all duration-300 z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}>
          <div className="p-4">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <Brain className="w-8 h-8 text-blue-400" />
                <div className="absolute inset-0 w-8 h-8 bg-blue-400/20 rounded-full blur-lg animate-pulse" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold text-white transition-opacity duration-300">
                  Xyonz-AI
                </span>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-8">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    isActive(item.href)
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={`transition-transform duration-200 ${
                    isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="font-medium transition-opacity duration-300">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  
                  {/* Hover tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </nav>

            {/* User section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              {!isCollapsed && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user?.username}</p>
                      <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                title={isCollapsed ? 'Logout' : undefined}
              >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </button>
            </div>

            {/* Collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-8 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <Sparkles className={`w-3 h-3 transition-transform duration-200 ${
                isCollapsed ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}