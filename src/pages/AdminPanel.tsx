import { useEffect, useState, useRef, useCallback } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingMessagesRef = useRef<boolean>(false);

  const loadMessages = useCallback(async (userId: number) => {
    if (!userId || loadingMessagesRef.current) return;
    
    loadingMessagesRef.current = true;
    try {
      const res = await fetch(`${API_URL}?action=messages&userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    } finally {
      loadingMessagesRef.current = false;
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}?action=users`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const newUsers = data.users || [];
      
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
  }, []);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      window.location.href = '/admin-login';
      return;
    }

    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWm98OScRxELTqPh8b9uJwU3jdXuyXUjBTGT3O+jcB8EM3+z7s18IwUymN3vmnMeBDN+seXHgCMF');
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    loadUsers();
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
      setUnreadCount(0);
      document.title = 'Admin Panel';
    }
  }, [selectedUser]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedUser) return;

    const maxFiles = 5;
    const filesToUpload = Array.from(files).slice(0, maxFiles);

    if (files.length > maxFiles) {
      toast({
        title: 'Предупреждение',
        description: `Можно загрузить максимум ${maxFiles} фото`,
        variant: 'destructive'
      });
    }

    setLoading(true);
    let uploadedCount = 0;

    for (const file of filesToUpload) {
      try {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const response = await fetch(`${API_URL}?action=send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedUser.id,
            message: 'Photo',
            imageUrl: base64,
            isAdmin: true
          })
        });

        if (response.ok) {
          uploadedCount++;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    await loadMessages(selectedUser.id);
    setLoading(false);

    toast({
      title: 'Готово!',
      description: `Загружено ${uploadedCount} из ${filesToUpload.length} фото`,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin-login');
  };

  const clearChat = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите очистить этот чат?')) return;
    
    setLoading(true);
    try {
      await fetch(`${API_URL}?action=clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      setMessages([]);
      toast({
        title: '✅ Чат очищен',
        description: 'История сообщений удалена',
      });
      
      await loadUsers();
    } catch (error) {
      console.error('Failed to clear chat:', error);
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось очистить чат',
        variant: 'destructive'
      });
    }
    setLoading(false);
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
                  <div key={user.id} className="relative">
                    <button
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
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{user.email}</div>
                          <div className="text-xs opacity-70">
                            {user.messageCount} messages
                          </div>
                        </div>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                          title="Send email"
                        >
                          <Icon name="Mail" size={16} />
                        </a>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Chat */}
          <Card className="md:col-span-2 flex flex-col bg-white/10 backdrop-blur border-white/20">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-white/20 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg">{selectedUser.email}</h3>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedUser.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Send email"
                      >
                        <Icon name="Mail" size={18} />
                      </a>
                    </div>
                    <p className="text-sm text-white/60">
                      Joined: {new Date(selectedUser.joined).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => clearChat(selectedUser.id)}
                    variant="ghost"
                    size="sm"
                    disabled={loading}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Icon name="Trash2" size={18} className="mr-1" />
                    Очистить
                  </Button>
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
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                      max={5}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      className="px-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Icon name="ImagePlus" size={20} />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !loading && sendAdminMessage()}
                      placeholder="Type your reply..."
                      disabled={loading}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                    <Button
                      onClick={sendAdminMessage}
                      disabled={loading}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      {loading ? (
                        <Icon name="Loader2" size={20} className="animate-spin" />
                      ) : (
                        <Icon name="Send" size={20} />
                      )}
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