import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const API_URL = 'https://functions.poehali.dev/c51dbb61-b1e5-4923-98ba-c9ddd569ba13';

interface User {
  id: number;
  email: string;
  joined: string;
  messageCount: number;
  lastMessage: string | null;
}

interface Message {
  id: number;
  text: string;
  image?: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const previousMessageCountRef = useRef<{ [userId: number]: number }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Проверяем авторизацию
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      window.location.href = '/admin-login';
      return;
    }

    // Создаём звук уведомления
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWm98OScRxELTqPh8b9uJwU3jdXuyXUjBTGT3O+jcB8EM3+z7s18IwUymN3vmnMeBDN+seXHgCMF');
    
    // Запрашиваем разрешение на уведомления
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }"}, {"old_string": "  return (\n    <div className=\"min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4\">\n      <div className=\"container mx-auto\">\n        <div className=\"flex items-center justify-between mb-8\">\n          <h1 className=\"text-4xl font-bold text-white\">Admin Panel</h1>", "new_string": "  const navigate = useNavigate();\n\n  const handleLogout = () => {\n    localStorage.removeItem('adminAuth');\n    navigate('/admin-login');\n  };\n\n  return (\n    <div className=\"min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4\">\n      <div className=\"container mx-auto\">\n        <div className=\"flex items-center justify-between mb-8\">\n          <h1 className=\"text-4xl font-bold text-white\">Admin Panel</h1>\n          <div className=\"flex items-center gap-4\">"}]

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
      // Сбрасываем счётчик непрочитанных при открытии чата
      setUnreadCount(0);
      document.title = 'Admin Panel';
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}?action=users`);
      const data = await res.json();
      const newUsers = data.users;
      
      // Проверяем новые сообщения
      let hasNewMessages = false;
      let totalUnread = 0;
      
      newUsers.forEach((user: User) => {
        const previousCount = previousMessageCountRef.current[user.id] || 0;
        if (user.messageCount > previousCount && previousCount > 0) {
          hasNewMessages = true;
          totalUnread += (user.messageCount - previousCount);
          
          // Показываем уведомление в интерфейсе
          toast({
            title: '💬 Новое сообщение!',
            description: `От ${user.email}`,
            duration: 5000,
          });
          
          // Browser notification для неактивной вкладки
          if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
            new Notification('💬 Новое сообщение!', {
              body: `От ${user.email}`,
              icon: '/favicon.ico',
              tag: `new-message-${user.id}`,
              requireInteraction: false
            });
          }
        }
        previousMessageCountRef.current[user.id] = user.messageCount;
      });
      
      if (hasNewMessages && audioRef.current) {
        audioRef.current.play().catch(() => {});
        setUnreadCount(prev => prev + totalUnread);
        
        // Обновляем заголовок страницы
        document.title = `(${totalUnread}) Новые сообщения - Admin`;
      }
      
      setUsers(newUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadMessages = async (userId: number) => {
    try {
      const res = await fetch(`${API_URL}?action=messages&userId=${userId}`);
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendAdminMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    setLoading(true);
    try {
      await fetch(`${API_URL}?action=send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          message: newMessage,
          isAdmin: true
        })
      });
      setNewMessage('');
      await loadMessages(selectedUser.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-pulse">
                <Icon name="Bell" size={20} />
                {unreadCount} новых
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <Icon name="LogOut" size={20} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-150px)]">
          {/* Users List */}
          <Card className="p-4 overflow-y-auto bg-white/10 backdrop-blur border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Users" size={24} />
              Users ({users.length})
            </h2>
            <div className="space-y-2">
              {users.map((user) => {
                const prevCount = previousMessageCountRef.current[user.id] || 0;
                const hasNewMessages = user.messageCount > prevCount && prevCount > 0;
                
                return (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`relative w-full p-3 rounded-lg text-left transition-all ${
                      selectedUser?.id === user.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {hasNewMessages && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    <div className="font-semibold truncate">{user.email}</div>
                    <div className="text-xs opacity-70">
                      {user.messageCount} messages
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Chat */}
          <Card className="md:col-span-2 flex flex-col bg-white/10 backdrop-blur border-white/20">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-white/20">
                  <h3 className="font-bold text-white text-lg">{selectedUser.email}</h3>
                  <p className="text-sm text-white/60">
                    Joined: {new Date(selectedUser.joined).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'admin'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        {msg.image && (
                          <img src={msg.image} alt="Sent" className="rounded-lg mb-2 max-w-full" />
                        )}
                        <p className="text-sm">{msg.text}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-white/20">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendAdminMessage()}
                      placeholder="Type your reply..."
                      className="flex-1 bg-white/10 border-white/20 text-white"
                    />
                    <Button
                      onClick={sendAdminMessage}
                      disabled={loading}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/60">
                <div className="text-center">
                  <Icon name="MessageSquare" size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Select a user to view conversation</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;